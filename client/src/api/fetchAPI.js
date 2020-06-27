import Vehicle from './Vehicle.js';
const baseURL = "/api";


// ref https://expressjs.com/it/api.html#req.params
// GET /vehicles?category[]=A&category[]=B&brand[]=Fiat&brand[]=Ford

async function getVehicles(categories,brands) {
    let url = "/vehicles";

    if(categories || brands){
        let queryParams = ["?"];
        if(categories) categories.map( (category) => queryParams.push("category[]=",category,"&") ); 
        if(brands) brands.map( (brand) => queryParams.push("brand[]=",brand,"&") );      
        queryParams = queryParams.join('');
        url += queryParams;
    }
    const response = await fetch(baseURL + url);
    const vehiclesJson = await response.json();
    if(response.ok){
        return {vehicles: vehiclesJson.map((v) => Vehicle.from(v)),url: (url)};
    } else {
        let err = {status: response.status, errObj:vehiclesJson};
        throw err;  // An object with the error coming from the server
    }
}

async function getBrands() {
    let url = "/vehicles/brands";

    const response = await fetch(baseURL + url);
    const brandsJson = await response.json();
    if(response.ok){
        return brandsJson;
    } else {
        let err = {status: response.status, errObj:brandsJson};
        throw err;  // An object with the error coming from the server
    }
}


// example: GET /vehicles/available?startDate=val1&endDate=val2&category=val3
async function getAvailableVehicles(category,startDate,endDate) {
    let url = "/vehicles/available";
    url+="?startDate="+startDate+"&endDate="+endDate+"&category="+category;

    const response = await fetch(baseURL + url);
    const availableVehicles = await response.json();
    if(response.ok){
        return availableVehicles.map((v) => Vehicle.from(v));
    } else {
        let err = {status: response.status, errObj:availableVehicles};
        throw err;  // An object with the error coming from the server
    }
}

// example: GET /vehicles/numeber?category=?
async function getNCategoryVehicles(category) {
    let url = "/vehicles/number?category=";
    url+=category;

    const response = await fetch(baseURL + url);
    const number = await response.json();
    if(response.ok){
        return number;
    } else {
        let err = {status: response.status, errObj:number};
        throw err;  // An object with the error coming from the server
    }
}

async function getRentalsForUser() {
    let url = "/rentals";

    const response = await fetch(baseURL + url);
    const rentalsJson = await response.json();
    if(response.ok){
        return rentalsJson;
    } else {
        let err = {status: response.status, errObj:rentalsJson};
        throw err;  // An object with the error coming from the server
    }
}

async function checkPrice(forminfo) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/checkprice", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(forminfo),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then((obj) =>  reject({status: response.status, errObj: obj}) ) // error msg in the response body
                .catch((err) =>  reject({status: response.status, errObj: {errors: [{ param: "Application", msg: "Cannot parse server response" }]}}) ); // something else
            }
        }).catch((err) => reject( { errObj: {errors: [{ param: "Server", msg: "Cannot communicate" }]}} )); // connection errors
    });
}

async function addRental(desiredRental) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/rentals", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(desiredRental),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then((obj) =>  reject({status: response.status, errObj: obj}) ) // error msg in the response body
                .catch((err) =>  reject({status: response.status, errObj: {errors: [{ param: "Application", msg: "Cannot parse server response" }]}}) ); // something else
            }
        }).catch((err) => reject( { errObj: {errors: [{ param: "Server", msg: "Cannot communicate" }]}} )); // connection errors
    });
}

async function deleteRental(rental){
    return new Promise((resolve, reject) => {
        fetch(baseURL+'/rentals?licenseplate=' + rental.car.licensePlate +"&startDate=" + rental.startDate, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else { 
                // analyze the cause of error
                response.json()
                .then((obj) =>  reject({status: response.status, errObj: obj}) ) // error msg in the response body
                .catch((err) =>  reject({status: response.status, errObj: {errors: [{ param: "Application", msg: "Cannot parse server response" }]}}) ); // something else
            }
        }).catch((err) => reject( { errObj: {errors: [{ param: "Server", msg: "Cannot communicate" }]}} )); // connection errors
    });
}
  

const fetchAPI = {  getVehicles, getBrands, getAvailableVehicles, getNCategoryVehicles, getRentalsForUser, checkPrice, deleteRental, addRental};
export default fetchAPI;