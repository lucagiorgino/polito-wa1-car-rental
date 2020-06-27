const baseURL = "/api";

async function pay(paymentObj) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/pay", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentObj),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then((obj) =>  reject({status: response.status, errObj: obj}) ) // error msg in the response body
                .catch((err) =>  reject({status: response.status, errObj: {errors: [{ param: "Application", msg: "Cannot parse server response" }]}}) ); // something else   
            }
        }).catch((err) => { reject( { errObj: {errors: [{ param: "Server", msg: "Cannot communicate" }]}} )}); // connection errors
    });
}



const paymentAPI = { pay };
export default paymentAPI;