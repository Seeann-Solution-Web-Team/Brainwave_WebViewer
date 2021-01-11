const express = require('express');
const { useReducer } = require('react');
const { Redirect } = require('react-router');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../../models/user');
const db = require('../../models/db');
const saltRounds = 10;

router.use('/signup_process', (req, res) => {
  let post = req.body;
  console.log(post);
  bcrypt.hash(post.password, saltRounds, (err, hash) => {
    db.query(
      `INSERT INTO user (id, name, email, password) 
    VALUES(UUID_TO_BIN(UUID()), ?, ?, ?)`,
      [username, email, password],
      (err, res) => {
        res.redirect('http://localhost:3000/login');
      }
    );
  });
});

module.exports = router;
