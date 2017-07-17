$( window ).ready(function () {
    var img = document.createElement("img");
    img.src = "../../../interface/themes/default_gesis/images/icons/loading.gif";
    var loading = document.getElementById("loading");
    loading.appendChild(img);
    var id = document.getElementById("gesis_id").innerHTML;
    var site = "/Dlib/Proxy?id=" + id +"&title=" + title; 
    var section = document.getElementById("articles");
    //$(section).load(site);
	$.ajax({
		  type: "GET",
		  url: site,
		  async: true,
		  timeout: 3000, // sets timeout to 3 seconds;
		  }).success(function(data) {
			$( section).html( data);
	})
}); 
