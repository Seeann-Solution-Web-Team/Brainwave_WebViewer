const express = require('express');
const passport = require('passport');
const auth = require('./auth');
const storage = require('./storage');
const router = express.Router();

router.use('/auth', auth);
// router.use('/', (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (error, user) => {
//     console.log(user);
//   })(req, res, next);
// });
// router.use('/', (req, res) => {
//   console.log('server /');
//   res.send(req.user);
// });
router.use('/storage', storage);

module.exports = router;
