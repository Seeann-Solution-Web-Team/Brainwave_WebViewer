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
  console.log(post);
  bcrypt.hash(post.password, saltRounds).then(function (crypted_PW) {
    console.log('crypted', crypted_PW);
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
            username: user.username,
            email: user.email,
          }, // 토큰에 입력할 private 값
          'secret', // 나만의 시크릿키
          { expiresIn: '5m' } // 토큰 만료 시간
        );
        return res.json({ token });
      });
    }
  )(req, res);
};
