// called on loading the web page
$(window).ready(function() {
  get_rec();
});

/**
 * Retrieves a specific cookie by a given name.
 *
 * @parame name name of the cookie to retrieve
 * @return retrieved cookie
 */
function getCookie(name) {
  // credits to: https://stackoverflow.com/questions/10730362/get-cookie-by-name
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) {
    return  parts.pop().split("expires")[0];
  }
}

/**
 * Checks wether the MDL cookies (= Advanced Recommendations) are enabled.
 *
 * @return 'true' if MDL cookies are set, 'false' otherwise
 */
function areCookiesEnabled() {
  if (document.cookie.indexOf("mrdlib_id=") >= 0) {
    return true;
  }

  return false;
}

/**
 * Returns the current timestamp as a decimal number.
 *
 * @return timestamp of current time as decimal number
 */
function getTimestamp() {
  var date = new Date();
  return date.getTime();
}

/**
 * Adds a cookie with the given text. The lifetime of the cookie is set to ten years.
 *
 * @param cookieText text of the cookie to set 
 */
function setCookie(cookieText) {
  var date = new Date();
  // ten years
  date.setTime(date.getTime() + (10*365*24*60*60*1000));
  var expires = "expires=" + date.toUTCString();
  document.cookie = cookieText + expires;
}

/**
 * Removes all MDL cookies.
 */
function removeAllCookies() {
  // credits to https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
  var cookies = document.cookie.split(";");

  for (var i=0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

/**
 * Checks if the relevant checkbox for setting cookies is set, sets cookies accordingly. Removes cookies otherwise.
 */
function updateCookieSetting() {
  var setting = document.forms["mrdlib_advanced_recommendations_form"]["mrdlib_advanced_recommendations"].checked;

  if (setting == true) {
    // cookies have been enabled
    // set current time as cookie
    setCookie("mrdlib_id=" + getTimestamp());
  } else {
    // cookies have been disabled
    removeAllCookies();
  }

  // refresh page
  location.reload();
}

/**
 * Logs a given event by adding a cookie with a timestamp and event description.
 */
function logEvent(event) {
  setCookie(Date() + "=" + event);
}

// global variables used for tracking hovering over info icons
window.hoverId = hoverId = -1;
window.hoverStart = '';

/**
 * Logs the start of hovering over an info icon with the given id.
 * The global variables for logging this are used.
 */
function logHoverStart(id) {
  window.hoverId = id;
  window.hoverStart = getTimestamp();
}

/**
 * Logs the end of hovering over an info icon with the given id.
 * The global variables for logging this are used.
 *
 * Hovering for more than three seconds over an info icon is logged.
 */
function logHoverEnd(id) {
  var hoverEnd = getTimestamp();

  if (id.localeCompare(window.hoverId) == 0) {
    if (window.hoverStart != -1) {
      // log hovering for longer than three seconds over an info icon
      if ((hoverEnd-window.hoverStart) >= 3000) {
        logEvent('hover-' + id);
      }
    }
  }

  // reset gloabl variables
  var hoverId = -1;
  var hoverStart = -1;
}

function displaySettingsDialog() {
  var modal = document.getElementById('mrdlib_modal');
  modal.style.display = "block";
}

function closeSettingsDialog() {
  var modal = document.getElementById('mrdlib_modal');
  modal.style.display = "none";
}

function callClickUrlThroughProxy(clickUrl) {
  var site = "proxy_mediatum_click_forward.php?click_url=" + clickUrl;

  $.ajax({
    type: "GET",
    url: site,
    async: true,
    timeout: 3000,  // sets timeout to 3 seconds;
    success: function(data) {
      // do nothing
    }
  });
}

/**
 * Retrieves recommendations from MDL's proxy server and displays them in the HTML/JavaScript widget.
 */
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
  var site = "proxy_mediatum_recommendation_retrieval.php?id=mediatum-" + id_original + "&title=" + title;
  // check if user has enabled adavanced recommendations, and thus has a cookies identifying him,
  // in that case pass the user id to the proxy server
  if (areCookiesEnabled()) {
    site = site + "&user=" + getCookie("mrdlib_id");
  }

  // retrieve recommendation
  $.ajax({
    type: "GET",
    url: site,
    async: true,
    timeout: 3000,  // sets timeout to 3 seconds;
    success: function(data) {
      // insert recommendation into div with id "mrdlib_loading"
      var loading = document.getElementById("mrdlib_container");
      loading.innerHTML= data;
      
      // if advanced recommendations are already enabled, set check box
      if (areCookiesEnabled()) {
        document.forms["mrdlib_advanced_recommendations_form"]["mrdlib_advanced_recommendations"].checked = true;
      }
    }
  });
}
