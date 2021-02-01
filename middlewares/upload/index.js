const multer = require('multer');
const express = require('express');

const imageFilter = (req, file, cb) => {
  console.log('image filter log', file);
  // if (file.mimetype.startsWith('image')) {
  //   cb(null, true);
  // } else {
  //   cb('Please upload only images.', false);
  // }
  cb(null, true);
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/static');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}_${Date.now()}`);
  },
  npm,
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
