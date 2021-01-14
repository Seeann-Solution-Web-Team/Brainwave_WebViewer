const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = {
  option: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
  },
  verify: async (payload, done) => {
    console.log(payload);
    // let user;
    // try {
    //   user = await userDAO.find(payload.uid);
    //   if (!user) return done(null, false);
    // } catch (e) {
    //   return done(e);
    // }
    // return done(null, user);
  },
};
