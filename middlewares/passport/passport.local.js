// const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../../models/db');

module.exports = {
  option: {
    usernameField: 'email',
    passwordField: 'password',
  },

  verify: async (email, password, done) => {
    db.query(
      `SELECT BIN_TO_UUID(id), name, email, password FROM user WHERE email=?`,
      [email],
      (error, result) => {
        console.log(result[0]['BIN_TO_UUID(id)']);
        const user = {
          id: result[0]['BIN_TO_UUID(id)'],
          username: result[0].name,
          email: result[0].email,
        };
        if (error) {
          throw error;
        } else if (!user) {
          return done(null, false);
        }
        bcrypt.compare(
          password,
          result[0].password,
          function (err, isSamePassword) {
            if (err) {
              throw err;
            }
            if (!isSamePassword) {
              return done(null, false);
            }
            return done(null, user);
          }
        );
      }
    );
  },
};
