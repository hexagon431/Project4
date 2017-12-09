var closeCourses;
var currentCourse;
var local_obj;
var numholes;
var numplayers = 4;

function loadCourses(){
    $("#course-select").append("<option>-select course-</option>");

    $.post("https://golf-courses-api.herokuapp.com/courses", local_obj, function(data, status){
        closeCourses = JSON.parse(data);
        for (var p in closeCourses.courses){
            //console.log("Course name: " + closeCourses.courses[p].name + "    Course ID: " + closeCourses.courses[p].id);
            $("#course-select").append("<option value='"+ closeCourses.courses[p].id +"'>"+ closeCourses.courses[p].name  + "</option>");
        }
    });
}

function getCourse(courseID){
    $("#tee-select").html("");
    $.get("https://golf-courses-api.herokuapp.com/courses/" + courseID, function(data, status){
        currentCourse = JSON.parse(data);
        console.log(currentCourse);
        for (var t in currentCourse.course.tee_types){
            var teename = currentCourse.course.tee_types[t].tee_type;
            $("#tee-select").append("<option value='" + t + "'>" + teename + "</option>");
        }

    });
}

function buildCard(tee){
    numholes = currentCourse.course.holes;
    console.log(numholes.length);

    for (var c in numholes){
        var holepar = currentCourse.course.holes[c].tee_boxes[tee].par;
        $(".score-column").append("<div id='column"+ (Number(c) + 1) +"' class='column'><div>Hole "+ (Number(c) + 1) +"</div>Par " + holepar + "</div></div>");
        if (c == 8){
            $(".score-column").append("<div class='outtotals column'>Out</div>")
        }
        else if (c == 17){
            $(".score-column").append("<div class='intotals column'>In</div>")

        }
    }
    $(".score-column").append("<div class='score-total column'>Totals</div>")

    fillCard();
}

function fillCard(){
    $(".player-column").append("<div class='holerow row'>Hole</div>");
    $(".player-column").append("<div class='parrow row'>Par</div>");
    $(".player-column").append("<div class='yardrow row'>Yards</div>");


    for (var p = 1; p <= numplayers; p++){
        $(".player-column").append("<div contenteditable='true' id='pl" + p + "'>Player" + p + "</div>");
        $(".score-column").append("<input type='text' id='total-player" + p +"' class='score-box'>");
        for(var h = 1; h <= numholes.length; h++){
            $("#column" + h).append("<input id='player" + p + "hole" + h +"' type='text' class='hole-input'/>");
        }
    }
}

function deletePlayer(playerId){
    $("#pl" + playerId).remove();
    for(var h=1; h<=numholes.length; h++){
        $("#player" + playerId + "hole" + h).remove();
    }
}

function getCoordinatesFromZipCode(){
    $("#ziperror").hide();

    var zip = $("#zip").val();
    var rad = Number($("#radius").val());

    //convert from miles to kilometers
    rad = rad * 1.609344;

    if (zip > 10000 && zip < 99999 && zip != null && rad != null){
        $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + "&key=AIzaSyD_NPHIrLEEXMzX6539FOKx_1WSBkd8zVI", function(data, status){
            console.log(data);

            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;

            local_obj = {latitude: lat, longitude: lng, radius: rad};
            loadCourses();
        });
    }
    else{
        $("#ziperror").show();
    }

}

function validatePlayerNames(){

}