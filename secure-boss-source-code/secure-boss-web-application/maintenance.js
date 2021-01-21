//retrieve input value from maintenance.html
var current_mileage = document.getElementById("current_mileage");
var service_mileage = document.getElementById("service_mileage");

function insert_mileage(){
	var firebase_current_mileage = firebase.database().ref().child("current_mileage");	//referring to firebase database child node(current_mileage)
	
	current_mileage_int = parseInt(current_mileage.value, 10);	//get child node value and convert to INT
	firebase_current_mileage.set(current_mileage_int);	//set value to child node
	
	var firebase_service_mileage = firebase.database().ref().child("service_mileage");	//referring to firebase database child node(service_mileage)
	service_mileage_int = parseInt(service_mileage.value, 10);	//get child node value and convert to INT
	firebase_service_mileage.set(service_mileage_int);	//set value to child node
	
}

function logout(){
	var c = confirm("Confirm sign out?");
	if(c == true){
	auth.signOut();		//firebase authentication sign out
	window.location.href = "index.html";
	}
	else{
	window.location.href = "maintenance.html"	
	}
}