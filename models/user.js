const db = require('./db');

module.exports = {
  createUser: (username, email, password) => {
    return db
      .query(
        `INSERT INTO user (id, name, email, password) 
    VALUES(UUID_TO_BIN(UUID()), ${username}, ${email}, ${password})`
      )
      .then((rows) => {
        db.close();
      });
  },

  findOneByEmail: (email) => {
    return db.query(`SELECT * FROM user WHERE email=${email}`);
  },

  verify: (email, password) => {
    return db
      .query(`SELECT password FROM user WHERE email=${email}`)
      .then((res) => {
        return res === password;
      });
  },
};
