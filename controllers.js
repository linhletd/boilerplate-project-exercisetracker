let Models = require('./model.js');

module.exports = {
  userRegister: function(req, res){
    if (req.body.username){
    Models.UserModel.findOne({username: req.body.username},(err,user) => {
      if (user){
        res.send('this user name taken');
      }
      else {
        function createUser(){
            let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstvuwxyz0123456789';
            let userId = '';
            for (let i = 0; i < 6; i++){
                userId += possible[Math.floor(Math.random()*possible.length)];
            }
            Models.UserModel.findOne({userid: userId},(err, user) => {
            if(user){
              createUser();
            }
            else {
              let newUser = new Models.UserModel({
                                          username: req.body.username,
                                          userid: userId
                                        });
              newUser.save((err, user) => {
                if(err) throw err;
                res.json({username1: user.username, id: user.userid});
              })
            }
        })
    }
  createUser();
      }
    })
  }
    else{
      res.json({message:'the username field required'})
    }
  },
  postExercise: function (req,res){
    console.log(req.body)
    // res.json({message: "this is postExercise"})
  if (req.body.user && req.body.description && req.body.duration){
      Models.UserModel.findOne({username:req.body.user}, (err, user) => {
        if(user){
          //some code here
          console.log(user)
          let newExercise = new Models.ExerciseModel({
            userid: user.userid,
            description: req.body.description,
            duration: req.body.duration,
            date: req.body.date ? new Date(req.body.date): undefined
          });
          newExercise.save((err, exercise) => {
            if(err) throw err;
            res.json({username: user.username,
                      description: exercise.description,
                      duration: exercise.duration,
                      _id: user.userid,
                      date: exercise.date
                     })
          })
        }
        else {
          res.json({message: "this user is not registered"})
        }
      })
    }
    else {
      res.json({message: "required form fields: username, description, duration"})
    }
  },
  getAllUser: function(req, res){
    // res.json({message: "this is getAllUser"})
    Models.UserModel.find({}, (err,users) =>{
      if (err){
        res.json(500,{message: "something went wrong"})
      }
      else {
        let userArray = users.map((cur) => ({username: cur.username, _id: cur.userid}));
        res.json(userArray);
      }
    })
  },
  getExerciseOfUser: function(req, res){
    // res.json({message: "this is getExerciseOfUser"})
    ///api/exercise/log/:username?
    Models.UserModel.findOne({username: {$regex: req.query.username}}, (err, user) => {
      if (!err && user){
        console.log(user)
        Models.ExerciseModel.aggregate([
          {$match: {userid: user.userid}},
          // {$addFields: {username: user.username}},
          {$group:{ _id: user.userid, username: {$first: user.username}, count: {$sum: 1},//cannot set by only: username: user.username
                     log : {$push: {description: "$description", duration: "$duration", date: "$date" }}}}
        ]).exec((err,doc) => {
         if (!err && doc){
          // console.log(doc);
           res.json(doc[0]);
         }
       });
      }
    })
  },
  getExerciseQuery: function(req, res){
    // res.json({message: "this is getExerciseQuery"})
    console.log(req.query);
    let user = req.query.username,
        lower = /^\d{4}\-\d{2}\-\d{2}$/.test(req.query.from) && new Date(req.query.from).getDate() ? new Date(req.query.from) : undefined,
        upper = /^\d{4}\-\d{2}\-\d{2}$/.test(req.query.to) && new Date(req.query.to).getDate() ? new Date(req.query.to) : undefined,
        limit = Number.parseInt(req.query.limit) >= 1 ? Number.parseInt(req.query.limit): 100;
    if (user){
          Models.UserModel.findOne({username: {$regex: req.query.username}}, (err, user) => {
            if (!err && user){
              // console.log(user)
              if(upper < lower){
                res.json({message: 'from must smaller than to'})
              }
              Models.ExerciseModel.aggregate([
                {$match: {userid: user.userid, date: {$gte: lower || new Date('1900-01-01'), $lte: upper || new Date('2100-01-01')}}},
                {$sort:{date: -1}},
                {$limit: limit},//limit only with valid number
                {$group:{ _id: user.userid, username: {$first: user.username}, count: {$sum: 1},//cannot set by only: username: user.username
                     log : {$push: {description: "$description", duration: "$duration", date: "$date" }}}}
              ]).exec((err,doc) => {
               if (!err && doc){
                // console.log(doc);
                 res.json(doc[0]);
               }
             })
            }
    })
    }
    else {res.json({message: 'unknown user'})}

  }
}
