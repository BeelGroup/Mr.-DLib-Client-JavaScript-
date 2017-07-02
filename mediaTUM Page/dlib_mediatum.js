$(window).ready(function() {
  get_rec();
});

function get_rec() {
  var id_original = document.getElementById("mrdlib_id").innerHTML;
  var title = document.getElementById("mrdlib_title").innerHTML;
  // work over title
  var title = encodeURI(title).replace(/'/g, "`");
  // construct URL
  var site = "http://mediatum.js-client.mr-dlib.org/proxy_mediatum.php?id=mediatum-" + id_original +"&title=" + title;

  // retrieve recommendation
  $.ajax({
    type: "GET",
	url: site,
	async: true,
	timeout: 3000,	// sets timeout to 3 seconds;
	success: function(data) {
	  // insert recommendation into div with id "mrdlib_loading"
	  var loading = document.getElementById("mrdlib_container");
      loading.innerHTML= data;
	}
  });
}
