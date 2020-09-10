const fs = require('fs')
const { parse } = require('fast-csv');
const geodist = require('geodist');
const _ = require('lodash');

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
            .on('end', () => resolve(parsedData));
        stream.write(data);
        stream.end();
    });
});

/*
 * dummy value for lat/lon until we determine how user provides location - this is generic "san francisco" form google
 */
const locationOfInterest =     {lat: 37.7749, lon: -122.4194};

/*
 * for a given item, calculate distance in miles as the crow flies
 */
function determineDistance(foodtruck) {
    foodtruck.distance = geodist(locationOfInterest, {lat:foodtruck.Latitude, lon: foodtruck.Longitude}, {exact: true, unit: 'miles'});
    return foodtruck;
}

/*
 * for each item in the array passed, calculate the distance to it
 */
function calculateFoodTruckDistance(parsedData) {
    return _.map(parsedData, determineDistance);
}

/*
 * sort an array of foodtrucks based on the calculated distances
 */
function sortFoodTrucksByDistance(locationEnhancedData) {
    return _.orderBy(locationEnhancedData, "distance");
}

/*
 * when promise is fulfilled by the csv parser and we have an appropriate array of all food trucks in it,
 * process that list
 */
parsedDataPromise.then((parsedData) => {
    const locationEnhancedData = calculateFoodTruckDistance(parsedData);
    const distanceSortedFoodtrucks = sortFoodTrucksByDistance(locationEnhancedData);
    const closestFive = _.slice(distanceSortedFoodtrucks, 0, 4);
    console.log(closestFive);
});
