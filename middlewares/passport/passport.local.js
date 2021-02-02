// const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../../model/db');

module.exports = {
  option: {
    usernameField: 'email',
    passwordField: 'password',
  },

  verify: async (email, password, done) => {
    db.query(
      `SELECT id, name, email, password FROM Users WHERE email=?`,
      [email],
      (error, result) => {
        if (error) {
          throw error;
        } else if (!result) {
          return done(null, false);
        } else {
          const user = {
            id: result[0]['id'],
            username: result[0].name,
            email: result[0].email,
          };
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
      }
    );
  },
};
