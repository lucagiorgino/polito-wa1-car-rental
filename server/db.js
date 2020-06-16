'use strict';

const sqlite = require('sqlite3'); // npm install sqlite3
const db = new sqlite.Database('./database/data.db', (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

module.exports = db;