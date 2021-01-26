//retrieve input value from main.html

var motor_status = document.getElementById("motor_status");
var lat_text = document.getElementById("lat_text");
var lng_text = document.getElementById("lng_text");
var vibration = document.getElementById("vibration");
var service_mileage = document.getElementById("service_mileage");
var mileage_next_service = document.getElementById("mileage_next_service");
var current_mileage = document.getElementById("current_mileage");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
	  alert("Unauthorized attempt! Log in to view this page.");
    window.location.href = "index.html";
  }
});

var lat = firebase.database().ref().child("latitude");			//referring to firebase database child node(latitude)
lat.on("value", function(datasnapshot){

	latitude = datasnapshot.val();	//get node value
	lat_text.innerHTML = latitude;

})

var lng = firebase.database().ref().child("longitude");		//referring to firebase database child node(longitude)
lng.on("value", function(datasnapshot){

	longitude = datasnapshot.val();		//get node value
	lng_text.innerHTML = longitude;

})

var motor = firebase.database().ref().child("motor_value");		//referring to firebase database child node(motor_value)
motor.on("value", function(datasnapshot){

	motor_value = datasnapshot.val();	//get node value
	if(motor_value == 0){
		motor_status.innerText = "Motor is Not Running";
		motor_status.style.color = "#ff0000";
	}

	else if(motor_value == 1){
		motor_status.innerText = "Motor is Running";
		motor_status.style.color = "RGB(0,128,0)";
	}

})

var vb = firebase.database().ref().child("vibration_sensor");	//referring to firebase database child node(vibration_sensor)
vb.on("value", function(datasnapshot){

	vb_value = datasnapshot.val();	//get node value
	if(vb_value == 0){
		vibration.innerText = "No Vibration is Detected";
		vibration.style.color = "RGB(0,128,0)";
	}

	else if(vb_value == 1){
		vibration.innerText = "Vibration is Detected";
		vibration.style.color = "#ff0000";

		//telegram

		var chat_id= 519524257;
		var bot_token = "1572151790:AAFY14N8bpeFRRfWT2B_dKOBmZkp2XaqQYM";
		var tele_text = "VIBRATION HAS BEEN DETECTED ON YOUR MOTORCYCLE!";

		var url="https://api.telegram.org/bot" + bot_token + "/sendMessage?chat_id=" + chat_id + "&text=" + tele_text;

		let api = new XMLHttpRequest();
		api.open("GET", url, true);
		api.send();

		//telegram
	}

})

var service_mileage_fb = firebase.database().ref().child("service_mileage");	//referring to firebase database child node(service_mileage)
service_mileage_fb.on("value", function(datasnapshot){

	service_mileage_var = datasnapshot.val();	//get node value
	service_mileage.innerText = service_mileage_var + " KM";

	var current_mileage_fb = firebase.database().ref().child("current_mileage");	//referring to firebase database child node(current_mileage)
		current_mileage_fb.on("value", function(datasnapshot){

		current_mileage_var = datasnapshot.val();	//get node value
		current_mileage.innerText = current_mileage_var + " KM";
		next_service = current_mileage_var + service_mileage_var;
		mileage_next_service.innerText = next_service + " KM";
		if(current_mileage_var >= next_service){
			alert("MAINTENANCE LIMIT REACHED!")
		}

	})
})


function kill_power(){
	var kill = 0;
	var firebase_kill_power = firebase.database().ref().child("motor_switch");	//referring to firebase database child node(current_mileage)

	firebase_kill_power.set(kill);	//set value to referred child node
	window.alert("Motor Power Has Been Switched Off");
}


function turn_on_sw(){
	var on = 1;
	var firebase_kill_power = firebase.database().ref().child("motor_switch");	//referring to firebase database child node(current_mileage)

	firebase_kill_power.set(on);	//set value to referred child node
	window.alert("Motor Switch Has Been Switched On");
}


function logout(){
	var c = confirm("Confirm sign out?");
	if(c == true){
	auth.signOut();	//logout (firebase authentication)
	window.location.href = "index.html";
	}
	else{
	window.location.href = "main.html"
	}
}
