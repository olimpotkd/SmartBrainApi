const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'asdf',
    database : 'smart-brain'
  }
});


const app = express();
app.use(bodyParser.json());
app.use(cors()); 


app.get('/', (req, res) => {
  res.send(database.users)
});

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
      res.json(database.users[0])
    } else {
      res.status(400).json('error loging in')
    }
})

app.post('/register', (req, res) => {
  console.log(req.body);

  const {email, name, password } = req.body;
  
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to register'));
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  db.select('*').from('users').where({id})
    .then(users => {
      if(users.length) {
        res.json(users[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
});

app.put('/image/', (req, res) => {
  const { id } = req.body;
  userFound = database.users.find(user => user.id === id);

  if (userFound) {
    userFound.entries++;
    return res.json(userFound.entries);
  }
  return res.status(404).json('No user found');
})


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
