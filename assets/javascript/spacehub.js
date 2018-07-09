//--------Declare global variables here-------------------------------------------------

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

//--------Create Functions here--------------------------------------------------------

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
showSlides();
    // {
    //     alert("The javascript file is linked!");
    // }


});
 visiblePlanets.displayVisibility();


var slideIndex = 0;


function showSlides() {
    var i;
    var slides = document.getElementsByClassName("space-slide");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1} 
    slides[slideIndex-1].style.display = "block"; 
    setTimeout(showSlides, 3000);
}

   
