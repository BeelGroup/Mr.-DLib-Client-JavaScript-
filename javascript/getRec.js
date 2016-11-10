 

$( document ).ready(function() {

  var  id = document.getElementById("gesis_id").innerHTML; 
    var site = "https://gesis.herokuapp.com/gesis2/" + id;
	var section = document.getElementById("articles");
    $( section ).load(site);
    } );   