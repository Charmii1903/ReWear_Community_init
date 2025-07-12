const express = require('express');
const { body, validationResult } = require('express-validator');
const Swap = require('../models/Swap');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a new swap request
router.post('/', auth, [
  body('recipientId').isMongoId().withMessage('Valid recipient ID is required'),
  body('requestedSkill.name').trim().notEmpty().withMessage('Requested skill name is required'),
  body('offeredSkill.name').trim().notEmpty().withMessage('Offered skill name is required'),
  body('message').optional().trim().isLength({ max: 1000 }).withMessage('Message must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipientId, requestedSkill, offeredSkill, message } = req.body;

    // Check if recipient exists and is public
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (!recipient.isPublic) {
      return res.status(403).json({ message: 'Cannot send request to private profile' });
    }

    if (recipient.isBanned) {
      return res.status(403).json({ message: 'Cannot send request to banned user' });
    }

    // Check if requester has the offered skill
    const hasOfferedSkill = req.user.skillsOffered.some(
      skill => skill.name.toLowerCase() === offeredSkill.name.toLowerCase()
    );
    if (!hasOfferedSkill) {
      return res.status(400).json({ message: 'You must have the offered skill in your profile' });
    }

    // Check if recipient has the requested skill
    const hasRequestedSkill = recipient.skillsOffered.some(
      skill => skill.name.toLowerCase() === requestedSkill.name.toLowerCase()
    );
    if (!hasRequestedSkill) {
      return res.status(400).json({ message: 'Recipient does not have the requested skill' });
    }

    // Check if there's already a pending swap between these users
    const existingSwap = await Swap.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id }
      ],
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'There is already an active swap request between you two' });
    }

    const swap = new Swap({
      requester: req.user._id,
      recipient: recipientId,
      requestedSkill,
      offeredSkill,
      message
    });

    await swap.save();

    // Populate user details for response
    await swap.populate('requester', 'name profilePhoto');
    await swap.populate('recipient', 'name profilePhoto');

    res.status(201).json({
      message: 'Swap request created successfully',
      swap
    });
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's swap requests (sent and received)
router.get('/my-swaps', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { requester: req.user._id },
        { recipient: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const swaps = await Swap.find(query)
      .populate('requester', 'name profilePhoto')
      .populate('recipient', 'name profilePhoto')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Swap.countDocuments(query);

    res.json({
      swaps,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + swaps.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get my swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept swap request
router.put('/:swapId/accept', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swap.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only accept requests sent to you' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    swap.status = 'accepted';
    await swap.save();

    await swap.populate('requester', 'name profilePhoto');
    await swap.populate('recipient', 'name profilePhoto');

    res.json({
      message: 'Swap request accepted successfully',
      swap
    });
  } catch (error) {
    console.error('Accept swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject swap request
router.put('/:swapId/reject', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swap.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only reject requests sent to you' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    swap.status = 'rejected';
    await swap.save();

    await swap.populate('requester', 'name profilePhoto');
    await swap.populate('recipient', 'name profilePhoto');

    res.json({
      message: 'Swap request rejected successfully',
      swap
    });
  } catch (error) {
    console.error('Reject swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel swap request (by requester)
router.put('/:swapId/cancel', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swap.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel requests you sent' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }

    swap.status = 'cancelled';
    await swap.save();

    await swap.populate('requester', 'name profilePhoto');
    await swap.populate('recipient', 'name profilePhoto');

    res.json({
      message: 'Swap request cancelled successfully',
      swap
    });
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete swap
router.put('/:swapId/complete', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only complete accepted swaps' });
    }

    // Check if user is part of the swap
    if (swap.requester.toString() !== req.user._id.toString() && 
        swap.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only complete swaps you are part of' });
    }

    swap.status = 'completed';
    swap.completedAt = new Date();
    await swap.save();

    await swap.populate('requester', 'name profilePhoto');
    await swap.populate('recipient', 'name profilePhoto');

    res.json({
      message: 'Swap completed successfully',
      swap
    });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add feedback to completed swap
router.post('/:swapId/feedback', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const swap = await Swap.findById(req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swap.status !== 'completed') {
      return res.status(400).json({ message: 'Can only add feedback to completed swaps' });
    }

    const { rating, comment } = req.body;
    const isRequester = swap.requester.toString() === req.user._id.toString();

    if (isRequester) {
      if (swap.feedback.requesterRating) {
        return res.status(400).json({ message: 'You have already provided feedback for this swap' });
      }
      swap.feedback.requesterRating = rating;
      swap.feedback.requesterComment = comment;
    } else {
      if (swap.feedback.recipientRating) {
        return res.status(400).json({ message: 'You have already provided feedback for this swap' });
      }
      swap.feedback.recipientRating = rating;
      swap.feedback.recipientComment = comment;
    }

    await swap.save();

    // Update user ratings if both parties have provided feedback
    if (swap.feedback.requesterRating && swap.feedback.recipientRating) {
      const recipient = await User.findById(swap.recipient);
      const requester = await User.findById(swap.requester);

      if (recipient && requester) {
        // Update recipient rating
        const recipientTotalRating = recipient.rating.average * recipient.rating.count + swap.feedback.recipientRating;
        recipient.rating.count += 1;
        recipient.rating.average = recipientTotalRating / recipient.rating.count;
        await recipient.save();

        // Update requester rating
        const requesterTotalRating = requester.rating.average * requester.rating.count + swap.feedback.requesterRating;
        requester.rating.count += 1;
        requester.rating.average = requesterTotalRating / requester.rating.count;
        await requester.save();
      }
    }

    await swap.populate('requester', 'name profilePhoto');
    await swap.populate('recipient', 'name profilePhoto');

    res.json({
      message: 'Feedback added successfully',
      swap
    });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get swap by ID
router.get('/:swapId', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.swapId)
      .populate('requester', 'name profilePhoto')
      .populate('recipient', 'name profilePhoto');

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is part of the swap
    if (swap.requester._id.toString() !== req.user._id.toString() && 
        swap.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ swap });
  } catch (error) {
    console.error('Get swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 