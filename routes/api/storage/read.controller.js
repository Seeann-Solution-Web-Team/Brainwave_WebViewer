const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../../../models/user');
const db = require('../../../models/db');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

exports.readFileList = (req, res) => {
  db.query(`SELECT * FROM rhs_data`, (error, result) => {
    console.log(result);
  });
  res.json({ a: 'asd' });
};
