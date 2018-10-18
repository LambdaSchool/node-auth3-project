const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Its Alive!');
});

const jwtSecret = process.env.JWT_SECRET || 'add a secret to your .env file with this key';;

function generateToken(user) {
    const jwtPayload = {
        ...user,
        roles: ['admin', 'root']
    }
    const jwtOptions = {
        expiresIn: '1h'
    }
    return jwt.sign(jwtPayload, jwtSecret, jwtOptions);
}

server.post('/api/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 10);
    credentials.password = hash;
    db('user')
        .insert(credentials)
        .then(ids => {
            const id = ids[0];
            res.status(201).json({ newUserId: id });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('user')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({ welcome: user.username, token });
            } else {
                res.status(401).json({ message: 'you shall not pass!' });
            }
        })
        .catch(err => {
            res.status(500).json({ err });
        });
});

server.get('/api/users', protected, checkRole('admin'), (req, res) => {
    console.log('\n** decoded token infomration **\n', req.decodedToken);
    db('user')
        .select('id', 'username', 'password')
        .then(users => {
            res.json({ users });
        })
        .catch(err => res.send(err));
});

function protected(req, res, next) {
    const token = req.headers.authorization;
    if (token){
        jwt.verify(token, jwtSecret, (err, decodedToken)=>{
            if(err){//token verification failed
                res.status(401).json({message: 'You shall not pass!'});
                return;
            }else{//token is valid
                req.decodedToken = decodedToken;
                next();
            }
        })
    } else {
        res.status(401).json({ message: 'no token provided'})
    }
}

function checkRole(role){
    return function (req, res, next){
        if (req.decodedToken && req.decodedToken.roles.includes(role)) {
            next();
        } else {
            res.status(403).json({message:'you shall not pass!'})
        }
    }
}

// server.get('/api/logout', (req, res) => {
//     if (req.session) {
//       req.session.destroy(err => {
//         if (err) {
//           res.send('error logging out');
//         } else {
//           res.send('good bye');
//         }
//       });
//     }
//   });

const port = process.env.PORT || 3300;
server.listen(port, () => console.log('\nrunning on port 3300\n'));