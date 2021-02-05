const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../../model/db');
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
  //hashing
  bcrypt.hash(post.password, saltRounds).then(function (crypted_PW) {
    db.query(
      `INSERT INTO Users (id, name, email, password)
    VALUES (UUID(), ?, ?, ?)`,
      [post.username, post.email, crypted_PW],
      (err) => {
        if (err) {
          throw err;
        } else {
          console.log('DONE');
          res.status(200).end();
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
        const accessToken = jwt.sign(
          {
            id: user.id,
          },
          'secret',
          { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
          {
            id: user.id,
          },
          'secret',
          { expiresIn: '30d' }
        );
        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.json({
          username: user.username,
        });
      });
    }
  )(req, res);
};

/*
POST /api/auth/logout
*/

exports.logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).end();
};

/*
GET /api/auth/accessToken
*/
exports.accessToken = (req, res) => {
  let refreshToken = null;
  if (req && req.cookies) {
    refreshToken = req.cookies.refreshToken;
  }
  // verify refresh token,
  // if not, delete from db, clear both cookies and return status 401
  jwt.verify(refreshToken, 'secret', (err, decoded) => {
    if (err) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(401).end();
    } else {
      const newAccessToken = jwt.sign(
        {
          id: decoded.id,
        },
        'secret',
        { expiresIn: '30m' }
      );
      res.cookie('accessToken', newAccessToken, { httpOnly: true });
      res.status(200).end();
    }
  });
};
