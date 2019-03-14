// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCd1csdYBbdlA2IQtcD_C6-gYweCxd1Mos",
    authDomain: "train-scheduler-85a28.firebaseapp.com",
    databaseURL: "https://train-scheduler-85a28.firebaseio.com",
    storageBucket: "train-scheduler-85a28.appspot.com"
    // projectId: "train-scheduler-85a28",
    // messagingSenderId: "685844699041"
};

var a = $("<p>/p>");

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();
    a.empty();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirstTime = $("#first-train-time-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();
    // var valid = validation(trainName);

    if (trainName.length !== 0 && trainDestination.length !== 0 && trainFirstTime.length !== 0 && trainFrequency.length !== 0 && isNaN(trainFirstTime) == false && isNaN(trainFrequency) == false) {

        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            first: trainFirstTime,
            frequency: trainFrequency
        };

        // Uploads employee data to the database
        database.ref().push(newTrain);

        // Clear all of the text boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-time-input").val("");
        $("#frequency-input").val("");

    } else {
        if (trainName.length == 0) {
            $("#form-group-1").append(a);
            a.addClass("invalid");
            $(a).text("Please fill the field");
        }
        else if (trainDestination.length == 0) {
            $("#form-group-2").append(a);
            a.addClass("invalid");
            $(a).text("Please fill the field");
        }
        else if (trainFirstTime.length == 0) {
            $("#form-group-3").append(a);
            a.addClass("invalid");
            $(a).text("Please fill the field");
        }
        else if (isNaN(trainFirstTime) == true) {
            $("#form-group-3").append(a);
            a.addClass("invalid");
            $(a).text("Please enter time in military format HHMM");
            $("#first-train-time-input").val('');;
        }
        else if (trainFrequency.length == 0) {
            $("#form-group-4").append(a);
            a.addClass("invalid");
            $(a).text("Please fill the field");
        }
        else if (isNaN(trainFrequency) == true) {
            $("#form-group-4").append(a);
            a.addClass("invalid");
            $(a).text("Please enter a number");
            $("#frequency-input").val('');;

        }
    }
}
)

// 3. Create Firebase event for adding new train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().frequency;
    var nextArrival;
    var minutesAway;

    console.log("first Train Time: " + firstTrainTime);

    firstTrainTime = moment(firstTrainTime, "HH:mm");

    console.log("first Train: " + firstTrainTime);

    //number of minutes between first train and now
    var timeGap = moment().diff(moment(firstTrainTime), "minutes");
    console.log("time Gap: " + timeGap);

    var remainder = timeGap % trainFrequency;
    console.log("remainder: " + remainder);

    minutesAway = trainFrequency - remainder;
    console.log("minutes Away: " + minutesAway);

    var nextTrain = moment().add(minutesAway, "minutes");
    nextArrival = moment(nextTrain).format("LT");

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway),
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

})