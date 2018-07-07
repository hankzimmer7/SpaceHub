var weatherObject = {
    "current-main": "",
    "current-description": "",
    "forecast-object": {}
}
// This is our API key
var APIKey = "166a433c57516f51dfab1f7edaed8413";

// Here we are building the URL we need to query the database
var inputLocation = "Atlanta,USA";

function currentWeather(viewingLocation) { //for the current time
    var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + viewingLocation + "&units=imperial&appid=" + APIKey;
    
    // Here we run our weather AJAX call to the OpenWeatherMap API
    $.ajax({
        url: weatherqueryURL,
        method: "GET"
    })// We store all of the retrieved data inside of an object called "response"
    .then(function (response) {
        
        // Log the weatherqueryURL
        console.log(weatherqueryURL);
        
        // Log the resulting object
        console.log(response);
        
        // Transfer content to HTML
        $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        $(".wind").text("Wind Speed: " + response.wind.speed);
        $(".humidity").text("Humidity: " + response.main.humidity);
        $(".temp").text("Temperature (F) " + response.main.temp);
        
        // Log the data in the console as well
        console.log("Wind Speed: " + response.wind.speed);
        console.log("Humidity: " + response.main.humidity);
        console.log("Temperature (F): " + response.main.temp);
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

            // Log the weatherqueryURL
            console.log(forecastqueryURL);
            console.log("forecast request on prev line, response on next line")
            console.log(response);
            console.log("Weather in 24h: description: " + response.list[8].weather[0].description);
            console.log("main is " + response.list[8].weather[0].main);

            console.log("Weather in 48h: description: " + response.list[16].weather[0].description);
            console.log("main is " + response.list[16].weather[0].main);

            console.log("Weather in 72h: ") //response.list[8].weather.0.description")
            console.log("description is " + response.list[24].weather[0].description);
            // console.log("Weather in 72h: response.list[8].weather[0].main")
            console.log("main is " + response.list[24].weather[0].main);

            console.log("Weather in 96h: description: " + response.list[32].weather[0].description);
            console.log("main is " + response.list[32].weather[0].main);

            weatherObject["forecast-object"] = response;
            console.log(JSON.stringify(weatherObject) + " is weatherObj")
        }); //end ajax call
    }


    currentWeather(inputLocation);
    chanceOfClearSky(inputLocation);
console.log(weatherObject)
console.log(JSON.stringify(weatherObject) + " is weatherObj")