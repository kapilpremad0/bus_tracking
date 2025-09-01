const express = require('express');
const { auth, isAdmin } = require('../../middlewares/auth');
const driverController = require('../../controllers/admin/driverController');
const router = express.Router();

router.get('/', auth, isAdmin, driverController.getAllDrivers);

module.exports = router;
