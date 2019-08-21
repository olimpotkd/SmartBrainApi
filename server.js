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
  const { email, password } = req.body;
  
  db.select('email', 'hash').from('login')
  .where('email', '=', email)
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if(isValid) {
      return db.select('*').from('users')
      .where('email', '=', email)
      .then(user => {
        console.log(user[0]);
        res.json(user[0]);
      })
      .catch(err => {res.status(400).json('Unable to get user')})
    } else {
      res.status(400).json('Wrong credentials');
    }
  })
  .catch(err => {res.status(400).json('Wrong credentials')})
})

app.post('/register', (req, res) => {
  const {email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      email: email,
      hash: hash
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      db('users')
      .returning('*')
      .insert({
        email: loginEmail[0],
        name: name,
        joined: new Date()
      })
      .then(user => {
        res.json(user[0]);
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('Unable to register'));


})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
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
  console.log(req.body);
  const { id, currentEntries } = req.body;

  db('users').where({id})
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    if(!entries.length) {
      return res.status(404).json('Unable to update entries');
    }
    res.json(entries);
  })
  .catch(err => {
    return res.status(404).json('Unable to update entries');
  })    
})


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
