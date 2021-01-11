const express = require('express');
const app = express();
const indexRouter = require('../routes/api/index');
const authRouter = require('../routes/api/auth');
const port = process.env.port || 3001;
const { createProxyMiddleware } = require('http-proxy-middleware');

const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
let passport = require('passport');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cors());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  createProxyMiddleware('/api', {
    target: 'http://localhost:3001',
    changeOrigin: true,
  })
);
// app.use(passport.initialize());
// app.use(passport.session());
app.use('/auth', authRouter);
app.use('/', indexRouter);

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
