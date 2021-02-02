const express = require('express');
const db = require('../../../model/db');

exports.renameFile = async (req, res) => {
  try {
    console.log('renameFile title: ', req.body);
    console.log('renameFile user id: ', req.user);

    if (!req.body || !req.user) {
      return res.status(400).end();
    }
    db.query(
      `UPDATE RhsData SET userTitle=? WHERE id=? AND ownerId=?`,
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
