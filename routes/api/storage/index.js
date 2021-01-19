const router = require('express').Router();
const readController = require('./read.controller');
const uploadController = require('./upload.controller');
const upload = require('../../../middlewares/upload');

//Read
router.get('/filelist', readController.readFileList);

//Create
router.post(
  '/userfile',
  upload.single('rhs_file'),
  uploadController.uploadFile
);

module.exports = router;
