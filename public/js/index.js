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
/*
function searchFunction(objToSearch) {
    $("#myInput").keyup(function() {
        console.log("were inside keyup");
        let text = this.value;
        let search = '';
        search = JSON.search(objToSearch, `//*[contains(text, "${text}") or contains(caption, "${text}")]`);
        console.log(search);
    });

}
*/
function searchFunction(objToSearch) {
$("#searchForm").submit(function(event){
    event.preventDefault();
    let text = $('#myInput').val();
    let search = '';
    search = JSON.search(objToSearch, `//*[contains(text, "${text}") or contains(caption, "${text}")]`);
    console.log(search);
});
}
