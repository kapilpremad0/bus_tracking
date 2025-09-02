const express = require('express');
const companyController = require('../../controllers/admin/companyController');
const router = express.Router();
const adminAuth = require('../../middlewares/adminAuth');
const upload = require('../../middlewares/upload');


router.get('/', adminAuth, companyController.getList);
router.post('/data', adminAuth, companyController.getListData);
router.delete("/:id", adminAuth, companyController.deleteRecord);
router.post('/',adminAuth,
    upload.fields([{ name: "logo", maxCount: 1 }]),
companyController.storeData);

router.put('/:id',adminAuth,
    upload.fields([{ name: "logo", maxCount: 1 }]),
companyController.updateData);





router.get('/json/:id', adminAuth,companyController.getInJson );


module.exports = router;
