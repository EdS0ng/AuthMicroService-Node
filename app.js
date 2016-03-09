'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();
const logStream = fs.createWriteStream(__dirname+'/logger.log', {flags:'a'});

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/authMicroService');

//General Middleware
app.use(cors());
app.use(morgan('combined', {stream: logStream}));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());

//Routes
app.use('/', require('./routes/auth'));

app.listen(PORT, function () {
  console.log('server listening on port:', PORT);
});
