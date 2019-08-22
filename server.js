const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const signin = require('./controllers/signin');
const image = require('./controllers/image');

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

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.getProfileById(req, res, db) });

app.put('/image/', (req, res) => { image.updateEntries(req, res, db) })


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
