const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'carlos',
    password : '',
    database : 'smart-brain'
  }
});

db.select('*').from('users')
.then( data => {
  console.log(data);
})

const app = express();
app.use(bodyParser.json());
app.use(cors()); 


const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined:  new Date()
    }
  ]
}

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
  const {email, name, password } = req.body;
  
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(users => {
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
