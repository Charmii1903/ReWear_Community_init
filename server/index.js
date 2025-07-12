
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Temporary in-memory database for testing
const users = [
  {
    _id: '1',
    name: 'Rishika',
    email: 'rishika@example.com',
    password: 'password123',
    skillsOffered: [
      { _id: '1', name: 'JavaScript', description: 'Expert in modern JavaScript frameworks', level: 'expert' },
      { _id: '2', name: 'React', description: 'Proficient in React development', level: 'intermediate' }
    ],
    skillsWanted: [
      { _id: '3', name: 'Python', description: 'Want to learn data science', level: 'beginner' }
    ],
    availability: { weekdays: true, weekends: false, evenings: true },
    isPublic: true,
    role: 'user',
    rating: { average: 4.5, count: 10 },
    isBanned: false,
    location: 'New York, NY',
    createdAt: new Date(Date.now() - 86400000 * 30)
  },
  {
    _id: '2',
    name: 'Medha',
    email: 'medha@example.com',
    password: 'password123',
    skillsOffered: [
      { _id: '4', name: 'Python', description: 'Data science and machine learning', level: 'expert' },
      { _id: '5', name: 'Design', description: 'UI/UX design and prototyping', level: 'intermediate' }
    ],
    skillsWanted: [
      { _id: '6', name: 'JavaScript', description: 'Want to learn web development', level: 'beginner' }
    ],
    availability: { weekdays: true, weekends: true, evenings: false },
    isPublic: true,
    role: 'user',
    rating: { average: 4.8, count: 15 },
    isBanned: false,
    location: 'San Francisco, CA',
    createdAt: new Date(Date.now() - 86400000 * 45)
  },
  {
    _id: '3',
    name: 'vishva patel',
    email: 'vishva@example.com',
    password: 'password123',
    skillsOffered: [
      { _id: '7', name: 'Guitar', description: 'Classical and acoustic guitar lessons', level: 'expert' },
      { _id: '8', name: 'Music Theory', description: 'Music theory and composition', level: 'intermediate' }
    ],
    skillsWanted: [
      { _id: '9', name: 'Cooking', description: 'Want to learn Italian cuisine', level: 'beginner' }
    ],
    availability: { weekdays: false, weekends: true, evenings: true },
    isPublic: true,
    role: 'user',
    rating: { average: 4.2, count: 8 },
    isBanned: false,
    location: 'Austin, TX',
    createdAt: new Date(Date.now() - 86400000 * 20)
  },
  {
    _id: '4',
    name: 'sana',
    email: 'sana@example.com',
    password: 'password123',
    skillsOffered: [
      { _id: '10', name: 'Cooking', description: 'Italian and French cuisine', level: 'expert' },
      { _id: '11', name: 'Baking', description: 'Pastry and bread making', level: 'intermediate' }
    ],
    skillsWanted: [
      { _id: '12', name: 'Photography', description: 'Want to learn portrait photography', level: 'beginner' }
    ],
    availability: { weekdays: true, weekends: true, evenings: true },
    isPublic: true,
    role: 'user',
    rating: { average: 4.9, count: 12 },
    isBanned: false,
    location: 'Chicago, IL',
    createdAt: new Date(Date.now() - 86400000 * 60)
  },
  {
    _id: '5',
    name: 'muskan',
    email: 'david@example.com',
    password: 'password123',
    skillsOffered: [
      { _id: '13', name: 'Photography', description: 'Portrait and landscape photography', level: 'expert' },
      { _id: '14', name: 'Photo Editing', description: 'Lightroom and Photoshop', level: 'intermediate' }
    ],
    skillsWanted: [
      { _id: '15', name: 'Guitar', description: 'Want to learn acoustic guitar', level: 'beginner' }
    ],
    availability: { weekdays: false, weekends: true, evenings: false },
    isPublic: true,
    role: 'user',
    rating: { average: 4.6, count: 9 },
    isBanned: false,
    location: 'Seattle, WA',
    createdAt: new Date(Date.now() - 86400000 * 15)
  },
  {
    _id: '6',
    name: 'spam',
    email: 'spam@example.com',
    password: 'password123',
    skillsOffered: [
      { _id: '16', name: 'Spam Skill', description: 'Inappropriate content here', level: 'beginner' }
    ],
    skillsWanted: [],
    availability: { weekdays: false, weekends: false, evenings: false },
    isPublic: true,
    role: 'user',
    rating: { average: 1.0, count: 2 },
    isBanned: true,
    banReason: 'Posting inappropriate content',
    location: 'Unknown',
    createdAt: new Date(Date.now() - 86400000 * 5)
  },
  {
    _id: '7',
    name: 'siddharth',
    email: 'emma@example.com',
    password: 'password123',
    skillsOffered: [
      { _id: '17', name: 'Yoga', description: 'Vinyasa and Hatha yoga instruction', level: 'expert' },
      { _id: '18', name: 'Meditation', description: 'Mindfulness and meditation techniques', level: 'intermediate' }
    ],
    skillsWanted: [
      { _id: '19', name: 'Cooking', description: 'Want to learn healthy meal prep', level: 'beginner' }
    ],
    availability: { weekdays: true, weekends: false, evenings: true },
    isPublic: true,
    role: 'user',
    rating: { average: 4.7, count: 11 },
    isBanned: false,
    location: 'Portland, OR',
    createdAt: new Date(Date.now() - 86400000 * 25)
  },
  {
    _id: '8',
    name: 'manan',
    email: 'alex@example.com',
    password: 'password123',
    skillsOffered: [
      { _id: '20', name: 'Spanish', description: 'Spanish language tutoring', level: 'expert' },
      { _id: '21', name: 'English', description: 'ESL and English tutoring', level: 'intermediate' }
    ],
    skillsWanted: [
      { _id: '22', name: 'Programming', description: 'Want to learn Python', level: 'beginner' }
    ],
    availability: { weekdays: true, weekends: true, evenings: true },
    isPublic: true,
    role: 'user',
    rating: { average: 4.4, count: 7 },
    isBanned: false,
    location: 'Miami, FL',
    createdAt: new Date(Date.now() - 86400000 * 10)
  },
  {
    _id: 'admin1',
    name: 'charmi',
    email: 'admin@skillswap.com',
    password: '123456',
    skillsOffered: [
      { _id: 'admin1', name: 'Platform Management', description: 'Admin and moderation skills', level: 'expert' }
    ],
    skillsWanted: [],
    availability: { weekdays: true, weekends: false, evenings: false },
    isPublic: false,
    role: 'admin',
    rating: { average: 5.0, count: 1 },
    isBanned: false,
    location: 'Platform HQ',
    createdAt: new Date(Date.now() - 86400000 * 100)
  }
];

const swaps = [
  {
    _id: '1',
    requester: '1',
    recipient: '2',
    requestedSkill: { _id: '3', name: 'Python', description: 'Data science and machine learning' },
    offeredSkill: { _id: '1', name: 'JavaScript', description: 'Expert in modern JavaScript frameworks' },
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000 * 5),
    completedAt: new Date(Date.now() - 86400000 * 2)
  },
  {
    _id: '2',
    requester: '3',
    recipient: '4',
    requestedSkill: { _id: '9', name: 'Cooking', description: 'Want to learn Italian cuisine' },
    offeredSkill: { _id: '7', name: 'Guitar', description: 'Classical and acoustic guitar lessons' },
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 1)
  },
  {
    _id: '3',
    requester: '5',
    recipient: '3',
    requestedSkill: { _id: '15', name: 'Guitar', description: 'Want to learn acoustic guitar' },
    offeredSkill: { _id: '13', name: 'Photography', description: 'Portrait and landscape photography' },
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 10),
    completedAt: new Date(Date.now() - 86400000 * 7)
  },
  {
    _id: '4',
    requester: '7',
    recipient: '4',
    requestedSkill: { _id: '19', name: 'Cooking', description: 'Want to learn healthy meal prep' },
    offeredSkill: { _id: '17', name: 'Yoga', description: 'Vinyasa and Hatha yoga instruction' },
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000 * 3)
  },
  {
    _id: '5',
    requester: '8',
    recipient: '1',
    requestedSkill: { _id: '22', name: 'Programming', description: 'Want to learn Python' },
    offeredSkill: { _id: '20', name: 'Spanish', description: 'Spanish language tutoring' },
    status: 'cancelled',
    createdAt: new Date(Date.now() - 86400000 * 8),
    cancelledAt: new Date(Date.now() - 86400000 * 6)
  }
];

// Simple authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  const user = users.find(u => u.token === token);
  if (!user) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
  
  req.user = user;
  next();
};

// Admin middleware
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  const user = users.find(u => u.token === token);
  if (!user) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
  
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  req.user = user;
  next();
};

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Skill Swap Platform API is running' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
      skillsOffered: [],
      skillsWanted: [],
      availability: {
        weekdays: false,
        weekends: false,
        evenings: false
      },
      isPublic: true,
      role: email === 'admin@skillswap.com' ? 'admin' : 'user',
      rating: { average: 0, count: 0 },
      isBanned: false,
      token: token_${Date.now()}_${Math.random()}
    };
    
    users.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User registered successfully',
      token: newUser.token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    if (user.isBanned) {
      return res.status(403).json({ message: 'Account has been banned' });
    }
    
    // Ensure user has a token (for users created before token system)
    if (!user.token) {
      user.token = token_${Date.now()}_${Math.random()};
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      token: user.token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
app.put('/api/auth/profile', auth, (req, res) => {
  try {
    const { name, location, isPublic } = req.body;
    
    if (name !== undefined) req.user.name = name;
    if (location !== undefined) req.user.location = location;
    if (isPublic !== undefined) req.user.isPublic = isPublic;
    
    const { password: _, ...userWithoutPassword } = req.user;
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
app.put('/api/auth/change-password', auth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    
    if (req.user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    req.user.password = newPassword;
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
app.get('/api/users/browse', (req, res) => {
  try {
    const { skill, location, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let filteredUsers = users.filter(u => u.isPublic && !u.isBanned);
    
    if (skill) {
      filteredUsers = filteredUsers.filter(u => 
        u.skillsOffered.some(s => s.name.toLowerCase().includes(skill.toLowerCase())) ||
        u.skillsWanted.some(s => s.name.toLowerCase().includes(skill.toLowerCase()))
      );
    }
    
    if (location) {
      filteredUsers = filteredUsers.filter(u => 
        u.location && u.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    const paginatedUsers = filteredUsers.slice(skip, skip + parseInt(limit));
    const total = filteredUsers.length;
    
    res.json({
      users: paginatedUsers.map(u => {
        const { password, token, ...userWithoutSensitive } = u;
        return userWithoutSensitive;
      }),
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + paginatedUsers.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Browse users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/:userId', (req, res) => {
  try {
    const user = users.find(u => u._id === req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, token, ...userWithoutSensitive } = user;
    res.json({ user: userWithoutSensitive });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Skills routes
app.post('/api/users/skills/offered', auth, (req, res) => {
  try {
    const { name, description, level = 'Intermediate' } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    
    const existingSkill = req.user.skillsOffered.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }
    
    req.user.skillsOffered.push({ name, description, level });
    
    res.json({
      message: 'Skill added successfully',
      skillsOffered: req.user.skillsOffered
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/skills/wanted', auth, (req, res) => {
  try {
    const { name, description, priority = 'Medium' } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }
    
    const existingSkill = req.user.skillsWanted.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existingSkill) {
      return res.status(400).json({ message: 'Skill already exists' });
    }
    
    req.user.skillsWanted.push({ name, description, priority });
    
    res.json({
      message: 'Skill wanted added successfully',
      skillsWanted: req.user.skillsWanted
    });
  } catch (error) {
    console.error('Add skill wanted error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete skills
app.delete('/api/users/skills/offered/:skillId', auth, (req, res) => {
  try {
    const skillIndex = parseInt(req.params.skillId);
    if (skillIndex >= 0 && skillIndex < req.user.skillsOffered.length) {
      req.user.skillsOffered.splice(skillIndex, 1);
      res.json({
        message: 'Skill removed successfully',
        skillsOffered: req.user.skillsOffered
      });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/users/skills/wanted/:skillId', auth, (req, res) => {
  try {
    const skillIndex = parseInt(req.params.skillId);
    if (skillIndex >= 0 && skillIndex < req.user.skillsWanted.length) {
      req.user.skillsWanted.splice(skillIndex, 1);
      res.json({
        message: 'Skill wanted removed successfully',
        skillsWanted: req.user.skillsWanted
      });
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    console.error('Delete skill wanted error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update availability
app.put('/api/users/availability', auth, (req, res) => {
  try {
    const { weekdays, weekends, evenings, customSchedule } = req.body;
    
    if (weekdays !== undefined) req.user.availability.weekdays = weekdays;
    if (weekends !== undefined) req.user.availability.weekends = weekends;
    if (evenings !== undefined) req.user.availability.evenings = evenings;
    if (customSchedule !== undefined) req.user.availability.customSchedule = customSchedule;
    
    res.json({
      message: 'Availability updated successfully',
      availability: req.user.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Swaps routes
app.post('/api/swaps', auth, (req, res) => {
  try {
    const { recipientId, requestedSkill, offeredSkill, message } = req.body;
    
    if (!recipientId || !requestedSkill?.name || !offeredSkill?.name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const recipient = users.find(u => u._id === recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    const newSwap = {
      _id: Date.now().toString(),
      requester: req.user._id,
      recipient: recipientId,
      requestedSkill,
      offeredSkill,
      status: 'pending',
      message,
      createdAt: new Date()
    };
    
    swaps.push(newSwap);
    
    res.status(201).json({
      message: 'Swap request created successfully',
      swap: newSwap
    });
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/swaps/my-swaps', auth, (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let userSwaps = swaps.filter(s => s.requester === req.user._id || s.recipient === req.user._id);
    
    if (status) {
      userSwaps = userSwaps.filter(s => s.status === status);
    }
    
    // Populate user details for each swap
    const populatedSwaps = userSwaps.map(swap => {
      const requester = users.find(u => u._id === swap.requester);
      const recipient = users.find(u => u._id === swap.recipient);
      return {
        ...swap,
        requester: { _id: requester._id, name: requester.name },
        recipient: { _id: recipient._id, name: recipient.name }
      };
    });
    
    const paginatedSwaps = populatedSwaps.slice(skip, skip + parseInt(limit));
    const total = populatedSwaps.length;
    
    res.json({
      swaps: paginatedSwaps,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + paginatedSwaps.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get my swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Swap actions
app.put('/api/swaps/:swapId/accept', auth, (req, res) => {
  try {
    const swap = swaps.find(s => s._id === req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    if (swap.recipient !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to accept this swap' });
    }
    
    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap is not in pending status' });
    }
    
    swap.status = 'accepted';
    swap.acceptedAt = new Date();
    
    res.json({
      message: 'Swap accepted successfully',
      swap
    });
  } catch (error) {
    console.error('Accept swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/swaps/:swapId/reject', auth, (req, res) => {
  try {
    const swap = swaps.find(s => s._id === req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    if (swap.recipient !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to reject this swap' });
    }
    
    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap is not in pending status' });
    }
    
    swap.status = 'rejected';
    swap.rejectedAt = new Date();
    
    res.json({
      message: 'Swap rejected successfully',
      swap
    });
  } catch (error) {
    console.error('Reject swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/swaps/:swapId/cancel', auth, (req, res) => {
  try {
    const swap = swaps.find(s => s._id === req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    if (swap.requester !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to cancel this swap' });
    }
    
    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap is not in pending status' });
    }
    
    swap.status = 'cancelled';
    swap.cancelledAt = new Date();
    
    res.json({
      message: 'Swap cancelled successfully',
      swap
    });
  } catch (error) {
    console.error('Cancel swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/swaps/:swapId/complete', auth, (req, res) => {
  try {
    const swap = swaps.find(s => s._id === req.params.swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    if (swap.requester !== req.user._id && swap.recipient !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to complete this swap' });
    }
    
    if (swap.status !== 'accepted') {
      return res.status(400).json({ message: 'Swap is not in accepted status' });
    }
    
    swap.status = 'completed';
    swap.completedAt = new Date();
    
    res.json({
      message: 'Swap completed successfully',
      swap
    });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Feedback
app.post('/api/swaps/:swapId/feedback', auth, (req, res) => {
  try {
    const { rating, comment } = req.body;
    const swap = swaps.find(s => s._id === req.params.swapId);
    
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }
    
    if (swap.requester !== req.user._id && swap.recipient !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to provide feedback for this swap' });
    }
    
    if (swap.status !== 'completed') {
      return res.status(400).json({ message: 'Swap must be completed to provide feedback' });
    }
    
    if (!swap.feedback) {
      swap.feedback = {};
    }
    
    // Determine if user is requester or recipient
    const isRequester = swap.requester === req.user._id;
    const feedbackKey = isRequester ? 'requesterRating' : 'recipientRating';
    const commentKey = isRequester ? 'requesterComment' : 'recipientComment';
    
    swap.feedback[feedbackKey] = rating;
    if (comment) {
      swap.feedback[commentKey] = comment;
    }
    
    // Update user ratings if both parties have provided feedback
    if (swap.feedback.requesterRating && swap.feedback.recipientRating) {
      const requester = users.find(u => u._id === swap.requester);
      const recipient = users.find(u => u._id === swap.recipient);
      
      if (requester && recipient) {
        // Update recipient's rating (they were rated by requester)
        if (!recipient.rating) recipient.rating = { average: 0, count: 0 };
        recipient.rating.count += 1;
        recipient.rating.average = (
          (recipient.rating.average * (recipient.rating.count - 1) + swap.feedback.requesterRating) / 
          recipient.rating.count
        );
        
        // Update requester's rating (they were rated by recipient)
        if (!requester.rating) requester.rating = { average: 0, count: 0 };
        requester.rating.count += 1;
        requester.rating.average = (
          (requester.rating.average * (requester.rating.count - 1) + swap.feedback.recipientRating) / 
          requester.rating.count
        );
      }
    }
    
    res.json({
      message: 'Feedback submitted successfully',
      swap
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
app.get('/api/admin/users', adminAuth, (req, res) => {
  try {
    const { page = 1, limit = 50, search = '', status = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let filteredUsers = users;
    
    if (search) {
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status === 'banned') {
      filteredUsers = filteredUsers.filter(u => u.isBanned);
    } else if (status === 'active') {
      filteredUsers = filteredUsers.filter(u => !u.isBanned);
    }
    
    const paginatedUsers = filteredUsers.slice(skip, skip + parseInt(limit));
    const total = filteredUsers.length;
    
    res.json({
      users: paginatedUsers.map(u => {
        const { password, token, ...userWithoutSensitive } = u;
        return userWithoutSensitive;
      }),
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + paginatedUsers.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/users/:userId/ban', adminAuth, (req, res) => {
  try {
    const { reason } = req.body;
    const user = users.find(u => u._id === req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isBanned = true;
    user.banReason = reason;
    user.bannedAt = new Date();
    user.bannedBy = req.user._id;
    
    res.json({
      message: 'User banned successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBanned: user.isBanned,
        banReason: user.banReason
      }
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/users/:userId/unban', adminAuth, (req, res) => {
  try {
    const user = users.find(u => u._id === req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isBanned = false;
    delete user.banReason;
    delete user.bannedAt;
    delete user.bannedBy;
    
    res.json({
      message: 'User unbanned successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/swaps', adminAuth, (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    let filteredSwaps = swaps;
    
    if (status) {
      filteredSwaps = filteredSwaps.filter(s => s.status === status);
    }
    
    // Populate user details for each swap
    const populatedSwaps = filteredSwaps.map(swap => {
      const requester = users.find(u => u._id === swap.requester);
      const recipient = users.find(u => u._id === swap.recipient);
      return {
        ...swap,
        requester: { _id: requester._id, name: requester.name },
        recipient: { _id: recipient._id, name: recipient.name }
      };
    });
    
    const paginatedSwaps = populatedSwaps.slice(skip, skip + parseInt(limit));
    const total = populatedSwaps.length;
    
    res.json({
      swaps: paginatedSwaps,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + paginatedSwaps.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin swaps error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/reports', adminAuth, (req, res) => {
  try {
    // Simulate reports data
    const reports = [
      {
        _id: '1',
        type: 'inappropriate_skill',
        description: 'Skill description contains inappropriate content',
        status: 'pending',
        skillId: 'skill1',
        reportedBy: 'user1',
        createdAt: new Date(),
        skillName: 'Photoshop Tutorial'
      },
      {
        _id: '2',
        type: 'spam',
        description: 'User posting spam content',
        status: 'pending',
        skillId: 'skill2',
        reportedBy: 'user2',
        createdAt: new Date(Date.now() - 86400000),
        skillName: 'Excel Basics'
      }
    ];
    
    res.json({ reports });
  } catch (error) {
    console.error('Get admin reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/skills/:skillId/reject', adminAuth, (req, res) => {
  try {
    const { reason } = req.body;
    
    // In a real app, you would update the skill in the database
    // For now, we'll just return a success response
    
    res.json({
      message: 'Skill rejected successfully',
      skillId: req.params.skillId,
      reason
    });
  } catch (error) {
    console.error('Reject skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/messages', adminAuth, (req, res) => {
  try {
    const { title, content, type } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const message = {
      _id: Date.now().toString(),
      title,
      content,
      type: type || 'info',
      sentBy: req.user._id,
      sentAt: new Date(),
      recipients: users.length // All users
    };
    
    // In a real app, you would store this in a database
    // and send notifications to all users
    
    res.json({
      message: 'Platform message sent successfully',
      messageId: message._id,
      recipients: message.recipients
    });
  } catch (error) {
    console.error('Send admin message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/reports/:type', adminAuth, (req, res) => {
  try {
    const { type } = req.params;
    
    // Generate CSV data based on type
    let csvData = '';
    let filename = '';
    
    switch (type) {
      case 'users':
        csvData = 'Name,Email,Status,Rating,Joined Date\n';
        users.forEach(user => {
          csvData += ${user.name},${user.email},${user.isBanned ? 'Banned' : 'Active'},${user.rating?.average || 0},${new Date(user.createdAt || Date.now()).toISOString()}\n;
        });
        filename = 'users-report.csv';
        break;
        
      case 'swaps':
        csvData = 'Requester,Recipient,Requested Skill,Offered Skill,Status,Date\n';
        swaps.forEach(swap => {
          const requester = users.find(u => u._id === swap.requester);
          const recipient = users.find(u => u._id === swap.recipient);
          csvData += ${requester?.name || 'Unknown'},${recipient?.name || 'Unknown'},${swap.requestedSkill.name},${swap.offeredSkill.name},${swap.status},${new Date(swap.createdAt).toISOString()}\n;
        });
        filename = 'swaps-report.csv';
        break;
        
      case 'feedback':
        csvData = 'User,Rating,Comment,Date\n';
        // Simulate feedback data
        csvData += 'John Doe,5,Great experience!,2024-01-15\n';
        csvData += 'Jane Smith,4,Good teacher,2024-01-14\n';
        filename = 'feedback-report.csv';
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', attachment; filename="${filename}");
    res.send(csvData);
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
  console.log('⚠️  Using in-memory database for testing');
  console.log('📝 To use MongoDB, install MongoDB and update the connection string');
});
