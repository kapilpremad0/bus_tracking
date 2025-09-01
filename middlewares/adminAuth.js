const jwt = require('jsonwebtoken');
const User = require('../models/User'); // adjust path to your User model

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // If no token, redirect to admin login
    if (!token) {
      return res.redirect('/admin/login');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // Sequelize: findByPk(decoded.id)

    if (!user) {
      return res.redirect('/admin/login');
    }

    // Check role
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin auth error:", err.message);
    return res.redirect('/admin/login');
  }
};

module.exports = adminAuth;
