var closeCourses;
var local_obj = {latitude: 40.4426135, longitude: -111.8631116, radius: 100};

function loadMe(){
    $.post("https://golf-courses-api.herokuapp.com/courses", local_obj, function(data, status){
        closeCourses = JSON.parse(data);
        for (var p in closeCourses.courses){
            console.log(closeCourses.courses[p].name);
        }
    });
}