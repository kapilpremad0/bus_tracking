const express = require('express');
const router = express.Router();
const playController = require('../controllers/homeController.js');
const homeController = require('../controllers/homeController.js');
const verifyToken = require('../middlewares/auth'); // 👈 Import middleware



router.get('/plans',playController.plans);
router.post('/purchase-subscription',verifyToken,playController.purchaseSubscription);
router.get('/transactions',verifyToken,playController.transactions);
router.post('/pause-date',verifyToken,playController.addPauseDate);
router.get('/pause-date',verifyToken,playController.getPauseDate);

router.post('/leave-date',verifyToken,playController.addLeaveDate);
router.get('/leave-date',verifyToken,playController.getLeaveDate);

router.get('/general-settings',verifyToken,playController.generalSettings);
router.get('/home/driver',verifyToken,homeController.homeDriver)

// router.post('/login',playController.login);
// router.post('/forgot-password',playController.forgotPassword);
// router.post('/verify-otp',playController.verifyOtp);
// router.post('/reset-password',playController.resetPassword);



router.get('/terms', homeController.termsPage);
router.get('/companies', homeController.getCompanies);

module.exports = router;
