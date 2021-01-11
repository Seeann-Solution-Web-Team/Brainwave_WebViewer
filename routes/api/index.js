const express = require('express');
const router = express.Router();

router.use('/', (req, res) => {
  res.redirect('/login');
});

module.exports = router;
