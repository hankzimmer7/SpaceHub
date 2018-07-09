//--------Declare global VARIABLES here-------------------------------------------------
// This is our API key from the ajax Bujumbura exercise
// var APIKey = "166a433c57516f51dfab1f7edaed8413";
var APIKey = "d63c21203366e4021c6216ff0916db71";

//--------Create FUNCTIONS here--------------------------------------------------------
function currentWeather(viewingLocation) { //for the current time
    console.log(viewingLocation);
    // var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + viewingLocation + "&units=imperial&appid=" + APIKey;
    var weatherqueryURL = "http://api.openweathermap.org/data/2.5/weather?q=Atlanta,USA&appid=d63c21203366e4021c6216ff0916db71";
    $.ajax({
        url: weatherqueryURL,
        method: "GET"
    })// We store all of the retrieved data inside of an object called "response"
        .then(function (response) {
            var cloudyOrNot = response.weather[0];
            $("#current-weather").empty();
            var currentWeather = $("#current-weather");
            currentWeather.append("Current weather: " + cloudyOrNot.main);
            currentWeather.append(", or " + cloudyOrNot.description + "<br>")
        }); //end ajax function
} // end current weather function

function chanceOfClearSky(viewingLocation) { // queries forecast not current weather removed: units=imperial&
    var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + viewingLocation + "&appid=" + APIKey;
    $.ajax({
        url: forecastqueryURL,
        method: "GET"
    })
        .then(function (response) { //report every *4th* of the 40 weather predictions, each 3h apart, 
            console.log(response);
            $("#forecast-weather").empty();
            var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            for (i = 0; i < 10; i++) {
                var weatherPeriod = i * 4;
                var list = response.list[weatherPeriod];
                var fW = $("#forecast-weather");
                var forecastDate = new Date(list.dt * 1000); //convert unix to JS.
                // From the API doc https://openweathermap.org/forecast5#JSON, 
                // list.dt returns the ***Time of data forecasted, unix, UTC***
                fW.append(daysOfWeek[forecastDate.getDay()] + " "); //append the day of the week
                fW.append(list.dt_txt.substring(12) + " UTC");
                fW.append(": " + list.weather[0].description + "<br>"); //append that day's weather
            }
        }); //end ajax call
} // end chanceOfClearSky function
// get date
var d = new Date();
// store year
var year = d.getFullYear();
// store month
var month = d.getMonth();
// month names
var monthNames = ["january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

function locationIsValid(inputLocation) {
    if (inputLocation != null) {
        //we can test better than this
        return true;
    } else { return false };
}

// $("#search-button").on("click", function () {
$(document).on("click", "#search-button", function () {
    // $("button").on("click", function () {
    event.preventDefault();
    inputLocation = $("#location-input").val();
    if (locationIsValid(inputLocation) == true) {
        currentWeather(inputLocation);
        chanceOfClearSky(inputLocation);
    } else { // display please try again
        alert("The location entered is not valid");
    }// end if statement
}) // end #search-button click function
//-------- Objects and methods -------------------\\

// create an object called visiblePlanets to hold the planet visibility data and methods for determining active visible planets
var visiblePlanets = {
    // assign a number to each planet
    planetsString: ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"],
    planetsNumber: [0, 1, 2, 3, 4, 5, 6],
    // need an object for years
    year2018: {
        // need a visibility counter for each month + planet
        january: ["at dawn", "null", "in the morning", "in the morning", "at dawn", "in the evening", "in the evening"],
        february: ["null", "null", "in the morning", "in the morning", "in the morning", "in the evening", "at dusk"],
        march: ["at dusk", "at dusk", "in the morning", "in the morning", "in the morning", "in the evening", "null"],
        april: ["at dawn", "at dusk", "in the morning", "in the morning", "in the morning", "null", "in the morning"],
        may: ["at dawn", "in the evening", "in the morning", "all night", "in the morning", "at dawn", "in the morning"],
        june: ["null", "in the evening", "in the morning", "in the evening", "all night", "in the morning", "in the morning"],
        july: ["at dusk", "in the evening", "all night", "in the evening", "in the evening", "in the morning", "in the morning"],
        august: ["at dawn", "in the evening", "in the evening", "in the evening", "in the evening", "in the morning", "in the morning"],
        september: ["null", "in the evening", "in the evening", "in the evening", "in the evening", "in the morning", "all night"],
        october: ["at dusk", "at dusk", "in the evening", "in the evening", "in the evening", "all night", "in the evening"],
        november: ["at dusk", "at dawn", "in the evening", "null", "in the evening", "in the evening", "in the evening"],
        december: ["at dawn", "in the morning", "in the evening", "at dawn", "at dusk", "in the evening", "in the evening"],
    },
    year2019: {
        // visibility counter for each month + planet
        january: ["null", "in the morning", "in the evening", "in the morning", "null", "in the evening", "in the evening"],
        february: ["at dusk", "in the morning", "in the evening", "in the morning", "in the morning", "in the evening", "at dusk"],
        march: ["null", "in the morning", "in the evening", "in the morning", "in the morning", "in the evening", "null"],
        april: ["at dawn", "in the morning", "in the evening", "in the morning", "in the morning", "null", "in the morning"],
        may: ["null", "at dawn", "in the evening", "in the morning", "in the morning", "at dawn", "in the morning"],
        june: ["at dusk", "at dawn", "at dusk", "all night", "in the morning", "in the morning", "in the morning"],
        july: ["null", "null", "at dusk", "in the evening", "in the evening", "all night", "in the morning"],
        august: ["at dawn", "null", "null", "in the evening", "in the evening", "in the morning", "in the morning"],
        september: ["null", "null", "null", "in the evening", "in the evening", "in the morning", "all night"],
        october: ["at dusk", "at dusk", "at dawn", "in the evening", "in the evening", "all night", "in the evening"],
        november: ["at dawn", "at dusk", "at dawn", "in the evening", "in the evening", "in the evening", "in the evening"],
        december: ["at dawn", "in the evening", "in the morning", "null", "at dusk", "in the evening", "in the evening"],
    },
    displayVisibility: function () {
        // get month name
        var monthName = monthNames[d.getMonth()];
        // if year is 2018
        if (year === 2018) {
            // print visibility status for each planet
            for (i = 0; i < this.planetsString.length; i++) {
                // check the planet visibility status
                if (this.year2018[monthName][i] !== "null") {
                    // display visibility stats in html div
                    $("#visibility").append(this.planetsString[i] + " will be visbile " + this.year2018[monthName][i] + "<br>");
                }
                else {
                    // display nothing if not visible
                    $("#visibility").append();
                }
            }
        }
        // if year if 2019
        else if (year === 2019) {
            // run function same as before with year2019
            for (i = 0; i < this.planetsString.length; i++) {
                // check the planet visibility status
                if (this.year2019[monthName][i] !== "null") {
                    // display visibility stats in html div
                    $("#visibility").append(this.planetsString[i] + " will be visbile " + this.year2018[monthName][i] + "<br>");
                }
                else {
                    // display nothing if not visible
                    $("#visibility").append();
                }
            }

        }
    }
}

//-------Once the page loads, execute these functions----------------------------------
$(document).ready(function () {

    document.getElementById("location-input").value = "Atlanta,USA"; // for quick and easy testing/troubleshooting
    
    // {
    //     alert("The javascript file is linked!");
    // }

    visiblePlanets.displayVisibility();
});