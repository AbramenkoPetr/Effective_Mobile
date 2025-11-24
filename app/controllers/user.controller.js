const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const dbConfig = require("../config/db.config.js");
const db = require("../models");
const User = db.users;

const Op = db.Sequelize.Op;

exports.start = (req, res) => {
  
}
  

// Create and Save a new User
exports.create = (req, res)  => {

// Validate request
	//console.log('user.controller Create req.body ', req.body);
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a User
  const salt = bcrypt.genSaltSync(7);
  const hash = bcrypt.hashSync(req.body.password, salt);
  //console.log('user.controller hash ', hash);
  //const passwordCompare = bcrypt.compareSync(req.body.password, hash)
  //console.log(passwordCompare);
  let d = req.body.date_of_birth
  let is_date = isNaN(Date.parse(d))
  console.log('user.controller Create is date ', is_date)
  if(is_date) {res.send(/*JSON.stringify('Не корректная дата')*/false); return;}
  const user = {
    name: req.body.name,
    date_of_birth: new Date(req.body.date_of_birth),
    email: req.body.email,
    password: hash,
    role: req.body.role,
    status: req.body.status
    
  };
//console.log('User.controller user ', user);
//function test_email(email)  { 
// User.findOne({
//     where: { email: req.body.email }
//     })
//       .then(data => {
//         //console.log('user.controller Create data ', data);
//         //res.status(404).send(JSON.stringify('false_email')); //return;
//         return ;
//       })
//       .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the User."
//       });
//       });
//}      
// let is_email =  test_email(user.email);
// console.log('user.controller Create is_email ', is_email);
// if(is_email){res.send(JSON.stringify('false_email')); return;}
  // Save User in the database
  console.log('user.controller Create user ');
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      //console.log('user.controller Create user catch');
      res.status(500).send(JSON.stringify('false_email'));
      // res.status(500).send({
      //   message:
      //     err.message || "Some error occurred while creating the User."
      // });
    });
};



exports.auth =  (req, res) => {
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    })
    return;
  }
   console.log('test ressend')
   //res.send('test');
  //return
  let email = req.body.email;
    let password = req.body.password;
    console.log('User.controller auth email, password ', email, password/*.dataValues*/);
  // let role = req.body.role;
  // let status = req.body.status;
    // User.findAll()
    // .then(data => {console.log('User.controller auth data ', data)})
    User.findOne({
    where: { email:email }
    })
    
    .then(data => {
      
      if( !data /*=== null*/){res./*status(404).*/send(/*'Нет такого пользователя'*/false); return;}
      console.log('User.controller auth data ', data/*.dataValues*/);
      let id = data./*dataValues.*/id
      let role = data./*dataValues.*/role
      let status = data./*dataValues.*/status
      console.log('User.controller auth status ', status);
      if(!status) { res.send('The user has been blocked'); return;}
      let hash = data./*dataValues.*/password
      const passwordCompare = bcrypt.compareSync(password, hash)
      console.log('passwordCompare ', passwordCompare);
      if(passwordCompare) {
        var token = jwt.encode({
          id: id,
          email: email,
          role: role,
          status: status
        }, dbConfig.secretkey)
        console.log('User.controller auth token ', token);
     res/*.status(200)*/.send(token)
      }
      //return data
    })
    .catch(err => {
      console.log('User.controller auth data cath err ', err);
      res.status(500)
      res.send({
        message: err
      })
    });
    //console.log('User.controller auth data ', usrok);
    //console.log('User.controller auth user ', user);

}



// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  let token =  req.headers['x-auth']
  if(!token)  { res./*status(500).*/send(JSON.stringify('Пользователь не авторизован')); return; }
  var auth = jwt.decode(token, dbConfig.secretkey)
  //console.log('user-contr findById token ', token);
  //console.log('user-contr findById auth ', auth);
  if(auth.role != 'admin')  { res.send(JSON.stringify('Нет прав доступа')); return; }

  User.findAll(/*{ where: condition }*/)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};


// Retrieve one User with the specified id in the request
exports.findById = (req, res) => {
let token =  req.headers['x-auth']
if(!token)  { res./*status(500).*/send(JSON.stringify('Пользователь не авторизован')); return; }
var auth = jwt.decode(token, dbConfig.secretkey)
console.log('user-contr findById token ', token);
console.log('user-contr findById auth ', auth);
const id = req.params.id;
//let key =  false
User.findOne({
    where: { id: auth.id }
  })
.then(data => {
      if(!data) { res.status(404).send(JSON.stringify('Не действительная авторизация')); return; }
      if(!data.status)  { res/*.status(500)*/.send('The user has been blocked'); return; }
      
      //res.send(data);
      const id = req.query.id;
console.log('user-contr findById id ', id, auth.id, auth.role);
  
  
  if(id != auth.id && auth.role != 'admin')  { res.send( JSON.stringify('Нет прав доступа')); return; }

  User.findOne({
        where: {
           id: id
        }
     }).then(function(user) {
        if (!user) {
            res.send(JSON.stringify('Нет такого пользователя'));
            return 'not find';

        }
        //return user.dataValues;
        //console.log('user-contr findById findone id user.dataValues ', user.dataValues);
        res.send(user.dataValues);
     });

  
    });

};



// Delete a User with the specified id in the request
exports.delete = (req, res) => {
console.log('user-contr delete req.params ', req.params);
//const id = req.params.id;
const id = req.query.id;
console.log('user-contr delete id ', id);
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Блокировка пользователя по id
exports.blocking = (req, res) => {
  let id_req = req.query.id
  console.log('user-contr blocking id_req ', id_req);
let token =  req.headers['x-auth']
console.log('user-contr blocking token ', token);
if(!token)  { res./*status(500).*/send('Пользователь не авторизован'); return; }
if(token === null)  { res.status(500).send('Пользователь не авторизован'); return; }
var auth = jwt.decode(token, dbConfig.secretkey)
console.log('user-contr blocking token ', token);
console.log('user-contr blocking auth ', auth);

User.findOne( {
    
    where: { id: auth.id }
  })
.then(data => {
  // console.log('user-contr blocking auth User.findOne data ', data.dataValues);
  // console.log('user-contr blocking auth User.findOne data.users.dataValues.status ', data./*users.*/dataValues.status);
  
      if(!data.dataValues.status)  { res./*status(500).*/send(JSON.stringify('The user has been blocked')); return; }
      
      //res.send(data);
      const id = req.query.id;
console.log('user-contr findById id ', id, auth.id, auth.role);
  if(id != auth.id && auth.role != 'admin')  { res./*status(500).*/send(JSON.stringify('Нет прав доступа')); return; }
      
  User.update( {status: false}, {
    where: { id: id }
  })
.then(data => {
      console.log('user-contr blocking id data ', data);
      if(data[0] === 0 ) {res.send('Нет такого пользователя id = '+id); return;}
      res.send('Пользователь заблокирован id = '+id);
    })
    .catch(err => {
      res.status(500).send({
        message: err
      });
    });
    })
    .catch(err => {
      res.status(500).send({
        message: err
      });
    });

};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Users."
      });
    });
};

