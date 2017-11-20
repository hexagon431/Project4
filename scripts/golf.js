var closeCourses;
var currentCourse;
var local_obj = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};
var numholes;
var numplayers = 5;

function loadMe(){
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
            $("#tee-select").append("<option value='" + teename + "'>" + teename + "</option>");
        }

    });
}

function buildCard(tee){
    numholes = currentCourse.course.holes;
    console.log(numholes.length);

    for (var h in numholes){
        $(".score-column").append("<div id='column"+ (Number(h) + 1) +"' class='column'></div>");
    }
}