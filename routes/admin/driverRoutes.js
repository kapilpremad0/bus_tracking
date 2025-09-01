const express = require('express');
const driverController = require('../../controllers/admin/driverController');
const router = express.Router();
const adminAuth = require('../../middlewares/adminAuth');


router.get('/', adminAuth, driverController.getList);
router.post('/data', adminAuth, driverController.getListData);
router.delete("/:id", adminAuth, driverController.deleteRecord);


module.exports = router;
