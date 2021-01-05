const { request, response } = require('express');
const express = require('express');
const app = express();

app.get('/', (request, response) => {
  console.log('Main Page');
});

app.listen(3000);
