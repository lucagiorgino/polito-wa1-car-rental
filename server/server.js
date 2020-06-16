const express = require('express');// server module
const morgan = require('morgan'); // logging module
const userDao = require('./user_dao.js');
const vehicleDao = require('./vehicle_dao.js');


// const { check, oneOf, validationResult } = require('express-validator');

const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtSecretContent = require('./secrets.js');
const jwtSecret = jwtSecretContent.jwtSecret;
const expireTime = 300; //seconds

const BASEURL = '/api' ;
const app = new express();
app.use(morgan('tiny'));
app.use(express.json());

// POST /api/login
// Authentication endpoint
// {"username":"dev","password":"enter"}
app.post(BASEURL + '/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    userDao.getUser(username)
      .then((user) => {

        if(user === undefined) {
            res.status(404).send({errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }]});
        } else {
            if(!userDao.checkPassword(user, password)){
                res.status(401).send({errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]});
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ user: user.username }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({username: user.username});
            }
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 1000)}).then(() => res.status(401).json(authErrorObj))
        }
      );
});

app.use(cookieParser());

// POST /api/logout
app.post(BASEURL + '/logout', (req, res) => {
    res.clearCookie('token').end();
});


// ref https://expressjs.com/it/api.html#req.params
// GET /vehicles?category[]=A&category[]=B&brand[]=Fiat&brand[]=Ford
// req.query.brand => ['Fiat','Ford]
// req.query.category => ['A','B']

//GET /vehicles
app.get(BASEURL + '/vehicles', (req, res) => {
    
    vehicleDao.getVehicles(req.query.brand,req.query.category)
        .then((vehicles) => res.json(vehicles))
        .catch((err) => {res.status(500).json({errors: [{'msg': err}]});});
    
});


const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));