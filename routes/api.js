const express = require('express');
const router = express.Router();
const playController = require('../controllers/homeController.js');
const verifyToken = require('../middlewares/auth'); // 👈 Import middleware



router.get('/plans',playController.plans);
router.post('/purchase-subscription',verifyToken,playController.purchaseSubscription);
router.get('/transactions',verifyToken,playController.transactions);
router.post('/add-pause-date',verifyToken,playController.addPauseDate);

// router.post('/login',playController.login);
// router.post('/forgot-password',playController.forgotPassword);
// router.post('/verify-otp',playController.verifyOtp);
// router.post('/reset-password',playController.resetPassword);

module.exports = router;
