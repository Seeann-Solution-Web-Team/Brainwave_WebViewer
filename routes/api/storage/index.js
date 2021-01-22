const router = require('express').Router();
const readController = require('./read.controller');
const uploadController = require('./upload.controller');
const upload = require('../../../middlewares/upload');
const deleteController = require('./delete.controller');

//Read
router.get('/filelist', readController.readFileList);

//Create
router.post(
  '/userfile',
  upload.single('rhs_file'),
  uploadController.uploadFile
);

router.delete('/userfile', deleteController.deleteFile);

module.exports = router;
