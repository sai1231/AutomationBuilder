$(document).ready(function () {

    var siteData = JSON.parse(localStorage.getItem('siteData'));
    console.log(siteData);

    $.each(siteData, function (index, value) {
        $("#js_recorder").append(index + ": " + value + '<br>');
    });

});