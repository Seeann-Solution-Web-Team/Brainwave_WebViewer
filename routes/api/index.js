const express = require('express');
const passport = require('passport');
const auth = require('./auth');
const storage = require('./storage');
const router = express.Router();
const viewer = require('./viewer');

router.use('/auth', auth);

router.use(
  '/storage',
  passport.authenticate('jwt', { session: false }),
  storage
);

router.use('/viewer', passport.authenticate('jwt', { session: false }), viewer);

module.exports = router;
