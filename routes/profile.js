const express = require('express');
const router = express.Router();
const playController = require('../controllers/profileController');
const upload = require('../middlewares/upload');


router.post('/update-address', playController.updateAddress);

router.put('/', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'licenseFront', maxCount: 1 },
    { name: 'licenseBack', maxCount: 1 },
    { name: 'addressFront', maxCount: 1 },
    { name: 'addressBack', maxCount: 1 }
]), playController.updateProfile);

router.get('/', playController.getProfile);
router.get('/optlize_routes', playController.optimizeBusRoute);


module.exports = router;
