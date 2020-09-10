const fs = require('fs')
const { parse } = require('fast-csv');
const geodist = require('geodist');
const _ = require('lodash');

/*
 * Read Data Async
 */
function readFoodTruckCSV(filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return
            }
            resolve(data);
        })
    });
}

/*
 * parse the csv
 */
function parseCsvFile(csv) {
    return new Promise(function (resolve, reject) {
        csv.then((data) => {
            const parsedData = [];
            const stream = parse({headers: true})
                .on('error', error => reject(error))
                .on('data', row => parsedData.push(row))
                .on('end', () => resolve(parsedData));
            stream.write(data);
            stream.end();
        });
    });
}

/*
 * for each item in the array passed, calculate the distance to it
 */
function calculateDistance(locationOfInterest, data) {
    return _.map(data, (foodtruck)=> {
        foodtruck.distance =
            geodist(locationOfInterest,
                {lat:foodtruck.Latitude, lon: foodtruck.Longitude},
                {exact: true, unit: 'miles'});
        return foodtruck;
    });
}

/*
 * sort an array of foodtrucks based on the calculated distances
 */
function sortFoodTrucksByDistance(locationEnhancedFoodtrucks) {
    return _.orderBy(locationEnhancedFoodtrucks, "distance");
}


/*
 * when promise is fulfilled by the csv parser and we have an appropriate array of all food trucks in it,
 * process that list
 */
function returnClosestNFoodtrucks(locationOfInterest, data,n) {
    return new Promise(function (resolve) {
        data.then((data) => {
            const locationEnhancedFoodtrucks = calculateDistance(locationOfInterest, data);
            const distanceSortedFoodtrucks = sortFoodTrucksByDistance(locationEnhancedFoodtrucks);
            resolve(_.slice(distanceSortedFoodtrucks, 0, n)); // closest n sorted by distance
        });
    });
}


// main
if (require.main === module) {
    /*
     * dummy value for lat/lon until we determine how user provides location - this is generic "san francisco" form google
     */
    const locationOfInterest = {lat: 37.7749, lon: -122.4194};
    const csv = readFoodTruckCSV("./Mobile_Food_Facility_Permit.csv");
    const data = parseCsvFile(csv);
    const result = returnClosestNFoodtrucks(locationOfInterest, data, 5)
    result.then((result) => console.log(result));
}


