const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const passportLocal = require('./passport.local');
const passportJwt = require('./passport.jwt');

module.exports = () => {
  passport.use(new LocalStrategy(passportLocal.option, passportLocal.verify));
  passport.use(new JwtStrategy(passportJwt.option, passportJwt.verify));
};
