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
var convertUnix;

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

var distLaunch;

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
    console.log(inputLocation);
    console.log(userLatitude);
    console.log(userLongitude);
    geoUrl = "https://www.mapquestapi.com/geocoding/v1/address?key=" + geoApiKey + "&location=" + inputLocation;
    $.ajax({
        url: geoUrl,
        method: "GET"
    }).done(function (response) {
        userLatitude = response.results[0].locations[0].latLng.lat;
        userLongitude = response.results[0].locations[0].latLng.lng;
        launchCountdown.getLaunchAPI();
    });

}

function dateIsInNextFive() {
    convertUnix = moment(userDate, 'YYYY,MM,DD').unix();
    if (((convertUnix < d.getTime() / 1000) && ((d.getTime() / 1000 - convertUnix) > 24 * 60 * 60))) {
        $("#forecast-weather").text("Your date is in the past");
    } else {
        var datesBetween = convertUnix - d.getTime() / 1000;
        if (datesBetween > 5 * 24 * 60 * 60) {
            $("#forecast-weather").text("Weather forecast available only for the next five days");
        } else {
            //oneDaysWeather();	
            currentWeather(inputLocation);
        }
    }
} // end dateIsInNextFive

//Function to show the user's location
function showPosition(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
    launchCountdown.getLaunchAPI();
    // console.log(userLatitude);
    // console.log(userLongitude);
    reverseGeoUrl = "https://www.mapquestapi.com/geocoding/v1/reverse?key=" + geoApiKey + "&location=" + userLatitude + "," + userLongitude + "&includeRoadMetadata=true&includeNearestIntersection=true";
    $.ajax({
        url: reverseGeoUrl,
        method: "GET"
    }).then(function (response) {
        inputLocation = response.results[0].locations[0].adminArea5 +
            "," + response.results[0].locations[0].adminArea3 +
            "," + response.results[0].locations[0].adminArea1;
        $("#location-input").val(inputLocation);
        currentWeather(inputLocation); // also calls the GMaps timezone ajax, then the futureWeather ajax
    });
}

// Function to calculate diatance between two lang long pairs and convert degrees to radians
// (from:https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
// distance function
function latLongDistance(lat1, lon1, lat2, lon2) {
    var R = 3959; // Radius of the earth in miles
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var aVal =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var cVal = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    var dVal = R * cVal; // Distance in km
    distLaunch = Math.round(dVal);
}
// degrees to radians function
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

//Function to display the current weather information
function currentWeather(viewingLocation) { //for the current time
    // TBD programmatically. Set the location that will be used in the function calls
    var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + viewingLocation + "&units=imperial&appid=" + weatherApiKey;
    $.ajax({
            url: weatherqueryURL,
            method: "GET"
        }) // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
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
                .then(function (response) {
                    timeOffset = response.dstOffset + response.rawOffset;
                    locationTimezone = response.timeZoneName;
                    futureWeather(viewingLocation);
                }); //end GMaps ajax 
        }); //end Weather ajax function
} // end current weather function

// Function to display the future weather forecast data
function futureWeather(viewingLocation) { // queries forecast not current weather removed: units=imperial&
    var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + viewingLocation + "&appid=" + weatherApiKey;
    $.ajax({
            url: forecastqueryURL,
            method: "GET"
        })
        .then(function (response) { //report every *4th* of the 40 weather predictions, each 3h apart, 

            var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
                timZon.text(list.dt_txt.substring(11)); // We DID NOT incorporate timeOffset variable! -Brett's bad
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
    }).then(function (response) {
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


// Function to convert youtube to embed format
function createYouTubeEmbedLink(link) {
    return link.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
}

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
    displayVisibility: function () {
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
    getLaunchAPI: function () {
        // clear out existing HTML
        $(".launch-info").empty();
        // assign queryURL to get "next" launch
        var queryURL = "https://launchlibrary.net/1.3/launch/next/1";
        // console.log(queryURL);
        // then ajax call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            // results var to store data
            var launchResults = response.launches[0];
            // console.log(launchResults);
            // launchdate var
            var launchDate = launchResults.isostart;
            // console.log(launchDate);

            // convert launch date to correct format for TimeCircles
            var formatDate = moment(launchDate).format("YYYY-MM-DD hh:mm:ss");
            // console.log(formatDate);
            // edit data-date attribute
            $(".launch").attr("data-date", formatDate);
            // push date to TimeCircles
            $(".launch").TimeCircles();

            // name var
            var launchName = launchResults.name;
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
            // console.log(agencyName)

            // location var
            var launchLocation = launchResults.location.name;
            // console.log(launchLocation);
            // map to location
            var launchLocationURL = launchResults.location.pads[0]["mapURL"];
            // lat and long
            var launchLat = launchResults.location.pads[0]["latitude"];
            var launchLong = launchResults.location.pads[0]["longitude"];
            // update userLat/long
            // inputLocation = $("#location-input").val();
            // convertToLatLng();
            // call latLongDistance
            latLongDistance(userLatitude, userLongitude, launchLat, launchLong);
            // console.log(distLaunch)
            // console.log(userLatitude);
            // console.log(userLongitude);
            // append text/link
            if (userLatitude && userLongitude) {
                $("#launchName").append("Launch location: <a href='" + launchLocationURL + "'>" + launchLocation + "</a><br>" + distLaunch + " miles from location");
            } else {
                $("#launchName").append("Launch location: <a href='" + launchLocationURL + "'>" + launchLocation + "<br>");
            }
        })
    },
    // method for blastoff button
    blastOff: function () {
        // initialize url array	
        var launchVidURLs = [];
        // initialize ids array
        var launchIDs = [];
        // initialize total var
        var total;

        // use currentDate to get a range of launches
        // get yesterday's date in YYYY-MM-DD
        // console.log(d);
        var yesterday = d.setDate(d.getDate() - 1);
        // get 6 months ago from yesterday date
        var sixMonths = d.setDate(d.getDate() - 181);
        // reset d
        d = new Date();
        // format dates
        var formatYesterday = moment(yesterday).format("YYYY-MM-DD");
        var formatSixMonths = moment(sixMonths).format("YYYY-MM-DD");
        // console.log(formatYesterday);
        // console.log(formatSixMonths);

        // create queryURL in the form of https://launchlibrary.net/1.3/launch?startdate=formatSixMonths&enddate=formatYesterday
        var queryURL = "https://launchlibrary.net/1.3/launch?startdate=" + formatSixMonths + "&enddate=" + formatYesterday;
        // console.log(queryURL);
        // then ajax call
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            // update total
            total = response.total;

            // create next queryURL in the form of https://launchlibrary.net/1.3/launch?startdate=formatSixMonths&enddate=formatYesterday&limit=total
            // console.log(total);
            var queryURLLimit = queryURL + "&limit=" + total;
            // console.log(queryURLLimit);

            // then ajax call
            $.ajax({
                url: queryURLLimit,
                method: "GET"
            }).then(function (response) {
                // console.log(response);
                // console.log(response.launches.length)
                // loop through response pushing IDs
                for (i = 0; i < response.launches.length - 1; i++) {
                    launchIDs.push(response.launches[i]["id"]);
                }
                // console.log(launchIDs)

                // pick a random ID from the Array
                var randomID = launchIDs[Math.floor(Math.random() * launchIDs.length)];
                // console.log(randomID);

                // create next queryURL using randomID
                var queryURLID = "https://launchlibrary.net/1.3/launch/" + randomID;
                // console.log(queryURLID);

                // then ajax call
                $.ajax({
                    url: queryURLID,
                    method: "GET"
                }).then(function (response) {
                    // console.log(response);
                    // store vidsURLs
                    var vidURLsArray = response.launches[0]["vidURLs"]
                    // console.log(vidURLsArray);
                    // check if vidURLsArray is not null
                    if (vidURLsArray !== null && vidURLsArray.length !== 0) {
                        // pick a random url
                        var randomVidURL = vidURLsArray[Math.floor(Math.random() * vidURLsArray.length)];
                        // console.log(randomVidURL);
                        // check if string includes youtube
                        if (randomVidURL.includes("youtube")) {
                            // convert URL to embed URL
                            var randomEmbedSRC = createYouTubeEmbedLink(randomVidURL);
                            // edit attributes to show on page
                            $("#blastOffRow").toggleClass("d-none", false);
                            $("#blastOffVideo").attr("src", randomEmbedSRC);
                        }
                        // otherwise get new value
                        else {
                            launchCountdown.blastOff();
                        }
                    }
                    // otherwise get new value
                    else {
                        launchCountdown.blastOff();
                    }
                    // push URL to embeded youtube div

                })
            })
        })
    }
}

//-------Once the page loads, execute these functions--------------------------\\
$(document).ready(function () {

    //Have the title fly in from the right
    anime({
        targets: '.display-4',
        translateX: [500, 0],
        duration: 1000,
        easing: 'easeInOutQuart'
    });

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

    //Display NASA's astronomy picture of the day
    displayPicOfDay();

    //When the user clicks the search button
    $(document).on("click", "#search-button", function () {

        //Prevent the submit button from reloading the page
        event.preventDefault();

        //Get the date that the user selected
        userDate = $("#date-input").val();
        convertInputDate();

        visiblePlanets.displayVisibility();


        //Get the location that the user typed in
        inputLocation = $("#location-input").val();


        convertToLatLng(); //what does this do? -BW
        visiblePlanets.displayVisibility();

        //If the user's input is a valid location
        if (locationIsValid(inputLocation) === true) {

            //Populate the weather area with weather information
            currentWeather(inputLocation);

        } else { // display please try again
            alert("The location entered is not valid");
        }
    })

    //When the user clicks the Blast Off button
    $(document).on("click", "#blastOff", function () {
        launchCountdown.blastOff();
    })

    //Redraw the time circles when the page is resized
    $(window).resize(function () {
        $(".launch").TimeCircles().rebuild();
    });

});