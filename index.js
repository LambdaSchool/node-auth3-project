const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./database/dbConfig.js');

const server = express();
const PORT = 3300;
const secret = "This is the secret that no one knows!"

server.use(express.json());
server.use(cors());


function generateToken(user){
    const payload = {
        ...user,
        hello:user,
        roles:['admin', 'student']
    };
    const options = {
        expiresIn: '30m'
    }
    return jwt.sign(payload, secret, options )
}

function protected(req, res, next){
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token,secret,  (err, decodedToken)=>{
            if(err){
                res.status(401).json({message:'invalid token'})
            }else{
                req.decodedToken = decodedToken;
                next();
            }
        })
    }else{
        res.status(401).json({message:'no token provided'})
    }
}


server.post('/api/register', (req, res)=>{
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;
    db.insert(creds)
    .then(ids =>{
       db.findById(ids[0])
       .then( user =>{
           const token = generateToken(user)
           res.status(201).json({id:user.id, token})
       })
    }).catch(err =>{
        res.status(500).send(err)
    })
})

server.post('/api/login', (req, res) =>{
    const creds = req.body;
    db.findByUsername(creds.username)
    .then(user =>{
        if(user && bcrypt.compareSync(creds.password, user.password)){
           const token = generateToken(user)
            res.json({welcome:user.username, token})
        }else{
            res.status(401).json({message:'You shall not pass!'})
        }
    }).catch(err =>{
        res.status(500).send(err);
    })
})
server.get('/api/users', protected, (req,res)=>{
    db.findUsers()
    .then(users =>{
        res.json(users)
    })
    .catch(err => res.status(500).send(err))
})


server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}!`)
})