const express = require('express');
const router = express.Router();

// Admin subroutes
router.use('/', require('../admin/homeRoutes'));

router.use('/users', require('../admin/userRoutes'));
router.use('/drivers', require('../admin/driverRoutes'));
router.use('/companies', require('../admin/companyRoutes'));

// // Other app routes (profile, etc.)
// router.use('/profile', require('./profileRoutes'));

module.exports = router;
