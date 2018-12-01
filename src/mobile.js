function openNav() {
	document.getElementById("mySidenav").style.width = "70%";
	document.getElementById("main").style.marginLeft = "70%";
	document.getElementById("closeNav").style.visibility = "visible";
	document.getElementById("zoom-to-area").style.visibility = "visible";
}

function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
	document.getElementById("main").style.marginLeft= "0";
}

openNav();