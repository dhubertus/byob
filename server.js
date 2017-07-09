const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require(path.join(__dirname, './knexfile.js'))[environment];
const database = require('knex')(configuration)

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, './public')));

app.listen(app.get('port'));

console.log('listening at port' +  app.get('port'));

module.exports = app;
