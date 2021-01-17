const router = require('express').Router();
const controller = require('./storage.controller');

router.get('/', controller.desc);

module.exports = router;
