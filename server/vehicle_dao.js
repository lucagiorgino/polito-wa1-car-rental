'use strict';

const Vehicle = require('./Vehicle.js');
const db = require('./db.js');

const createVehicle = function (row) {
    const licensePlate = row.licenseplate;
    const category = row.category;
    const brand = row.brand;
    const model = row.model;
   
    return new Vehicle( licensePlate, category,brand,model);
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