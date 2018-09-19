const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());


server.get('/', (req, res) => {
    res.send('Hello!');
  });
  

  const secret = 'kitties are cool';

  function generateToken(user) {
    const payload = {
      username: user.username,
    };
    const options = {
      expiresIn: '1h',
      jwtid: '12345', 
    };
    return jwt.sign(payload, secret, options);
  }


function protected(req, res, next) {
    const token = req.headers.authorization;
  
    if (token) {
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ message: 'Nope!' });
        } else {
          console.log(decodedToken);
          req.user = { username: decodedToken.username };
  
          next();
        }
      });
    } else {
      res.status(401).json({ message: 'Nope!' });
    }
  }
  
  server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 8);
    creds.password = hash;
  
    db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0];

    db('users')
    .where({ id })
    .first()
    .then(user => {
        const token = generateToken(user);
        res.status(201).json({id: user.id, token });
    })
    .catch(err => res.status(500).json({ message: 'Token Error' }))
    })
     .catch(err => res.status(500).json({ message: 'Error Registering User' }))
  });










const port = 6600;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
