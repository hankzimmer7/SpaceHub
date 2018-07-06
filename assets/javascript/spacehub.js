//--------Declare global variables here-------------------------------------------------
var userLatitude;
var userLongitude;
var userDisplayLocation;
var queryURL;

//--------Create Functions here--------------------------------------------------------

//Funtion to retrieve the user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        $('#user-location').innerHTML = "Geolocation is not supported by this browser.";
    }
}
//Function to show the user's position
function showPosition(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;

    console.log("Latitude: " + userLatitude + " Longitude: " + userLongitude);
    queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + userLatitude + "," + userLongitude + "&sensor=true";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        console.log(response.results[5].formatted_address);
        userDisplayLocation = response.results[5].formatted_address;
        var newParagraph = $('<p>');
        newParagraph.text("Current Location: " + userDisplayLocation);
        $('#user-location').append(newParagraph);
    });
}

//-------Once the page loads, execute these functions----------------------------------
$(document).ready(function () {

    //Get user's geolocation
    $(document).on("click", "#get-user-location-button", function () {

        console.log("Retrieving user location");
        //Calls function to get the user's location
        getLocation();
    });
});