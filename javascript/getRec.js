 

$( document ).ready(function() {

  var  id = document.getElementById("gesis_id").innerHTML; 
    var site = "https://GesisHost/proxy.php?id=" + id;
	var section = document.getElementById("articles");
    $( section ).load(site);
    } );   
