// ===== Initialize Firebase =====

var config = {
	apiKey: "AIzaSyDVUm3_mdCcDEBkSbYSM3o3ZCnVs1NU1WA",
	authDomain: "austin-glucose-tracker.firebaseapp.com",
	databaseURL: "https://austin-glucose-tracker.firebaseio.com",
	projectId: "austin-glucose-tracker",
	storageBucket: "austin-glucose-tracker.appspot.com",
	messagingSenderId: "245096650436",
	appId: "1:245096650436:web:f37770e3522a83be"
};

firebase.initializeApp(config);

// ===== End of Firebase Initialization =====


// ===== Global Variables =====

var logsRef, database,
	reverseLogsOrder = true,
	count = 0,
	numberOfHeaders = 7,
	tableIndex = 0;

var carbIntakes = [];
var units = [];
var corrections = [];
var nodeNames = [];

var tbody = document.getElementById("tbody");
var modal = document.getElementById("modalWindow");
var logEditContent = document.getElementById("logEditContent");
var noteModal = document.getElementById("viewNote");
var removeModal = document.getElementById("removeConfirmation");

// ===== End Global Variables =====


(function () {
	// ===== Database References =====

	// Set database variable
	database = firebase.database();

	// Reference the logs tree
	logsRef = database.ref("/logs");

	// ===== End Database References =====


	// ===== Database Snapshot =====

	logsRef.orderByChild("timestamp").on("value", snapshot => {
		// Reset table body
		document.getElementById("tbody").innerHTML = "";

		snapshot.forEach(s => {
			count++;
			nodeNames.push(s.key);
		});

		// Reverse logs
		if (reverseLogsOrder) {
			for (var i = count - 1; i >= 0; i--) {
				displayLogs(snapshot, i);
			}
		} else { // Don't reverse logs
			for (var i = 0; i < count; i++) {
				displayLogs(snapshot, i);
			}
		}

		// Average data
		var averageCarbIntake = 0,
			averageUnits = 0,
			averageCorrections = 0,
			totalLogs = 0;

		
		// ===== Loop through data of each log =====

		carbIntakes.forEach(value => {
			averageCarbIntake += value;
			totalLogs++;
		});

		units.forEach(value => {
			averageUnits += value;
		});

		corrections.forEach(value => {
			averageCorrections += value;
		});

		// ===== End loop through data of each log =====


		// Average log data calculation
		averageCarbIntake = Math.round(averageCarbIntake / totalLogs);
		averageUnits = Math.round(averageUnits / totalLogs);
		averageCorrections = Math.round(averageCorrections / totalLogs);

		// No logs case
		if (totalLogs == 0) {
			averageCarbIntake = averageUnits = averageCorrections =
				"Add a New Log!";
		}

		// Create 'Add New Log' functionality
		// Create a new row for the given table index
		var addLogRow = document
			.getElementById("tbody")
			.insertRow(tableIndex);

		addLogRow.innerHTML =
			"<tr id='addData'><td colspan='6'><button id='addLog' onclick=''>Add New Log</button></td><td></td></tr>";

		var dataViewRow = document
			.getElementById("tbody")
			.insertRow(++tableIndex);

		dataViewRow.innerHTML =
			"<tr id='dataView'><td></td><td class='text-right'>Average:</td><td>" +
			averageCarbIntake +
			"</td><td>" +
			averageUnits +
			"</td><td>" +
			averageCorrections +
			"</td><td></td><td></td></tr>";

		
		// ===== Modal =====

		// Get the button that opens the modal
		var logBtn = document.getElementById("addLog");
		var noteBtns = document.getElementsByClassName("note");

		// Get the <span> element that closes the modal
		var logSpan = document.getElementsByClassName("close")[0];

		// When the user clicks on the button, open the modal
		logBtn.onclick = () => {
			modal.style.display = "block";
			logEditContent.classList.remove("hide");
		};

		// When the user clicks on <span> (x), close the modal
		logSpan.onclick = () => {
			modal.style.display = "none";

			logEditContent.classList.add("hide");
			viewNote.classList.add("hide");
			removeModal.classList.add("hide");
		};

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = event => {
			if (event.target == modal) {
				modal.style.display = "none";

				logEditContent.classList.add("hide");
				viewNote.classList.add("hide");
				removeModal.classList.add("hide");
			}
		};

		// ===== End Modal =====


		// Add the newly created rows to an array
		var rows = document
			.getElementById("tbody")
			.getElementsByTagName("tr");

		// Set the class(es) of each row
		for (var i = 0; i < rows.length; i++) {
			rows[i].classList.add("item");
			if (i % 2 == 1) {
				rows[i].classList.add("item-dark");
			}
			if (i == rows.length - 1) {
				rows[i].classList.add("item-dark");
			}
		}
		resetVariables();
	});

	// ===== End Database Snapshot =====
})();

// ===== Log Management Functions =====

// Creates the table of log entries
function displayLogs(snapshot, i) {
	var logSnapshotVal = snapshot.val()[nodeNames[i]];
	var logSnapshotKey = nodeNames[i];

	createTable(logSnapshotVal, logSnapshotKey);

	carbIntakes.push(parseInt(logSnapshotVal.carbIntake, 10));
	units.push(parseInt(logSnapshotVal.units, 10));
	corrections.push(parseInt(logSnapshotVal.correction, 10));

	tableIndex++;
}

// Creates the table for log data
function createTable(logSnapshotVal, logSnapshotKey) {

	// Create a new row for the given table index
	var tr = tbody.insertRow(tableIndex);

	tr.id = logSnapshotKey;

	// Loops through and creates each cell in the row
	for (var j = 0; j < numberOfHeaders; j++) {
		var cell = tr.insertCell(j);

		// Global Placement of Log Data in Table
		if (j == 0) {
			// Handles date creation

			cell.innerHTML = "<td>" + logSnapshotVal.date; + "</td>";
		} else if (j == 1) {
			// Handles time creation

			cell.innerHTML = "<td>" + logSnapshotVal.time; +
			"</td>";
		} else if (j == 2) {
			// Handles carb intake Creation

			cell.innerHTML = "<td>" + logSnapshotVal.carbIntake; +
			"</td>";
		} else if (j == 3) {
			// Handles unit creation

			cell.innerHTML = "<td>" + logSnapshotVal.units; +
			"</td>";
		} else if (j == 4) {
			// Handles correction creation

			cell.innerHTML = "<td>" + logSnapshotVal.correction; +
			"</td>";
		} else if (j == 5) {
			// Handles note creation

			cell.innerHTML =
				"<td>" +
				"<a onclick='' id='note-" +
				tableIndex +
				"' class='note'>Note</a>" +
				"</td>";

			var noteID = document.getElementById("note-" + tableIndex);

			noteID.onclick = () => {
				if (
					logSnapshotVal.note == "" ||
					logSnapshotVal.note == undefined
				) {
					noteModal.innerHTML =
						"<br><h3>Notes:</h3><p>No recorded notes.</p>";
				} else {
					noteModal.innerHTML =
						"<br><h3>Notes:</h3><p>" +
						logSnapshotVal.note +
						"</p>";
				}

				modal.style.display = "block";

				noteModal.classList.remove("hide");
			};
		} else if (j == numberOfHeaders - 1) {
			// Handles removal creation
			cell.innerHTML =
				"<span class='removePair' onclick='verifyRemove(this)'>&times;</span>";
		}
	}
}

// Removes a row of data
function verifyRemove(span) {

	modal.style.display = "block";
	removeModal.classList.remove("hide");

	var carryData = document.getElementsByClassName("carry")[0];

	carryData.id = span.parentNode.parentNode.id + "_";

}

// Removes a row of data
function removeLog() {

	var span = document.getElementsByClassName("carry")[0].id;

	var realID = "";

	for (var i = 0; i < span.length - 1; i++) {
		realID += span[i];
	}

	var removeRow = document.getElementById(realID);

	var removeRef = database.ref("/logs/" + removeRow.id);

	removeRow.parentNode.removeChild(removeRow);

	removeRef.remove();

	modal.style.display = "none";

	logEditContent.classList.add("hide");
	viewNote.classList.add("hide");
	removeModal.classList.add("hide");
}

// Add new entry to database
function addEntry() {
	var date = new Date().getUTCMonth() + 1 + "/" +
		new Date().getDate() + "/" + (new Date().getFullYear() - 2000);

	var time;
	if (new Date().getMinutes() < 10) {
		time = new Date().getHours() + ":0" + new Date().getMinutes();
	} else {
		time = new Date().getHours() + ":" + new Date().getMinutes();
	}

	if (new Date().getHours() > 12) {
		if (new Date().getMinutes() < 10) {
			time = (new Date().getHours() - 12) + ":0" + new Date().getMinutes() + " PM";
		} else {
			time = (new Date().getHours() - 12) + ":" + new Date().getMinutes() + " PM";
		}
	} else {
		if (new Date().getMinutes() < 10) {
			time = new Date().getHours() + ":0" + new Date().getMinutes() + " AM";
		} else {
			time = new Date().getHours() + ":" + new Date().getMinutes() + " AM";
		}
	}

	var carbIntake = document.getElementById("carbIntake").value;

	var units = carbIntake / 12;

	if (units % 1 < 0.5) {
		units = Math.floor(units);
	} else {
		units = Math.ceil(units);
	}

	var glucose = document.getElementById("glucose").value;

	var correction = (120 - glucose) / 40; // What is the cutoff for any given glucose level?

	var totalUnits = units + correction;

	var note = document.getElementById("note").value;

	var data = {
		date: date,
		time: time,
		carbIntake: carbIntake,
		units: units,
		correction: correction,
		note: note,
		totalUnits: totalUnits,
		timestamp: firebase.database.ServerValue.TIMESTAMP
	};

	logsRef.child("-" + Math.random().toString(36).substr(2, 8)
					  + Math.random().toString(36).substr(2, 8)).set(data);

	modal.style.display = "none";

	logEditContent.classList.add("hide");
	viewNote.classList.add("hide");
	removeModal.classList.add("hide");
}

// Resets variables
function resetVariables() {
	count = 0;
	tableIndex = 0;
	carbIntakes = [];
	units = [];
	corrections = [];
	nodeNames = [];
}