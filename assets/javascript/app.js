// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCd1csdYBbdlA2IQtcD_C6-gYweCxd1Mos",
    authDomain: "train-scheduler-85a28.firebaseapp.com",
    databaseURL: "https://train-scheduler-85a28.firebaseio.com",
    storageBucket: "train-scheduler-85a28.appspot.com"
    // projectId: "train-scheduler-85a28",
    // messagingSenderId: "685844699041"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirstTime = $("#first-train-time-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        first: trainFirstTime,
        frequency: trainFrequency
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.first);
    // console.log(newTrain.frequency);

    // Clear all of the text boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding new train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().first;
    var trainFrequency = childSnapshot.val().frequency;
    var nextArrival;
    var minutesAway;

    console.log("first Train Time" + firstTrainTime);

    // Train Info
    // console.log(trainName);
    // console.log(trainDestination);
    // console.log("trainFirstTime: " + trainFirstTime);
    // console.log(trainFrequency);

    // Prettify the Train first time
    // var trainFirstTimePretty = moment.unix(trainFirstTime).format("HH:MM");

    // var convertTime = Date.parse(trainFirstTime);
    // console.log("converted time: " + convertTime);

    //23:00 -> 11:00PM
    var firstTrain = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log("first Train time: " + firstTrain);

    var trainTime = moment(firstTrain, "hh:mm").subtract(1, "years");


    //number of minutes between first train and now
    var timeGap = moment().diff(moment(firstTrainTime), "minutes");
    // console.log("timeGap (min): " + timeGap);
    var remainder = timeGap % trainFrequency;
    minutesAway = trainFrequency - remainder;

    var nextTrain = moment().add(minutesAway, "minutes");
    nextArrival = moment(nextTrain).format("hh:mm");

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
});

// var date1 = new Date('01/01/1970 + "trainFirstTime"');
// alert(now);
// console.log(now);