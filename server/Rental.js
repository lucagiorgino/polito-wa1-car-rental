// const moment = require('moment');

class Rental {    
    constructor(username,startDate,endDate, car) {
        this.username = username;
        this.startDate = startDate;
        this.endDate = endDate;
        this.car = car;
    }
}

module.exports = Rental;