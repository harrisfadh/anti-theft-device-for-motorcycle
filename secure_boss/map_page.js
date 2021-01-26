var lat = firebase.database().ref().child("latitude"); //Latitude block
lat.on("value", function(datasnapshot){

	latitude = datasnapshot.val();

		var lng = firebase.database().ref().child("longitude"); //Longitude block
		lng.on("value", function(datasnapshot){

			longitude = datasnapshot.val();

			var map_url = "https://maps.google.com/maps?q=" + latitude + "," + longitude + "&output=embed";
			document.getElementById("gmap_canvas").setAttribute("src", map_url);

		})

})

function logout(){
	var c = confirm("Confirm sign out?");
	if(c == true){
	auth.signOut();
	window.location.href = "index.html";
	}
	else{
	window.location.href = "map_page.html"
	}
}
