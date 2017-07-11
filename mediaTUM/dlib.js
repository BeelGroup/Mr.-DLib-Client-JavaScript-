$(window).ready(function() {
  get_rec();

  // for debugging purposes: print out cookies

  // credits to https://stackoverflow.com/questions/3400759/how-can-i-list-all-cookies-for-the-current-page-with-javascript
  var cookies = document.cookie.split(';');
  var cookiesReadable = '';
  for (var i = 1; i <= cookies.length; i++) {
      cookiesReadable += i + ' ' + cookies[i-1] + "\n";
  }

  if (cookiesReadable != '1 \n') {
    alert(cookiesReadable);
  }
  
});

// credits to: https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) {
    return parts.pop().split(";").shift();
  }
}

function get_rec() {
  // create loading animation
  var img = document.createElement("img");
  img.src = "http://mediatum.js-client.mr-dlib.org/loading.gif";
  var loading = document.getElementById("mrdlib_container");
  loading.appendChild(img);

  // retrieve parameters from HTML page of content partner
  var id_original = document.getElementById("mrdlib_id").innerHTML;
  var title = document.getElementById("mrdlib_title").innerHTML;
  // work over title
  var title = encodeURI(title).replace(/'/g, "`");
  // construct URL
  var site = "proxy_mediatum.php?id=mediatum-" + id_original + "&title=" + title;
  // check if user has enabled adavanced recommendations, and thus has a cookies identifying him,
  // in that case pass the user id to the proxy server
  if (document.cookie.indexOf("mrdlib_id=") >= 0) {
    site = site + "&user=" + getCookie("mrdlib_id");
  }

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
      // if advanced recommendations are already enabled, set check box
      if (document.cookie.indexOf("mrdlib_id=") >= 0) {
        document.forms["mrdlib_advanced_recommendations_form"]["mrdlib_advanced_recommendations"].checked = true;
      }
	  }
  });
}

function getTimeStamp() {
  var date = new Date();
  return date.getTime();
}

function update_cookie_setting() {
  var setting = document.forms["mrdlib_advanced_recommendations_form"]["mrdlib_advanced_recommendations"].checked;

  if (setting == true) {
    // cookies have been enabled
    // set current time as cookie
    document.cookie = "mrdlib_id=" + getTimeStamp();
  } else {
    // cookies have been disabled
    document.cookie = "mrdlib_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}

function log_click(event, time) {
  document.cookie = "mrdlib_event=" + Date() + ":" + event;
}
