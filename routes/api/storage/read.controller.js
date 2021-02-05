const express = require('express');
const db = require('../../../model/db');

exports.readFileList = (req, res) => {
  console.log('readfile userId: ', req.user.id);
  db.query(
    `SELECT JSON_OBJECT('id', id,'userTitle', userTitle, 'name', name, 'createdAt', DATE(createdAt)) FROM RhsData WHERE ownerId=? ORDER BY DATE(createdAt) DESC, TIME(createdAt) DESC`,
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
              "JSON_OBJECT('id', id,'userTitle', userTitle, 'name', name, 'createdAt', DATE(createdAt))"
            ]
          )
        );
      });

      res.json(userFileJSON);
    }
  );
};
