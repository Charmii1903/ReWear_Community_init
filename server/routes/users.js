const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all public users (for browsing)
router.get('/browse', async (req, res) => {
  try {
    const { skill, location, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isPublic: true, isBanned: false };

    // Filter by skill
    if (skill) {
      query.$or = [
        { 'skillsOffered.name': { $regex: skill, $options: 'i' } },
        { 'skillsWanted.name': { $regex: skill, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const users = await User.find(query)
      .select('name location profilePhoto skillsOffered skillsWanted availability rating')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'rating.average': -1, createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Browse users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email')
      .populate('rating');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isPublic && req.user?._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Profile is private' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add skill offered
router.post('/skills/offered', auth, [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid skill level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, level = 'Intermediate' } = req.body;

    // Check if skill already exists
    const existingSkill = req.user.skillsOffered.find(
      skill => skill.name.toLowerCase() === name.toLowerCase()
    );

    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    req.user.skillsOffered.push({ name, description, level });
    await req.user.save();

    res.json({
      message: 'Skill added successfully',
      skillsOffered: req.user.skillsOffered
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add skill wanted
router.post('/skills/wanted', auth, [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, priority = 'Medium' } = req.body;

    // Check if skill already exists
    const existingSkill = req.user.skillsWanted.find(
      skill => skill.name.toLowerCase() === name.toLowerCase()
    );

    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    req.user.skillsWanted.push({ name, description, priority });
    await req.user.save();

    res.json({
      message: 'Skill wanted added successfully',
      skillsWanted: req.user.skillsWanted
    });
  } catch (error) {
    console.error('Add skill wanted error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update skill offered
router.put('/skills/offered/:skillId', auth, [
  body('name').optional().trim().notEmpty().withMessage('Skill name cannot be empty'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid skill level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const skill = req.user.skillsOffered.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    Object.assign(skill, req.body);
    await req.user.save();

    res.json({
      message: 'Skill updated successfully',
      skillsOffered: req.user.skillsOffered
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update skill wanted
router.put('/skills/wanted/:skillId', auth, [
  body('name').optional().trim().notEmpty().withMessage('Skill name cannot be empty'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const skill = req.user.skillsWanted.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    Object.assign(skill, req.body);
    await req.user.save();

    res.json({
      message: 'Skill wanted updated successfully',
      skillsWanted: req.user.skillsWanted
    });
  } catch (error) {
    console.error('Update skill wanted error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete skill offered
router.delete('/skills/offered/:skillId', auth, async (req, res) => {
  try {
    const skill = req.user.skillsOffered.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill.remove();
    await req.user.save();

    res.json({
      message: 'Skill removed successfully',
      skillsOffered: req.user.skillsOffered
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete skill wanted
router.delete('/skills/wanted/:skillId', auth, async (req, res) => {
  try {
    const skill = req.user.skillsWanted.id(req.params.skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill.remove();
    await req.user.save();

    res.json({
      message: 'Skill wanted removed successfully',
      skillsWanted: req.user.skillsWanted
    });
  } catch (error) {
    console.error('Delete skill wanted error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update availability
router.put('/availability', auth, [
  body('weekdays').optional().isBoolean().withMessage('weekdays must be a boolean'),
  body('weekends').optional().isBoolean().withMessage('weekends must be a boolean'),
  body('evenings').optional().isBoolean().withMessage('evenings must be a boolean'),
  body('customSchedule').optional().trim().isLength({ max: 200 }).withMessage('Custom schedule must be less than 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    Object.assign(req.user.availability, req.body);
    await req.user.save();

    res.json({
      message: 'Availability updated successfully',
      availability: req.user.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Ban user
router.put('/:userId/ban', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = true;
    await user.save();

    res.json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Unban user
router.put('/:userId/unban', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = false;
    await user.save();

    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 