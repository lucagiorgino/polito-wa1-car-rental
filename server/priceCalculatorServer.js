function factor(p){
    return 1+p/100;
}


exports.calculatePrice = function (lessThan10,numberOfDay,category,kmPerDay,age,extraDrivers,extraInsurance,frequentCustomer){
    
    const dayPrice = {  A: 80, B: 70, C: 60, D: 50, E: 40 };
    let price = dayPrice[category];

    price *= numberOfDay; 
    if (kmPerDay <= 50)
        price *= factor(-5);
    else if (kmPerDay >= 150)
        price *= factor(5);

    if (age < 25)
        price *= factor(5);
    else if (age > 65)
        price *= factor(10);
    
    if (extraDrivers > 0)
        price *= factor(15);       
    if(extraInsurance)
        price *= factor(20);
    if(frequentCustomer)
        price *= factor(-10);
    if(lessThan10)
        price *= factor(10);

    return price;
}   
    