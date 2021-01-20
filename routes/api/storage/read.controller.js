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
    `SELECT JSON_ARRAYAGG(JSON_OBJECT('user_title', user_title, 'name', name, 'date', DATE(date))) FROM rhs_data WHERE owner_id = UUID_TO_BIN(?) ORDER BY TIME(date) ASC`,
    [req.user.id],
    (error, result) => {
      if (error) {
        throw error;
      }
      console.log(
        result[0][
          "JSON_ARRAYAGG(JSON_OBJECT('user_title', user_title, 'name', name, 'date', TIME(date)))"
        ]
      );
      const userFileJSON = JSON.parse(
        result[0][
          "JSON_ARRAYAGG(JSON_OBJECT('user_title', user_title, 'name', name, 'date', TIME(date)))"
        ]
      );
      console.log(typeof userFileJSON, userFileJSON);
      res.json(userFileJSON);
    }
  );
};
