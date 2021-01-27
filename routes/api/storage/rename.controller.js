const express = require('express');
const db = require('../../../models/db');

exports.renameFile = async (req, res) => {
  try {
    console.log('renameFile title: ', req.body);
    console.log('renameFile user id: ', req.user);

    if (!req.body || !req.user) {
      return res.status(400).end();
    }
    db.query(
      `UPDATE rhs_data SET user_title=? WHERE id=UUID_TO_BIN(?,true) AND owner_id=UUID_TO_BIN(?, true)`,
      [req.body.filename, req.body.fileId, req.user.id],
      (error, result) => {
        if (error) {
          res.status(400).end();
        }
        res.status(200).end();
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
};
