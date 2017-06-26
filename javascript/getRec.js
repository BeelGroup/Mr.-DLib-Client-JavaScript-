// JavaScript for retrieving the recommendation

$(document).ready(function() {
	// triggered on page-load

	// create loading animation
	var img = document.createElement("img");
	img.src = "img/loading.gif";
	var loading = document.getElementById("loading");
	var br = document.createElement("br");
	loading.appendChild(br);
	loading.appendChild(img);

	// retrieve parameters from HTML
	var id = document.getElementById("gesis_id").innerHTML; 
	var title = document.getElementById("gesis_title").innerHTML;
	// transform title before sending it to the proxy server
	var encodedtitle = encodeURI(title);
	var etitle = encodedtitle.replace(/'/g, "`");

	// proxy address
	var site = "http://sowiport.gesis.org/Dlib/Proxy?id=" + id +"&title=" + etitle;

	// bind the proxy's return value to the articles section
	var section = document.getElementById("articles");
    $(section).load(site);
});   

// introduce logging functionality
function makeDliblog(aurl,isdlib)
{
    if(isdlib=='1'){
        var img = new Image();
        img.src = aurl;
    }
}
