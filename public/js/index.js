"use strict";

$("#goToPrefrences").click(function() {
    $('html, body').animate({
        scrollTop: $("#prefrences").offset().top
    }, 2000);
});

let info = {
    location: "client"
};
