const router = require('express').Router();
const controller = require('./storage.controller');

router.post('/userfile', controller.userfile);
router.get('/filelist', controller.filelist);

module.exports = router;
