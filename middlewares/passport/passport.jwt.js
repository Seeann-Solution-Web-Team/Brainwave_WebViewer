const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const db = require('../../models/db');

module.exports = {
  cookieExtractor: (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.token;
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
    console.log('payload', payload.id);
    db.query(
      `SELECT BIN_TO_UUID(id), name, email FROM user WHERE id=UUID_TO_BIN(?)`,
      [payload.id],
      (error, result) => {
        if (error) {
          throw error;
        } else if (!result) {
          return done(null, false);
        } else {
          const user = {
            id: result[0]['BIN_TO_UUID(id)'],
            username: result[0].name,
            email: result[0].email,
          };
          return done(null, user);
        }
      }
    );
  },
  authenticateJWT: (req, res, next) =>
    passport.authenticate('jwt', { sessions: false }, (error, user) => {
      if (error) {
        throw error;
      }
      //verifyUser에서 user를 찾았다면 서버에게 요청하는 req객체의 user에 담아서 서버에게 넘겨줌
      if (user) {
        req.user = user;
      }
      next();
    })(req, res, next),
};
