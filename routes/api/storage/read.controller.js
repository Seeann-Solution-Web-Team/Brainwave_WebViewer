const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../../../models/user');
const db = require('../../../models/db');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

exports.readFileList = (req, res) => {
  console.log('readfile userId: ', req.user.id);
  db.query(
    `SELECT JSON_OBJECT('user_title', user_title, 'name', name, 'date', DATE(date)) FROM rhs_data WHERE owner_id = UUID_TO_BIN(?) ORDER BY TIME(date) DESC`,
    [req.user.id],
    (error, result) => {
      if (error) {
        throw error;
      }
      let userFileJSON = [];
      result.forEach((element) => {
        userFileJSON.push(
          JSON.parse(
            element[
              `JSON_OBJECT('user_title', user_title, 'name', name, 'date', DATE(date))`
            ]
          )
        );
      });
      res.json(userFileJSON);
    }
  );
};
