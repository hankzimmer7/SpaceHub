var weatherObject = {
    "current-main": "",
    "current-description": "",
    "forecast-object": {}
}
// This is our API key
var APIKey = "166a433c57516f51dfab1f7edaed8413";

// TBD programmatically. Set the location that will be used in the function calls
var inputLocation = "Atlanta,USA";

function currentWeather(viewingLocation) { //for the current time
    var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + viewingLocation + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: weatherqueryURL,
        method: "GET"
    })// We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            weatherObject.main = response.weather[0].main;
            weatherObject.description = response.weather[0].description;
        }); //end ajax function
} // end chance function

function chanceOfClearSky(viewingLocation) { // for the future
    var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + viewingLocation + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: forecastqueryURL,
        method: "GET"
    })// We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            weatherObject["forecast-object"] = response;
            console.log(JSON.stringify(weatherObject) + " is weatherObj")
        }); //end ajax call
}
currentWeather(inputLocation);
chanceOfClearSky(inputLocation);
