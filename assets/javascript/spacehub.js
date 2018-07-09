//--------Declare global VARIABLES here-------------------------------------------------

// This is our weather API key from the ajax Bujumbura exercise
var APIKey = "166a433c57516f51dfab1f7edaed8413";

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
var monthNames = ["january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

//--------Create FUNCTIONS here--------------------------------------------------------

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

function currentWeather(viewingLocation) { //for the current time
    // TBD programmatically. Set the location that will be used in the function calls
    var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + viewingLocation + "&units=imperial&appid=" + APIKey;
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
            var weatherText = "Current weather: " + cloudyOrNot.main+ ", or " + cloudyOrNot.description;

            //Add the weather text to the paragraph
            weatherParagraph.text(weatherText);

            //Append the weather statement to the current weather section of the page
            currentWeather.append(weatherParagraph);
        }); //end ajax function
} // end current weather function

function chanceOfClearSky(viewingLocation) { // queries forecast not current weather removed: units=imperial&
    var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + viewingLocation + "&appid=" + APIKey;
    $.ajax({
            url: forecastqueryURL,
            method: "GET"
        })
        .then(function (response) { //report every *4th* of the 40 weather predictions, each 3h apart, 
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

                //The forecast text contains the day of the week and that day's weather
                var forecastText = daysOfWeek[forecastDate.getDay()] + " " + list.dt_txt.substring(11) + " UTC: " + list.weather[0].description;

                //Add the forecast text to the paragraph
                forecastParagraph.text(forecastText);

                //Append the forecast statement to the forecast weather section of the page
                fw.append(forecastParagraph);
            }
        }); //end ajax call
} // end chanceOfClearSky function

//Function to check if the location the user entered is valid
function locationIsValid(inputLocation) {
    if (inputLocation != null) {
        //we can test better than this
        return true;
    } else {
        return false
    };
}

//-------- Objects and methods -------------------\\

// create an object called visiblePlanets to hold the planet visibility data and methods for determining active visible planets
var visiblePlanets = {
    // assign a number to each planet
    planetsString: ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
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
        else if (year === 2019) {
            // run function same as before with year2019
            for (i = 0; i < this.planetsString.length; i++) {
                // check the planet visibility status
                if (this.year2019[monthName][i] !== "null") {
                    // display visibility stats in html div
                    $("#visibility").append(this.planetsString[i] + " will be visibie " + this.year2018[monthName][i] + "<br>");
                } else {
                    // display nothing if not visible
                    $("#visibility").append();
                }
            }

        }
    }
}

//-------Once the page loads, execute these functions----------------------------------
$(document).ready(function () {

    //Display the planet slideshow
    showSlides();

    //Disaplay the planetary visibility
    visiblePlanets.displayVisibility();

    $(document).on("click", "#search-button", function () {

        //Prevent the submit button from reloading the page
        event.preventDefault();

        //Get the location that the user typed in
        inputLocation = $("#location-input").val();

        //If the user's input is a valid location
        if (locationIsValid(inputLocation) === true) {

            //Populate the weather area with weather information
            currentWeather(inputLocation);
            chanceOfClearSky(inputLocation);

        } else { // display please try again
            alert("The location entered is not valid");
        }
    })

});