 

$( document ).ready(function() {
var img = document.createElement("img");
img.src = "img/loading.gif";
var loading =document.getElementById("loading");
var br = document.createElement("br");
loading.appendChild(br);
loading.appendChild(img);

var  id = document.getElementById("gesis_id").innerHTML; 
var site = "http://sowiportbeta.gesis.org/Dlib/Proxy.php?id=" + id;
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
