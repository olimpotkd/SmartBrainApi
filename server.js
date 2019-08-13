const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

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
  database.users.push({
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
    });
  res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  userFound = database.users.find(user => user.id === id);

  if (userFound) {
    return res.json(userFound);
  }
  return res.status(404).json('No user found');
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
