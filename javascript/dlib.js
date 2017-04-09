$( window ).ready(function () {
   
}); 

function get_rec(){
	 var img = document.createElement("img");
    	img.src = "../../../interface/themes/default_gesis/images/icons/loading.gif";
   	var loading = document.getElementById("loading");
  	loading.appendChild(img);
 	var id = document.getElementById("gesis_id").innerHTML;
	var  doc_title = document.getElementById("doc_title_full").innerHTML;
	var encodedtitle = encodeURI(doc_title);
	var title = encodedtitle.replace(/'/g, "`");
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
			$('.mdl-title').tooltip({html: true, placement: "right"}); 
	})

}
