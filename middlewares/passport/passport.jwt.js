const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');

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
    console.log('payload', payload.id, payload.username, payload.email);
    return done(null, { id: 'asd' });
    // let user;
    // try {
    //   user = await userDAO.find(payload.uid);
    //   if (!user) return done(null, false);
    // } catch (e) {
    //   return done(e);
    // }
    // return done(null, user);
  },
  authenticateJWT: (req, res, next) =>
    passport.authenticate('jwt', { sessions: false }, (error, user) => {
      //verifyUser에서 user를 찾았다면 서버에게 요청하는 req객체의 user에 담아서 서버에게 넘겨줌
      if (user) {
        req.user = user;
      }
      next();
    })(req, res, next),
};
