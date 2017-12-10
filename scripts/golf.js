var closeCourses;
var currentCourse;
var local_obj;
var numholes;
var numplayers = 4;
//this variable just keeps running total of how many players have been added so each new player gets a unique name
var totalPlayerCount = 4;

function loadCourses(){
    $("#course-select").html("");
    $("#course-select").append("<option id='course-placeholder'>-select course-</option>");

    $.post("https://golf-courses-api.herokuapp.com/courses", local_obj, function(data, status){
        closeCourses = JSON.parse(data);
        for (var p in closeCourses.courses){
            $("#course-select").append("<option value='"+ closeCourses.courses[p].id +"'>"+ closeCourses.courses[p].name  + "</option>");
        }
    });
}

function getCourse(courseID){
    $("#tee-select").html("");
    $("#tee-select").append("<option id='tee-placeholder'>-select tee type-</option>");
    $("#course-placeholder").remove();
    // $("#course-select").append("<option>-select course-</option>");

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
    $(".score-card").html("<div class='player-column'></div><div class='score-column'></div>");
    numholes = currentCourse.course.holes;

    $("#tee-placeholder").remove();

    for (var c in numholes){
        var holepar = currentCourse.course.holes[c].tee_boxes[tee].par;
        var yardage = currentCourse.course.holes[c].tee_boxes[tee].yards;
        var handicap = currentCourse.course.holes[c].tee_boxes[tee].hcp;

        $(".score-column").append("<div id='column"+ (Number(c) + 1) +"' class='column'><div class='holerow row'>"+ (Number(c) + 1) +"</div><div class='parrow row'>" + holepar + "</div><div class='yardrow row'>" + yardage +"</div><div class='hcprow row'>" + handicap + "</div></div></div>");
        if (c == 8){
            $(".score-column").append("<div id='outtotals' class='outtotals column'><div class='row'>Out</div></div>");

            var outParTotal = 0;
            var outYardTotal = 0;
            var outHcpTotal = 0;

            for (let s = 0; s < 9; s++){
                outParTotal = outParTotal + currentCourse.course.holes[s].tee_boxes[tee].par;
                outYardTotal = outYardTotal + currentCourse.course.holes[s].tee_boxes[tee].yards;
                outHcpTotal = outHcpTotal + currentCourse.course.holes[s].tee_boxes[tee].hcp;
            }
            $("#outtotals").append("<div class='row'>" + outParTotal + "</div><div class='row'>" + outYardTotal + "</div><div class='row'>" + outHcpTotal + "</div>");
        }
        else if (c == 17){
            $(".score-column").append("<div id='intotals' class='intotals column'><div class='row'>In</div></div>");

            var inParTotal = 0;
            var inYardTotal = 0;
            var inHcpTotal = 0;

            for (let w = 9; w < 18; w++){
                inParTotal = inParTotal + currentCourse.course.holes[w].tee_boxes[tee].par;
                inYardTotal = inYardTotal + currentCourse.course.holes[w].tee_boxes[tee].yards;
                inHcpTotal = inHcpTotal + currentCourse.course.holes[w].tee_boxes[tee].hcp;
            }
            $("#intotals").append("<div class='row'>" + inParTotal + "</div><div class='row'>" + inYardTotal + "</div><div class='row'>" + inHcpTotal + "</div>");
        }
    }
    $(".score-column").append("<div class='score-total column'><div class='row'>Totals</div><div class='row'>" + (outParTotal + inParTotal) + "</div><div class='row'>" + (outYardTotal + inYardTotal) + "</div><div class='row'>" + (outHcpTotal + inHcpTotal) + "</div>");

    fillCard();
}

function fillCard(){
    $(".player-column").append("<div class='holerow row'>Hole</div>");
    $(".player-column").append("<div class='parrow row'>Par</div>");
    $(".player-column").append("<div class='yardrow row'>Yards</div>");
    $(".player-column").append("<div class='hcprow row'>Handicap</div>");



    for (var p = 1; p <= numplayers; p++){
        $(".player-column").append("<div class='row player-name' id='pl" + p + "'><div class='name-field' contenteditable='true' onchange='validatePlayerNames(this.value)'>Player" + p + "</div><span class='glyphicon glyphicon-trash delete-button' aria-hidden='true' onclick='deletePlayer(" + p + ")' id='delete-button'></span></div>");

        for(var h = 1; h <= numholes.length; h++){
            $("#column" + h).append("<input id='player" + p + "hole" + h +"' type='number' class='hole-input' onchange='updatePlayerTotal(" + p + ")'/>");
        }

        $("#outtotals").append("<div id='player" + p + "outtotal' class='row'></div>");
        $("#intotals").append("<div id='player" + p + "intotal' class='row'></div>");
        $(".score-total").append("<div id='player" + p + "scoretotal' class='row'></div>");
    }

}

function addPlayer(){
    $("#add-player-button").remove();
    totalPlayerCount++;
    numplayers++;

    $(".player-column").append("<div class='row player-name' id='pl" + totalPlayerCount + "'><div class='name-field' contenteditable='true' onchange='validatePlayerNames(this.value)'>Player" + totalPlayerCount + "</div><span class='glyphicon glyphicon-trash delete-button' aria-hidden='true' onclick='deletePlayer(" + totalPlayerCount + ")' id='delete-button'></span></div>");

    for(let o = 1; o <= numholes.length; o++){
        $("#column" + o).append("<input id='player" + totalPlayerCount + "hole" + o +"' type='number' class='hole-input' onchange='updatePlayerTotal(" + totalPlayerCount + ")'/>");
    }

    $("#outtotals").append("<div id='player" + totalPlayerCount + "outtotal' class='row'></div>");
    $("#intotals").append("<div id='player" + totalPlayerCount + "intotal' class='row'></div>");
    $(".score-total").append("<div id='player" + totalPlayerCount + "scoretotal' class='row'></div>");

    if(numplayers < 4){
        $(".player-column").append("<a id='add-player-button'>Add Player +</a>")
    }
}

function deletePlayer(playerId){
    numplayers--;

    $("#pl" + playerId).remove();
    for(var h=1; h<=numholes.length; h++){
        $("#player" + playerId + "hole" + h).remove();
    }

    $("#player" + playerId + "outtotal").remove();
    $("#player" + playerId + "intotal").remove();
    $("#player" + playerId + "scoretotal").remove();

    $(".player-column").append("<a id='add-player-button' onclick='addPlayer()'>Add Player +</a>")


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

function validatePlayerNames(pName){
    console.log("beep boop, validatePlayerNames here");
    console.log(pName);
}

function updatePlayerTotal(player){
    console.log("beep boop, updateplayertotal here");
    console.log(player);


    let playerOutTotal = 0;
    let playerInTotal = 0;

    for (let v = 1; v <= 9; v++){
        console.log($("#player" + player + "hole"+ v).val());
        if($("#player" + player + "hole"+ v).val() != "") {
            playerOutTotal = playerOutTotal + parseInt($("#player" + player + "hole" + v).val());
            console.log(playerOutTotal);
        }
    }
    $("#player" + player + "outtotal").html(playerOutTotal);

    for (let q = 9; q < 18; q++){
        if($("#player" + player + "hole"+ q).val() != "") {
            playerInTotal = playerInTotal + parseInt($("#player" + player + "hole" + q).val());
        }
    }
    $("#player" + player + "intotal").html(playerInTotal);

    $("#player" + player + "scoretotal").html(playerInTotal + playerOutTotal);
}

function displayScoreMessage(player){

}