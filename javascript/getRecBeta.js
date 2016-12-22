$( document ).ready(function() {

  var  id = document.getElementById("gesis_id").innerHTML; 
    var site = "https://GesisHost/proxyBeta.php?id=" + id;
	var section = document.getElementById("articles");
    $( section ).load(site);
    } ); 

function makeDliblog(aurl,isdlib)
{
    if(isdlib=='1'){
        var img = new Image();
        img.src = aurl;
    }
}
