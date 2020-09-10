const fs = require('fs')
const { parse } = require('fast-csv');

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

/*
 * parse the csv
 */
const parsedDataPromise = new Promise(function(resolve, reject){
    dataPromise.then((data) => {
        const parsedData = [];
        const stream = parse({headers: true})
            .on('error', error => reject(error))
            .on('data', row => parsedData.push(row))
            .on('end', rowCount => resolve({parsedData, rowCount}));
        stream.write(data);
        stream.end();
    });
});

parsedDataPromise.then((parsedData)=> console.log(parsedData));
