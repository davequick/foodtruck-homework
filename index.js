const fs = require('fs')

/*
 * Read Data Async
 */
const dataPromise = new Promise(function(resolve, reject) {
    fs.readFile('./Mobile_Food_Facility_Permit.csv', 'utf8' , (err, data) => {
        if (err) {
            reject(err);
            return
        }
        resolve(data);
    })
});

dataPromise.then((data)=>console.log(data));
