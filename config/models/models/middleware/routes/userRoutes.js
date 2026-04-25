const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/auth');

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, address, aadharNumber, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ aadharNumber });
    if (existingUser) return res.status(400).json({ message: 'User with this Aadhar number already exists.' });

    const user = new User({ name, email, mobile, address, aadharNumber, password, role: role || 'voter' });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { aadharNumber, password } = req.body;
    const user = await User.findOne({ aadharNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
  res.json(req.user);
});

// Change Password
router.put('/profile/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
