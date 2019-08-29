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
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});


const app = express();
app.use(bodyParser.json());
app.use(cors()); 

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.getProfileById(req, res, db) });

app.put('/image', (req, res) => { image.updateEntries(req, res, db) })
app.post('/imageUrl', (req, res) => { image.handleAPICall(req, res, db) })

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port ", port);
});
