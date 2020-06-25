'use strict';

const Vehicle = require('./Vehicle.js');
const Rental = require('./Rental.js');
const db = require('./db.js');

const createVehicle = function (row) {
    const licensePlate = row.licenseplate;
    const category = row.category;
    const brand = row.brand;
    const model = row.model;
   
    return new Vehicle( licensePlate, category,brand,model);
}

const createRental = function (row) {
    const vehicle = new Vehicle(row.licenseplate, row.category, row.brand, row.model) ;
    const startDate = row.startDate;
    const endDate = row.endDate;
    const username = row.user;
   
    return new Rental(username,startDate,endDate,vehicle);
}

/*
esempio di query 
SELECT * 
FROM Vehicles 
WHERE (category = 'A' OR category = 'B') AND (brand = 'Fiat' OR brand= 'Ford')
*/

exports.getVehicles = function(brands,categories) {
    return new Promise((resolve, reject) => {
        
        let brandsConditions = [];
        let categoriesConditions = [];
        let values = [];

        // costruzione query
        if(brands) brands.map( (brand) => {brandsConditions.push(`brand=?`); values.push(brand);}); 
        
        if(categories) categories.map( (category) => {categoriesConditions.push(`category=?`); values.push(category); }); 
        
        brandsConditions = (brandsConditions.length > 0 ? brandsConditions.join(" OR ") : "") ;
        categoriesConditions =(categoriesConditions.length > 0 ? categoriesConditions.join(" OR ") : "") ;
        
        let condition = "";
        if( brandsConditions &&  categoriesConditions ){
            condition = "(" + brandsConditions + ") AND (" + categoriesConditions +")" ;
            brandsConditions = "";
            categoriesConditions = "";
        }
            
        // sarà piena solo una delle 3 stringhe tra condition, brandsConditions, categoriesConditions
        let sql = "SELECT DISTINCT category,brand,model FROM Vehicles" + (values.length > 0 ? (" WHERE " + condition + brandsConditions + categoriesConditions) : "");
        console.log(">>>>>>exec")
        console.log(sql)
        console.log(values)
        console.log("<<<<<<")
        db.all(sql, values, (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }else{
                const vehicles = rows.map((row) => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
};


/* esempio eseguito su db
SELECT *
FROM Vehicles
WHERE category='A' AND licenseplate 
NOT IN ( 
SELECT licenseplate
FROM Rentals
WHERE '2020-06-18'<=endDate AND '2020-06-20'>=startDate)

condizioni: p=prenotazione, n=noleggio
NOT (STARTP>ENDN OR ENDP<STARTN)
(STARTP<=ENDN AND ENDP>=STARTN) */
exports.getAvailableVehicles = function(startDate,endDate,category) {
    return new Promise((resolve, reject) => {
                
        let sql = "SELECT * FROM Vehicles WHERE category=? AND licenseplate NOT IN (SELECT licenseplate FROM Rentals WHERE date(?)<=date(endDate) AND date(?)>=startDate)";
        
        db.all(sql, [category,startDate,endDate], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }else{
                const vehicles = rows.map((row) => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
};

exports.getNCategoryVehicles = function(category) {
    return new Promise((resolve, reject) => {
                
        let sql = "SELECT COUNT(*) AS nTotalCategoryVehicles FROM Vehicles WHERE category=?";
        db.all(sql, [category], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }else{
                resolve(rows[0].nTotalCategoryVehicles);
            }
        });
    });
};

exports.getBrands = function() {
    return new Promise((resolve, reject) => {
                
        let sql = "SELECT DISTINCT brand FROM Vehicles";
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }else{
                resolve(rows);
            }
        });
    });
};

exports.getRentalsForUser = function(user) {
    return new Promise((resolve, reject) => {
                
        let sql = "SELECT * FROM Rentals,Vehicles WHERE user = ? AND Rentals.licenseplate = Vehicles.licenseplate";
        db.all(sql, [user], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }else{
                const rentalsForUser = rows.map((row) => createRental(row));
                resolve(rentalsForUser);
            }
        });
    });
};

exports.addRental = function(licenseplate,startDate,endDate,user) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Rentals(licenseplate, startDate, endDate, user) VALUES(?,?,?,?)';
        db.run(sql, [licenseplate, startDate, endDate, user], function (err) {
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve(null);
            }
        });
    });
}

exports.deleteRental = function(username,licenseplate,startDate) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Rentals WHERE licenseplate = ? AND user=? AND startDate=?';
        db.run(sql, [licenseplate,username,startDate], (err) => {
            if(err)
                reject(err);
            else 
                resolve(null);
        })
    });
}

