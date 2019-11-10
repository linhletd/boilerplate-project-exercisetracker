let route = require('express').Router();
let controllers = require('./controllers.js')

module.exports = function(app){
  route.get('/', (req, res) => {
    // res.json({message: "haha"});
      res.sendFile(__dirname + '/views/index.html')
    });
  route.post('/api/exercise/new-user', controllers.userRegister);
  route.post('/api/exercise/add', controllers.postExercise);
  route.get('/api/exercise/users', controllers.getAllUser)
  route.get('/api/exercise/log/:username?/:from?/:to?/:limit?', controllers.getExerciseQuery);
  route.get('/api/exercise/log/:username?', controllers.getExerciseOfUser);
  app.use(route)
}
