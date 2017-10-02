
var config = {
	apiKey: "AIzaSyBcIfv4moiP8B5XvnI0Z1Jd9hifvwNpghU",
	authDomain: "train-scheduler-45535.firebaseapp.com",
	databaseURL: "https://train-scheduler-45535.firebaseio.com",
	projectId: "train-scheduler-45535",
	storageBucket: "",
	messagingSenderId: "302955548429"
	};

firebase.initializeApp(config);

var database = firebase.database();

$("#add-train").on("click", function(event) {
  event.preventDefault();

  var trainName = $("#train-route-input").val().trim();
  var trainDestination= $("#destination-input").val().trim();
  var firstTrain = $('#first-train-input').val().trim();
  var trainFrequency = $("#frequency-input").val().trim();
  
  var newTrain = {
    trainName: trainName,
    destination: trainDestination,
    firstTrain: firstTrain,
    frequency: trainFrequency
  };

  database.ref().push(newTrain);
  
  $("#success-modal").modal();
  
  $('input[type="text"]').val('');
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	var snapVal = childSnapshot.val();
	console.log(snapVal);

	var firstArrival = moment(snapVal.firstTrain, "HH:mm");
	console.log("firstArrival: " + firstArrival);
	
	var frequency = snapVal.frequency;
	console.log("frequency: " + frequency);
	
	var timeBetween = moment().diff(moment.unix(firstArrival, "HH:mm"), "minutes");
	console.log("timeBetween: " + timeBetween);

	var minutesAway = frequency - (moment().diff(moment.unix(firstArrival, "HH:mm"), "minutes") % frequency);
	console.log("minutesAway: " + minutesAway);

	var nextTrain = parseInt((firstArrival) + ((timeBetween + minutesAway) * 60));
	console.log("nextTrain: "+ nextTrain);

	var trainDisplay = moment.unix(nextTrain).format("LT");
	console.log(trainDisplay);
	


	var trainName = snapVal.trainName;
	var destination = snapVal.destination;
	var frequency = snapVal.frequency;
	var firstTrain = moment(snapVal.firstTrain, "HH:mm");
	
	var minutesAway = frequency - (moment().diff(moment.unix(firstTrain, "HH:mm"), "minutes") % frequency);
	
	var timeBetween = moment().diff(moment.unix(firstTrain, "HH:mm"), "minutes");
	var nextTrain = parseInt((firstTrain) + ((timeBetween + minutesAway) * 60));
	var nextTrainTime = moment.unix(nextTrain).format("LT");
	console.log(trainName);
	console.log(frequency);
	console.log(firstTrain);
	console.log(minutesAway);

	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td class='nextTrainFrequency'>every " +
	frequency + " min</td><td class='traintime'>" + nextTrainTime + "</td><td class='nextTrainMinutes'>" + minutesAway + "</td></tr>");
	
});
