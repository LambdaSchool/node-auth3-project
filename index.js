const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const server = express();
server.use(express.json());
const PORT = 8000;

server.get('/', (req, res) => {
  res.send('Sanity Check');
});

server.listen(PORT, () => {
  console.log(`UP and RUNNING on ${PORT}`)
});