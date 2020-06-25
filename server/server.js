const express = require('express');// server module
const morgan = require('morgan'); // logging module
const userDao = require('./user_dao.js');
const vehicleDao = require('./vehicle_dao.js');
const moment = require('moment');
const priceCalculator = require('./priceCalculatorServer.js'); 
const { check, oneOf, validationResult } = require('express-validator');

const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };
const jwtSecretContent = require('./secrets.js');
const jwtSecret = jwtSecretContent.jwtSecret;
const expireTime = 600; //seconds

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
            res.status(404).send({errors: [{ 'param': 'Server', 'msg': 'Invalid username (space will be counted as character)' }]});
        } else {
            if(!userDao.checkPassword(user, password)){
                res.status(401).send({errors: [{ 'param': 'Server', 'msg': 'Wrong password' }]});
            } else {
                //AUTHENTICATION SUCCESS
                const token = jsonwebtoken.sign({ username: user.username }, jwtSecret, {expiresIn: expireTime});
                res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: 1000*expireTime });
                res.json({username: user.username});
            }
        } 
      }).catch(

        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        (err) => {
            new Promise((resolve) => {setTimeout(resolve, 5000)}).then(() => res.status(401).json(authErrorObj))
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

//GET /vehicles/brands
app.get(BASEURL + '/vehicles/brands', (req, res) => {
    vehicleDao.getBrands()
        .then((brands) => res.json(brands))
        .catch((err) => {res.status(500).json({errors: [{'msg': err}]});});   
});

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
////////                                                                  ////////
////////                     AUTHENTICATION NECESSARY                     ////////
////////                                 |                                ////////
////////                                 v                                ////////
////////                                                                  ////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


// For the rest of the code, all APIs require authentication
app.use( jwt({secret: jwtSecret,getToken: req => req.cookies.token }) );;

 
// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json(authErrorObj);
    }
});

// AUTHENTICATED REST API endpoints

//GET /user
app.get('/api/user', (req,res) => {
    const username = req.user && req.user.username;
    
    userDao.getUser(username)
        .then((user) => {
           res.json({username: user.username});
        }).catch((err) => {
         res.status(401).json(authErrorObj);
        }
    );
    /*
    if(username) res.json({username: user.username});
    else res.status(401).json(authErrorObj);
    */
 });

// GET /vehicles/available?startDate=val1&endDate=val2&category=val3
// req.query.startDate => val1
// req.query.endDate => val2
// req.query.category => val3

app.get(BASEURL + '/vehicles/available', (req, res) => {
    vehicleDao.getAvailableVehicles(req.query.startDate,req.query.endDate,req.query.category)
        .then((vehicles) => res.json(vehicles))
        .catch((err) => {res.status(500).json({errors: [{'msg': err}]});}); 
});

//GET /vehicles/numeber?category=?
app.get(BASEURL + '/vehicles/number', (req, res) => {
    vehicleDao.getNCategoryVehicles(req.query.category)
        .then((n) => {res.json(n)})
        .catch((err) => {res.status(500).json({errors: [{'msg': err}]});});
});

//GET /rentals
app.get(BASEURL + '/rentals', (req, res) => {
    const username = req.user && req.user.username;

    vehicleDao.getRentalsForUser(username)
        .then((rentals) => {res.json(rentals)})
        .catch((err) => {res.status(500).json({errors: [{'msg': err}]});});
});

//DELETE /rentals?licenseplate=?&startDate=?
app.delete(BASEURL + '/rentals', (req,res) => {
    const username = req.user && req.user.username;
    vehicleDao.deleteRental(username,req.query.licenseplate,req.query.startDate )
        .then((result) => res.status(204).end())
        .catch((err) => res.status(500).json({
            errors: [{'param': 'Server', 'msg': err}],
        }));
});

async function getPrice(username,info){
    
    
    let lessThan10 = false;
    let frequentCustomer = false;
    let availableVehicles = await vehicleDao.getAvailableVehicles(info.startDate,info.endDate,info.category);
    let nCategory = await vehicleDao.getNCategoryVehicles(info.category);
    
    if ( availableVehicles.length/nCategory*100 < 10 )
        lessThan10 = true;

    let rentals = await vehicleDao.getRentalsForUser(username);

    if( rentals.filter( (r) => moment(r.endDate).isBefore(moment())).length >= 3 ){
        frequentCustomer = true;
    }
    
    let numberOfDay = moment(info.endDate).diff(moment(info.startDate),'days')+1;
    let price = priceCalculator.calculatePrice(lessThan10,numberOfDay,info.category,info.km,info.age,info.extraDrivers,info.extraInsurance,frequentCustomer);

    return price.toFixed(2);
}

// POST /checkprice
// info = {startDate: ,endDate: ,category: ,km: ,age: ,extraDrivers: ,extraInsurance: }
app.post(BASEURL + '/checkprice', async (req,res) => {
    const info = req.body;
    if(!info){
        res.status(400).end();
    } else {
        const username = req.user && req.user.username;
        console.log(username,">",info.clientCalculatedPrice)
        try {
            let availableVehicles = await vehicleDao.getAvailableVehicles(info.startDate,info.endDate,info.category);
            if ( availableVehicles.length === 0 )
                return res.status(400).json({errors: [{'msg': "no available vehicles"}]});
            let price = await getPrice(username,info);
            console.log(price)
            if( price != info.clientCalculatedPrice)
                return res.status(400).json({errors: [{'msg': "price error"}]});
            
            res.status(204).end();
        }
        catch(err){
            console.log(err)
            res.status(500).json({errors: [{'msg': err}]});
        }        
    }
});

// POST /rentals
app.post(BASEURL + '/rentals', async (req,res) => {
    const info = req.body;
    if(!info){
        res.status(400).end();
    } else {
        const username = req.user && req.user.username;
        
        try {
            let availableVehicles = await vehicleDao.getAvailableVehicles(info.startDate,info.endDate,info.category);
            if ( availableVehicles.length === 0 )
                return res.status(400).json({errors: [{'msg': "no available vehicles"}]});
            
            let vehicle = availableVehicles[Math.floor(Math.random() * availableVehicles.length)];
            await vehicleDao.addRental(vehicle.licensePlate,info.startDate,info.endDate,username)     
            res.status(201).json(vehicle);            
        }
        catch(err){
            console.log(err)
            res.status(500).json({errors: [{'msg': err}]});
        }        
    }
});

// POST /pay
// regex from https://stackoverflow.com/questions/3073850/javascript-regex-test-peoples-name/29037473
app.post(BASEURL + '/pay', [ 
    check('fullName').exists().matches(/^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/).withMessage('must be 2 words'),
    check('CVVcode').exists().isNumeric().isLength({ min: 3, max:3  }).withMessage('must be 3 digits long'),
    check('cardNumber').exists().isNumeric().isLength({ min: 16, max:16  }).withMessage('must be 16 digits long'), 
    ], async (req,res) => {
        console.log(req.body)
        // https://express-validator.github.io/docs/validation-result-api.html
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            // Build your resulting errors however you want! String, object, whatever - it works!
            return {param:`${param}`, msg: `${msg}`};
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
        // Response will contain something like
        // { errors: [ "body[password]: must be at least 10 chars long" ] }
        return res.status(422).json({ errors: result.array() });
        }
        
        // other payment check
        res.end();
});


const PORT = 3001;
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));