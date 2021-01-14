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
      (error, user) => {
        console.log(user[0].password, password);
        if (error) {
          throw error;
        } else if (!user) {
          console.log('1');
          return done(null, false);
        }
        bcrypt.compare(
          password,
          user[0].password,
          function (err, isSamePassword) {
            if (err) {
              throw err;
            }
            if (!isSamePassword) {
              console.log('2', isSamePassword);
              return done(null, false);
            }
            console.log('3');
            return done(null, user);
          }
        );
      }
    );
  },
};
