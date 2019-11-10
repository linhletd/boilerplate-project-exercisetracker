let express = require('express')
let bodyParser = require('body-parser');
let route = require('./routes.js');
let errResponse = require('./error.js');
let cors = require('cors');
module.exports = function(app){
  //the order of this can make different effect, even errors.
  app.use(express.static('./public'));
  app.use(cors());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  route(app);
  errResponse(app);
  return app;
}
