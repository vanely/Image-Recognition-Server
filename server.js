const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const Client = require('pg');
const config = require('./config');

//controllers for routes
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const PORT = process.env.PORT || config.port;

//postgres database configuration with knex
//this is a local server Heroku won't be able to recognize it
const db = new knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

//ENTRYPOINT 
app.get('/', (req, res) => {
  res.json(`SERVER CONNECTED: Now Serving`);
});

//-----------------------------------------------------------------
//SIGNIN
app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

//-----------------------------------------------------------------
//REGISTER USERS
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

//-----------------------------------------------------------------
//RESPONDS WITH USER INFO BASED ON ID
app.get('/profile/:id', (req, res, db) => {
  profile.handleProfile(req, res, db);
});

//-----------------------------------------------------------------
//INCREMENTS AND UPDATES USER ENTRIES FROM IMAGE UPLOADS
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

//TAKES USER ENTERED URL AND SENDS TO BACKEND
app.post('/imageUrl', (req, res) => {
  image.handleApiCall(req, res);
});

//SERVINT ON ENVIRONMENT PORT VARIABLE
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});