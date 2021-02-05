const router = require('express').Router();
const readController = require('./read.controller');
const uploadController = require('./upload.controller');
const upload = require('../../../middlewares/upload');
const deleteController = require('./delete.controller');
const renameController = require('./rename.controller');

//Read
router.get('/filelist', readController.readFileList);

//Create
router.post(
  '/userfile',
  upload.single('rhs_file'),
  uploadController.uploadFile
);

//Delete
router.delete('/userfile', deleteController.deleteFile);

//Update
router.put('/userfile', renameController.renameFile);

module.exports = router;
