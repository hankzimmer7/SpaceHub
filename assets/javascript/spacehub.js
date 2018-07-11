//--------Global VARIABLES are declared here---------------------------------\\

//Variables for Location information
var userLatitude;
var userLongitude;
var userCity;
var userState;
var userCountry;
var inputLocation;

var geoUrl;
var reverseGeoUrl;
var geoApiKey = "vIThotHxCdFMxbA7OSxbY4kmK0bOGSBg";
var GMapsKey = "AIzaSyBGEg1nWHjxTxBD48-AkHMm0QV_TVn0S50";
var timeOffset = 0;
var locationTimezone = "";

// Variable for storing the date the user entered
var userDate;
// Variable for storing the current date
var currentDate;

//Variable for sotring the weather API key
var weatherApiKey = "166a433c57516f51dfab1f7edaed8413";

//Variable for slides
var slideIndex = 0;

//Variables for diplaying planet visiblity data
// get date
var d = new Date();
// store year
var year = d.getFullYear();
// store month
var month = d.getMonth();
// month names
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "november", "december"];

var monthName = monthNames[d.getMonth()];


//--------FUNCTIONS are declared here-------------------------------------------\\

//Function for cycling through planet display slides
function showSlides() {
    var i;
    var slides = document.getElementsByClassName("space-slide");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 3000);
}

//Function to show the current date
function showDate() {
    userDate = moment().format('YYYY-MM-DD');
    $("#date-input").val(userDate);
}

//Function to store the current date
function currentDate() {
    currentDate = moment().format('YYYY-MM-DD');
}

//Function to convert the input data
function convertInputDate() {
    monthName = moment(userDate, 'YYYY,MM,DD').format('MMMM');
    year = moment(userDate, 'YYYY,MM,DD').format('YYYY');
}

//Default Funtion to retrieve the user's location when the page loads
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('#location-input').innerHTML = "Geolocation is not supported by this browser.";
    }
}

//Function to check if the location the user entered is valid
function locationIsValid(inputLocation) {
    if (inputLocation != null) {
        //we can test better than this
        return true;
    } else {
        return false
    };
}

//Function to convert inputLocation to latLng
function convertToLatLng() {
    geoUrl = "https://www.mapquestapi.com/geocoding/v1/address?key=" + geoApiKey + "&location=" + inputLocation;
    $.ajax({
        url: geoUrl,
        method: "GET"
    }).done(function(response) {
        userLatitude = response.results[0].locations[0].latLng.lat;
        userLongitude = response.results[0].locations[0].latLng.lng;
    });
}

//Function to show the user's location
function showPosition(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    reverseGeoUrl = "https://www.mapquestapi.com/geocoding/v1/reverse?key=" + geoApiKey + "&location=" + userLatitude + "," + userLongitude + "&includeRoadMetadata=true&includeNearestIntersection=true";
    $.ajax({
        url: reverseGeoUrl,
        method: "GET"
    }).then(function(response) {
        inputLocation = response.results[0].locations[0].adminArea5 +
            "," + response.results[0].locations[0].adminArea3 +
            "," + response.results[0].locations[0].adminArea1;
        $("#location-input").val(inputLocation);
    });
}

//Function to display the current weather information
function currentWeather(viewingLocation) { //for the current time
    // TBD programmatically. Set the location that will be used in the function calls
    var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + viewingLocation + "&units=imperial&appid=" + weatherApiKey;
    $.ajax({
            url: weatherqueryURL,
            method: "GET"
        }) // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {
            var cloudyOrNot = response.weather[0];
            var currentWeather = $("#current-weather");
            currentWeather.empty();
            //Create a paragraph to store the current weather statement
            var weatherParagraph = $("<p>");

            //The weather text contains the current weather
            var weatherText = "Current weather: " + cloudyOrNot.main + ", or " + cloudyOrNot.description;

            //Add the weather text to the paragraph
            weatherParagraph.text(weatherText);

            //Append the weather statement to the current weather section of the page
            currentWeather.append(weatherParagraph);

            //Have the current weather fly in from the right
            anime({
                targets: '#current-weather',
                translateX: [500, 0],
            });

            var latLong = response.coord.lat + "," + response.coord.lon
            var timezoneURL = "https://maps.googleapis.com/maps/api/timezone/json?location=" + latLong + "&timestamp=" + response.dt + "&key=" + GMapsKey;
            $.ajax({
                    url: timezoneURL,
                    method: "GET"
                }) // We store all of the retrieved data inside of an object called "response"
                .then(function(response) {
                    timeOffset = response.dstOffset + response.rawOffset;
                    locationTimezone = response.timeZoneName;
                    chanceOfClearSky(viewingLocation);
                }); //end GMaps ajax 
        }); //end Weather ajax function
} // end current weather function

// Function to display the future weather forecast data
function chanceOfClearSky(viewingLocation) { // queries forecast not current weather removed: units=imperial&
    var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + viewingLocation + "&appid=" + weatherApiKey;
    $.ajax({
            url: forecastqueryURL,
            method: "GET"
        })
        .then(function(response) { //report every *4th* of the 40 weather predictions, each 3h apart, 

            var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            var fw = $("#forecast-weather");
            fw.empty();
            for (i = 0; i < 10; i++) {
                var weatherPeriod = i * 4;
                var list = response.list[weatherPeriod];
                var forecastDate = new Date(list.dt * 1000); //convert unix to JS.
                // From the API doc https://openweathermap.org/forecast5#JSON, 
                // list.dt returns the ***Time of data forecasted, unix, UTC***

                //Create a paragraph to store the forecast statement
                var forecastParagraph = $("<p>");
                // forecastParagraph.attr("item-number", i);
                forecastParagraph.attr("id", "item-" + i);

                //The forecast text contains the day of the week and that day's weather
                var forecastDayText = daysOfWeek[forecastDate.getDay()] + " ";

                var timZon = $("<span>"); //This is the time including a time zone title
                timZon.attr("title", locationTimezone);
                timZon.text(list.dt_txt.substring(11))
                fw.append(timZon); //append the time

                var forecastWeatherText = " " + list.weather[0].description;

                //Add the forecast text to the paragraph
                forecastParagraph.text(forecastDayText);
                forecastParagraph.append(timZon);
                forecastParagraph.append(forecastWeatherText);

                //Append the forecast statement to the forecast weather section of the page
                fw.append(forecastParagraph);

                //Target the most recently created element
                target = "#item-" + i;

                //If i is odd, have the forecast fly in from the left
                if (i % 2 == 0) {
                    anime({
                        targets: target,
                        translateX: [-500, 0],
                    });
                }

                //If i is even, have the forecast fly in from the right
                else {
                    anime({
                        targets: target,
                        translateX: [500, 0],
                    });
                }
            }
        }); //end ajax call
} // end chanceOfClearSky function

//Function to display NASA's Astronomy Picture of the Day
function displayPicOfDay() {
    var APIkey = "SB90oSEABnIVxulKWWm9a8gH7Eq7RyQgYAZCjKE1";
    var queryURL = "https://api.nasa.gov/planetary/apod?api_key=" + APIkey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        $("#pic-of-day").empty();
        var imgUrl = response.url;
        var urlExtension = imgUrl.split('.').pop();

        // If the picture of the day is an image, use an image tag
        if (urlExtension === "jpg") {
            var dayPic = $("<img>");
            dayPic.addClass("img-fluid");
            dayPic.attr("src", imgUrl);
            dayPic.attr("alt", "Pic of Day");
        }

        //If the picture of the day is a video, use an iframe
        else {
            $("#pic-of-day").addClass("embed-responsive embed-responsive-16by9");
            var dayPic = $("<iframe>");
            dayPic.addClass("embed-responsive-item");
            dayPic.attr("src", imgUrl);
            dayPic.attr("alt", "Pic of Day");
        }

        //Append the pic of the day to the page
        $("#pic-of-day").append(dayPic);
    })
};


//-------- Objects and methods ---------------------------------------------\\

// create an object called visiblePlanets to hold the planet visibility data and methods for determining active visible planets
var visiblePlanets = {
    // assign a number to each planet
    planetsString: ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    planetsNumber: [0, 1, 2, 3, 4, 5, 6],
    // need an object for years
    year2018: {
        // need a visibility counter for each month + planet
        January: ["at dawn", "null", "in the morning", "in the morning", "at dawn", "in the evening", "in the evening"],
        February: ["null", "null", "in the morning", "in the morning", "in the morning", "in the evening", "at dusk"],
        March: ["at dusk", "at dusk", "in the morning", "in the morning", "in the morning", "in the evening", "null"],
        April: ["at dawn", "at dusk", "in the morning", "in the morning", "in the morning", "null", "in the morning"],
        May: ["at dawn", "in the evening", "in the morning", "all night", "in the morning", "at dawn", "in the morning"],
        June: ["null", "in the evening", "in the morning", "in the evening", "all night", "in the morning", "in the morning"],
        July: ["at dusk", "in the evening", "all night", "in the evening", "in the evening", "in the morning", "in the morning"],
        August: ["at dawn", "in the evening", "in the evening", "in the evening", "in the evening", "in the morning", "in the morning"],
        September: ["null", "in the evening", "in the evening", "in the evening", "in the evening", "in the morning", "all night"],
        October: ["at dusk", "at dusk", "in the evening", "in the evening", "in the evening", "all night", "in the evening"],
        November: ["at dusk", "at dawn", "in the evening", "null", "in the evening", "in the evening", "in the evening"],
        December: ["at dawn", "in the morning", "in the evening", "at dawn", "at dusk", "in the evening", "in the evening"],
    },
    year2019: {
        // visibility counter for each month + planet
        January: ["null", "in the morning", "in the evening", "in the morning", "null", "in the evening", "in the evening"],
        February: ["at dusk", "in the morning", "in the evening", "in the morning", "in the morning", "in the evening", "at dusk"],
        March: ["null", "in the morning", "in the evening", "in the morning", "in the morning", "in the evening", "null"],
        April: ["at dawn", "in the morning", "in the evening", "in the morning", "in the morning", "null", "in the morning"],
        May: ["null", "at dawn", "in the evening", "in the morning", "in the morning", "at dawn", "in the morning"],
        June: ["at dusk", "at dawn", "at dusk", "all night", "in the morning", "in the morning", "in the morning"],
        July: ["null", "null", "at dusk", "in the evening", "in the evening", "all night", "in the morning"],
        August: ["at dawn", "null", "null", "in the evening", "in the evening", "in the morning", "in the morning"],
        September: ["null", "null", "null", "in the evening", "in the evening", "in the morning", "all night"],
        October: ["at dusk", "at dusk", "at dawn", "in the evening", "in the evening", "all night", "in the evening"],
        November: ["at dawn", "at dusk", "at dawn", "in the evening", "in the evening", "in the evening", "in the evening"],
        December: ["at dawn", "in the evening", "in the morning", "null", "at dusk", "in the evening", "in the evening"],
    },
    displayVisibility: function() {
        // empty the div for new results
        $("#visibility").empty();

        // if year is 2018
        if (year == 2018) {
            // print visibility status for each planet
            for (i = 0; i < this.planetsString.length; i++) {
                // check the planet visibility status
                if (this.year2018[monthName][i] !== "null") {

                    //Create the planetary visibility statement
                    var visibilityText = this.planetsString[i] + " will be visible " + this.year2018[monthName][i] + ".";

                    //Create a paragraph to hold the visibility statement
                    var paragraph = $("<p>");

                    // Add visibility text to paragraph
                    paragraph.text(visibilityText)

                    // Append paragraph to visibility section of page
                    $("#visibility").append(paragraph);

                } else {
                    // display nothing if not visible
                    $("#visibility").append();
                }
            }
        }
        // if year if 2019
        else if (year == 2019) {
            // run function same as before with year2019
            for (i = 0; i < this.planetsString.length; i++) {
                // check the planet visibility status
                if (this.year2019[monthName][i] !== "null") {
                    //Create the planetary visibility statement
                    var visibilityText = this.planetsString[i] + " will be visible " + this.year2019[monthName][i] + ".";

                    //Create a paragraph to hold the visibility statement
                    var paragraph = $("<p>");

                    // Add visibility text to paragraph
                    paragraph.text(visibilityText)

                    // Append paragraph to visibility section of page
                    $("#visibility").append(paragraph);

                } else {
                    // display nothing if not visible
                    $("#visibility").append();
                }
            }
        }
    }
}

// create an object called launchCountdown to hold methods for displaying launch countdown
var launchCountdown = {
    // method to get data from API
    getLaunchAPI: function() {
        // assign queryURL to get "next" launch
        var queryURL = "https://launchlibrary.net/1.3/launch/next/1";
        console.log(queryURL);
        // then ajax call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            // results var to store data
            var launchResults = response.launches[0];
            console.log(launchResults);
            // launchdate var
            var launchDate = launchResults.isostart;
            console.log(launchDate);

            // convert launch date to correct format for TimeCircles
            var formatDate = moment(launchDate).format("YYYY-MM-DD hh:mm:ss");
            console.log(formatDate);
            // edit data-date attribute
            $(".launch").attr("data-date", formatDate);
            // push date to TimeCircles
            $(".launch").TimeCircles();

            // name var
            var launchName = launchResults.name
            // name url var
            var launchNameURL = launchResults.rocket.wikiURL;
            // append text/link
            $("#launchName").append("Rocket name: <a href='" + launchNameURL + "'>" + launchName + "<br>");

            // agency var
            var agencyName = launchResults.rocket.agencies[0]["name"];
            // agency url
            var agencyNameURL = launchResults.rocket.agencies[0]["wikiURL"];
            // append text/link
            $("#launchName").append("Launch agency: <a href='" + agencyNameURL + "'>" + agencyName + "<br>");
            console.log(agencyName)

            // location var
            var launchLocation = launchResults.location.name;
            console.log(launchLocation);
            // map to location
            var launchLocationURL = launchResults.location.pads[0]["mapURL"];
            console.log(launchLocationURL);
            // append text/link
            $("#launchName").append("Launch location: <a href='" + launchLocationURL + "'>" + launchLocation + "<br>");



        })
    }
    // first get browser date

}

//-------Once the page loads, execute these functions--------------------------\\
$(document).ready(function() {
    //------------------meteor showers days remaining----------------//

    //Display the planet slideshow
    showSlides();

    // Show the user's current location and show the date
    getLocation();
    showDate();

    // store the currentDate
    currentDate();

    //Display the planetary visibility
    visiblePlanets.displayVisibility();

    // Display the launch countdown
    launchCountdown.getLaunchAPI();

    //Display NASA's astronomy picture of the day
    displayPicOfDay();

    //When the user clicks the search button
    $(document).on("click", "#search-button", function() {

        //Prevent the submit button from reloading the page
        event.preventDefault();

        //Get the date that the user selected
        userDate = $("#date-input").val();
        convertInputDate();

        visiblePlanets.displayVisibility();


        //Get the location that the user typed in
        inputLocation = $("#location-input").val();

        convertToLatLng();

        //If the user's input is a valid location
        if (locationIsValid(inputLocation) === true) {

            //Populate the weather area with weather information
            currentWeather(inputLocation);

        } else { // display please try again
            alert("The location entered is not valid");
        }
    });


    var sDates = [new Date('2018-08-12 12:00'), new Date('2018-10-21 12:00'), new Date('2018-11-17 2:00'), new Date('2018-12-13 11:10')]

    for (var i = 0; i < sDates.length; i++) {

        var diffInSeconds = Math.abs(sDates[i] - d) / 1000;
        var days = Math.floor(diffInSeconds / 60 / 60 / 24);
        var hours = Math.floor(diffInSeconds / 60 / 60 % 24);
        var minutes = Math.floor(diffInSeconds / 60 % 60);
        var showerContainer = $("<p>");
        showerContainer.append(days + 'days ');
        showerContainer.append(hours + 'hours ');
        showerContainer.append(minutes + 'minutes ');
        $("#meteorShowers").append(showerContainer);
    }

});