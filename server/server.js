const express = require('express');
const app = express();
const indexRouter = require('../routes/api/index');
const port = process.env.port || 3001;

const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');
const passportJwt = require('../middlewares/passport/passport.jwt');

global.__basedir = path.join(__dirname, '..');
console.log(__basedir);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(cors());
// app.use(
//   session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(passport.session());
app.use(passport.initialize());
passportConfig();
app.use(passportJwt.authenticateJWT);

// app.get('*', (req, res) => {
//   console.log(req.user);
//   res.send(req.user);
// });
app.use('/api', require('../routes/api'));

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke');
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
