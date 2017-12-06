var closeCourses;
var currentCourse;
var local_obj = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};
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
        $(".score-column").append("<div id='column"+ (Number(c) + 1) +"' class='column'><div>Hole "+ (Number(c) + 1) +"</div>Par " + holepar + "</div>")
    }
    $(".score-column").append("<div class='score-total column'></div>")

    fillCard();
}

function fillCard(){
    for (var p = 1; p <= numplayers; p++){
        $(".player-column").append("<div contenteditable='true' id='pl" + p + "'>Player</div>");
        $(".score-column").append("<input type='text' id='total-hole" + p +"'>");
        for(var h = 1; h <= numholes.length; h++){
            $("#column" + h).append("<input id='player" + (p+1) + "hole" + h +"' type='text' class='hole-input'/>");
        }
    }
}

function deletePlayer(playerId){
    $("#pl" + playerId).remove();
    for(var h=1; h<=numholes.length; h++){
        $("#player" + playerId + "hole" + h).remove();
    }
}