const express = require('express');
const { auth, isAdmin } = require('../../middlewares/auth');
const userController = require('../../controllers/admin/userController');
const router = express.Router();

router.get('/', auth, isAdmin, userController.getAllUsers);

module.exports = router;
