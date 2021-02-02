const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const db = require('../../model/db');

module.exports = {
  cookieExtractor: (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.accessToken;
    }
    return token;
  },
  option: (extractor) => {
    return {
      jwtFromRequest: ExtractJwt.fromExtractors([extractor]),
      secretOrKey: 'secret',
    };
  },
  verify: async (payload, done) => {
    console.log('payload==========', payload.exp);
    try {
      console.log('payload==========1', payload.exp);
      db.query(
        `SELECT id, name, email FROM Users WHERE id=?`,
        [payload.id],
        (error, result) => {
          if (!result) {
            return done(null, false);
          } else {
            const user = {
              id: result[0]['id'],
              username: result[0].name,
              email: result[0].email,
            };
            console.log('user found return user');
            return done(null, user);
          }
        }
      );
    } catch (error) {
      console.log('payload==========2', payload.exp);
      return done(error, false);
    }
  },
};
