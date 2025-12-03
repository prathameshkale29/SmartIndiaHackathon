// backend/controllers/userController.js
const User = require('../models/User');
const LoginHistory = require('../models/LoginHistory');

// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'user already exists' });
    }

    const user = new User({ name, email, password }); // plain text for demo
    await user.save();

    res.status(201).json({
      message: 'user created',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!email || !password) {
      await LoginHistory.create({
        email,
        success: false,
        ip,
        userAgent
      });
      return res.status(400).json({ error: 'email and password required' });
    }

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      await LoginHistory.create({
        user: user ? user._id : null,
        email,
        success: false,
        ip,
        userAgent
      });
      return res.status(400).json({ error: 'invalid email or password' });
    }

    await LoginHistory.create({
      user: user._id,
      email: user.email,
      success: true,
      ip,
      userAgent
    });

    res.json({
      message: 'login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
