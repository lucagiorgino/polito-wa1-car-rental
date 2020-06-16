'use strict';

const User = require('./User.js');
const db = require('./db.js');
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */
const createUser = function (row) {
    const username = row.username;
    const pswHash = row.hash;
   
    return new User( username, pswHash);
}

exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT username,hash FROM Users WHERE username = ?";
        db.all(sql, [username], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};


exports.checkPassword = function(user, password){
    console.log("hash to check: " + password);
    let hash = bcrypt.hashSync(password, 10);
    console.log(">"+hash);
    console.log("DONE");

    return bcrypt.compareSync(password, user.pswHash);
}