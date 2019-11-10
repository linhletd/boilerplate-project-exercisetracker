var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dotenv = require('dotenv').config();
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./configuration.js')
var app = express();

// Basic Configuration 
// app.use(express.static('public'))
var port = process.env.PORT || 3000;
app = config(app);

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('open', function() {
console.log('Mongoose connected.');
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
