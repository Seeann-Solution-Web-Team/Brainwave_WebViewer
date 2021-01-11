const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../../../models/user');
const db = require('../../../models/db');
const saltRounds = 10;

/*
POST /api/auth/register
{
  username,
  email,
  password
}
*/

exports.register = (req, res) => {
  let post = req.body;
  console.log(post);
  bcrypt.hash(post.password, saltRounds, (err, crypted_PW) => {
    db.query(
      `INSERT INTO user (id, name, email, password)
    VALUES (UUID_TO_BIN(UUID(), true), ?, ?, ?)`,
      [post.username, post.email, crypted_PW],
      (err) => {
        if (err) {
          throw err;
        } else {
          console.log('DONE');
          res.end();
        }
      }
    );
  });
};

/*
POST /api/auth/login
{
  email,
  password
}
*/

exports.login = (req, res) => {};
