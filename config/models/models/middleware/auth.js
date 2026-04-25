const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify Token Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Check Admin Role Middleware
const checkAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

module.exports = { authMiddleware, checkAdmin };
