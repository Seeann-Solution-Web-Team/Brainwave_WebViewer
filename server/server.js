const express = require('express');
const app = express();
const port = process.env.port || 3001;

const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const passportConfig = require('../middlewares/passport');

global.__basedir = path.join(__dirname, '..');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use(cors());
app.use(passport.initialize());
passportConfig();

app.use('/api', require('../routes/api'));

app.use((req, res, next) => {
  res.status(404).end();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).end();
});

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
