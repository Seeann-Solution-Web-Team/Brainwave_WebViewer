const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../../../models/user');
const db = require('../../../models/db');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

exports.desc = (req, res) => {
  db.query(`SELECT `);
  res.send('asd');
};
