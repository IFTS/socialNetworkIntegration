"use strict";

$("#goToPrefrences").click(function() {
    $('html, body').animate({
        scrollTop: $("#prefrences").offset().top
    }, 2000);
});

let info = {
    location: "client"
};

$.ajax({
    type: 'POST',
    data: info,
    url: '/profile',
    dataType: 'JSON'
}).done(function(response) {
    searchFunction(response);
    console.log(response);
});

function searchFunction(objToSearch) {
$("#searchForm").submit(function(event){
    event.preventDefault();
    let text = $('#myInput').val();
    let search = '';
    search = JSON.search(objToSearch, `//*[contains(caption, "${text}") or contains(text, "${text}")]`);
    let stringifySearch = JSON.stringify(search);
    $.post('/updateTimeline', {stringifySearch});

    /*$.ajax({
        type: 'POST',
        data: JSON.stringify(search),
        url: '/updateTimeline',
        dataType: 'JSON',
        contentType: "application/json; charset=utf-8"
    }).done(function(response) {
      console.log(response);
});*/
});
}
