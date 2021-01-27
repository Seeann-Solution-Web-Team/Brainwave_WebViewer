const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const db = require('../../models/db');

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
        `SELECT BIN_TO_UUID(id, true), name, email FROM user WHERE id=UUID_TO_BIN(?)`,
        [payload.id],
        (error, result) => {
          if (!result) {
            return done(null, false);
          } else {
            const user = {
              id: result[0]['BIN_TO_UUID(id, true)'],
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
  // authenticateJWT: (req, res, next) =>
  //   passport.authenticate('jwt', { sessions: false }, (_req, _res) => {
  //     console.log('auth', _req.user);
  //     // if (error) {
  //     //   console.log('error');
  //     //   return _res.status(401).end();
  //     // }
  //     // //verifyUser에서 user를 찾았다면 서버에게 요청하는 req객체의 user에 담아서 서버에게 넘겨줌
  //     // if (user) {
  //     //   console.log('user found 123');
  //     //   req.user = user;
  //     // }
  //     next();
  //   })(req, res, next),
};
