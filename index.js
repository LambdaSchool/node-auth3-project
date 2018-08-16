const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./data/db');

const server = express();
server.use(express.json());
const PORT = 8000;

server.get('/', (req, res) => {
  res.send('Sanity Check');
});

server.post('/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users').insert(credentials)
   .then(ids => {
     db('users').where('id', ids[0]).first()
       .then(user => {
         const token = generateToken(user);
         res.status(201).json(user);
       });
   })
   .catch(err => {
     res.send(err);
   });
});

server.listen(PORT, () => {
  console.log(`UP and RUNNING on ${PORT}`)
});