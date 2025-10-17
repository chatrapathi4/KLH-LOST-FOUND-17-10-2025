const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * authenticateToken middleware
 * Usage: router.use(authenticateToken) or add to specific routes
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ success: false, message: 'No authorization header' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ success: false, message: 'Invalid authorization format' });
    }

    const token = parts[1];

    if (!process.env.JWT_SECRET) {
      console.error('Missing JWT_SECRET in environment');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.userId).select('-__v');
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

module.exports = { authenticateToken };