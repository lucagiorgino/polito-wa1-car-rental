class Vehicle{    

    constructor(licensePlate, category,brand,model) {
        this.licensePlate = licensePlate;
        this.category = category;
        this.brand = brand;
        this.model = model;
    }

    static from(json) {
        const v =  Object.assign(new Vehicle(), json);
        return v;
    }

}

export default Vehicle;