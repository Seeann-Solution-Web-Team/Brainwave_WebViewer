const express = require('express');
const db = require('../../../models/db');

exports.uploadFile = async (req, res) => {
  try {
    console.log('uploadFile console: ', req.file);
    console.log('uploadFile title: ', req.body);
    console.log('uploadFile user id: ', req.user);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    db.query(
      `INSERT INTO rhs_data (user_title, name, address, date, owner_id)
    VALUES (?, ?, ?, NOW(), UUID_TO_BIN(?))`,
      [req.body.title, req.file.originalname, req.file.path, req.user.id],
      (error, result) => {
        if (error) {
          throw error;
        }
        res.send('fiel upload success');
      }
    );

    // Image.create({
    //   type: req.file.mimetype,
    //   name: req.file.originalname,
    //   data: fs.readFileSync(
    //     __basedir + '/resources/static/assets/uploads/' + req.file.filename
    //   ),
    // }).then((image) => {
    //   fs.writeFileSync(
    //     __basedir + '/resources/static/assets/tmp/' + image.name,
    //     image.data
    //   );

    //   return res.send(`File has been uploaded.`);
    // });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};
