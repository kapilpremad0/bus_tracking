const express = require('express');
const router = express.Router();

// Admin subroutes
router.use('/', require('../admin/homeRoutes'));

router.use('/users', require('../admin/userRoutes'));
// router.use('/drivers', require('../admin/driverRoutes'));

// // Other app routes (profile, etc.)
// router.use('/profile', require('./profileRoutes'));

module.exports = router;
