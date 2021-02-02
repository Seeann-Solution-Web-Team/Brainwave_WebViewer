const express = require('express');
const db = require('../../../model/db');

exports.uploadFile = async (req, res) => {
  try {
    console.log('uploadFile console: ', req.file);
    console.log('uploadFile title: ', req.body);
    console.log('uploadFile user id: ', req.user);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    db.query(
      `INSERT INTO RhsData (id, name, userTitle, address, ownerId, createdAt)
    VALUES (UUID(), ?, ?, ?, ?,  NOW())`,
      [req.file.originalname, req.body.title, req.file.path, req.user.id],
      (error, result) => {
        if (error) {
          throw error;
        }
        return res.send('file upload success');
      }
    );
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};
