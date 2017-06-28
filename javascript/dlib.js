$( window ).ready(function () {
   get_rec();
}); 

function get_rec(){
	 var img = document.createElement("img");
    	img.src = "../../../interface/themes/default_gesis/images/icons/loading.gif";
   	 var loading = document.getElementById("list");
  	loading.appendChild(img);
 	var id = document.getElementById("gesis_id").innerHTML;
	var  doc_title = document.getElementById("doc_title_full").innerHTML;
	var encodedtitle = encodeURI(doc_title);
	var title = encodedtitle.replace(/'/g, "`");
    	var site = "/Dlib/Proxy?id=" + id +"&title=" + title;
    	var section = document.getElementById("list");
    //$(section).load(site);
	$.ajax({
		  type: "GET",
		  url: site,
		  async: true,
		  timeout: 3000, // sets timeout to 3 seconds;
		  }).success(function(data) {
			$( section).html( data);
			 $('.abstract-tooltip').tooltip({html: true, placement: "right"}); 
			 $('.referesh').click( function(e) {
                                e.preventDefault(); 
                                var loading = document.getElementById("list");
                                loading.innerHTML= "";
                                get_rec(); return false; } );
		})

}
