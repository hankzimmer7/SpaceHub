//--------Declare global VARIABLES here-------------------------------------------------
// This is our API key from the ajax Bujumbura exercise
// var APIKey = "166a433c57516f51dfab1f7edaed8413";
var APIKey = "d63c21203366e4021c6216ff0916db71";

//--------Create FUNCTIONS here--------------------------------------------------------
function currentWeather(viewingLocation) { //for the current time
    console.log(viewingLocation);
    // var weatherqueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + viewingLocation + "&units=imperial&appid=" + APIKey;
    var weatherqueryURL = "http://api.openweathermap.org/data/2.5/weather?q=Bujumbura&appid=d63c21203366e4021c6216ff0916db71";
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

function chanceOfClearSky(viewingLocation) { // queries forecast not current weather
    var forecastqueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + viewingLocation + "&units=imperial&appid=" + APIKey;
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
                fW.append(list.dt_txt.substring(list.dt_txt.length - 8, 8) + " UTC");
                fW.append("<br>0123456789".substring(5, 3) + " UTC");
                fW.append(": " + list.weather[0].description + "<br>"); //append that day's weather
            }
        }); //end ajax call
} // end chanceOfClearSky function

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
    inputLocation = $("#viewing-location").val();
    if (locationIsValid(inputLocation) == true) {
        currentWeather(inputLocation);
        chanceOfClearSky(inputLocation);
    } else { // display please try again
        alert("The location entered is not valid");
    }// end if statement
}) // end #search-button click function


//-------Once the page loads, execute these functions----------------------------------
$(document).ready(function () {

    document.getElementById("viewing-location").value = "Atlanta,GA"; // for quick and easy testing/troubleshooting
    
});