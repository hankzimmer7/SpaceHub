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
        january: ["dawn", "null", "morning", "morning", "dawn", "evening", "evening"],
        ferbruary: ["null", "null", "morning", "morning", "morning", "evening", "dusk"],
        march: ["dusk", "dusk", "morning", "morning", "morning", "evening", "null"],
        april: ["dawn", "dusk", "morning", "morning", "morning", "null", "morning"],
        may: ["dawn", "evening", "morning", "all night", "morning", "dawn", "morning"],
        june: ["null", "evening", "morning", "evening", "all night", "morning", "morning"],
        july: ["dusk", "evening", "all night", "evening", "evening", "morning", "morning"],
        august: ["dawn", "evening", "evening", "evening", "evening", "morning", "morning"],
        september: ["null", "evening", "evening", "evening", "evening", "morning", "all night"],
        october: ["dusk", "dusk", "evening", "evening", "evening", "all night", "evening"],
        november: ["dusk", "dawn", "evening", "null", "evening", "evening", "evening"],
        december: ["dawn", "morning", "evening", "dawn", "dusk", "evening", "evening"],
    }, 
    year2019: {
        // visibility counter for each month + planet
        january: ["null", "morning", "evening", "morning", "null", "evening", "evening"],
        ferbruary: ["dusk", "morning", "evening", "morning", "morning", "evening", "dusk"],
        march: ["null", "morning", "evening", "morning", "morning", "evening", "null"],
        april: ["dawn", "morning", "evening", "morning", "morning", "null", "morning"],
        may: ["null", "dawn", "evening", "morning", "morning", "dawn", "morning"],
        june: ["dusk", "dawn", "dusk", "all night", "morning", "morning", "morning"],
        july: ["null", "null", "dusk", "evening", "evening", "all night", "morning"],
        august: ["dawn", "null", "null", "evening", "evening", "morning", "morning"],
        september: ["null", "null", "null", "evening", "evening", "morning", "all night"],
        october: ["dusk", "dusk", "dawn", "evening", "evening", "all night", "evening"],
        november: ["dawn", "dusk", "dawn", "evening", "evening", "evening", "evening"],
        december: ["dawn", "evening", "morning", "null", "dusk", "evening", "evening"],        
    },
    displayVisibility: function() {
        // get month name
        var monthName = monthNames[d.getMonth()];
        console.log(this.year2018[monthName][2]); 
    }
}

//-------Once the page loads, execute these functions----------------------------------
$(document).ready(function () {

    {
        alert("The javascript file is linked!");
    }

    visiblePlanets.displayVisibility();
});