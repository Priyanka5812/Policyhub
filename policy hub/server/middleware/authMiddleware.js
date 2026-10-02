const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * requireAuth
 * Verifies the JWT in the Authorization header (Bearer <token>).
 * On success, attaches the full user document to req.user.
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided — authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the full user (minus the password) to the request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired — please log in again' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * requireRole(...roles)
 * Factory that returns a middleware allowing only the specified roles.
 * Must be used AFTER requireAuth so that req.user is already set.
 *
 * Usage examples:
 *   router.get('/admin-only', requireAuth, requireRole('admin'), handler);
 *   router.get('/agents-and-admins', requireAuth, requireRole('agent', 'admin'), handler);
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      // Defensive: requireAuth should always run first
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied — requires role: ${roles.join(' or ')}`,
      });
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };
