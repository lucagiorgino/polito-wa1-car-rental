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


const fetchAPI = {  getVehicles } ;
export default fetchAPI;