const db = require('../../../model/db');

exports.deleteFile = async (req, res) => {
  try {
    console.log('delete file id: ', req.body.fileId);
    console.log('delete file user id: ', req.user.id);

    if (req.user.id === undefined) {
      return res.send(`Info missing: Please signin`);
    } else if (req.body.fileId === undefined) {
      return res.send(`Info missing: Please select a file`);
    } else {
      db.query(
        `DELETE FROM RhsData WHERE ownerId=? AND id=?`,
        [req.user.id, req.body.fileId],
        (error, result) => {
          if (error) {
            throw error;
          }
          return res.send('file delete success');
        }
      );
    }
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};
