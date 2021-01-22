const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../../../models/user');
const db = require('../../../models/db');
const passport = require('passport');
const jwt = require('jsonwebtoken');
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
  bcrypt.hash(post.password, saltRounds).then(function (crypted_PW) {
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

exports.login = (req, res, next) => {
  passport.authenticate(
    'local',
    {
      successRedirect: '/',
      failureRedirect: '/login',
      session: false,
    },
    (err, user) => {
      if (err) {
        throw err;
      }
      console.log(user);
      if (err || !user) return res.status(400).end();
      req.login(user, { session: false }, (error) => {
        if (error) next(error);
        const token = jwt.sign(
          {
            id: user.id,
          },
          'secret',
          { expiresIn: '30m' }
        );
        res.cookie('token', token, { httpOnly: true });
        return res.json({ token });
      });
    }
  )(req, res);
};
