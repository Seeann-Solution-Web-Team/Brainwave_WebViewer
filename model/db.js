const mysql = require('mysql');
const config = require('../config').mysqlOptions;
// const Database = require('./Database');

// const db = new Database(config.mysqlOptions);
const db = mysql.createConnection(config);
db.connect();

module.exports = db;
