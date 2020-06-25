// const moment = require('moment');

class DesiredRental {    
    constructor(startDate,endDate, category,price) {
        
        this.startDate = startDate;
        this.endDate = endDate;
        this.category = category;
        this.price = price;
    }
}

export default DesiredRental;