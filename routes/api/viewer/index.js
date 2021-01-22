const router = require('express').Router();

router.get('/fileId/:fileId', (req, res) => {
  let fileId = req.params.fileId;
  console.log('send file error');
  if (fileId === null || req.user.id === null) {
    console.log('send file error');
    res.sendStatus(400);
  } else {
    console.log('send file:', req.params.fileId);
    res.sendFile(
      __basedir + '/static/' + 'intan_save_210107_151441.rhs_1611075743572'
    );
  }
});

module.exports = router;
