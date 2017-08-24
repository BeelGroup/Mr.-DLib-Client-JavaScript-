<?php
  /*
   * This proxy is located between the JavaScript widget inserted into a content partner's website and
   * Mr. DLib's API.
   * 
   * Its purpose is to forward the JavaScript widget's request to Mr. DLib's API allowing to log clicks.
   *
   * The proxy has to be addressed using this format:
   * [host]/proxy_mediatum_click_forward?click_url=[click URL to call]
   */

  // prevent CORS conflicts
  header('Access-Control-Allow-Origin: *');

  /* --- (1) LOAD CONFIGURATION --- */

  /**
   * Gets a parameter from the URL using $_GET. Checks if it is set.
   * 
   * @param string    $parameterName    name of parameter to get
   *
   * @return string   parameter
   */
  function getUrlParameter($parameterName) {
    $parameter = null;

    if (isset($_GET[$parameterName])) {
      $parameter = $_GET[$parameterName];
    } else {
      // this can be the case for optional parameters
      $parameter = null;
    }

    return $parameter;
  }

  /**
   * Retrieves the response that is available under a given URL.
   * 
   * @param string    $url    URL under which the response to retrieve is available
   *
   * @return string   response
   */
  function retrieveResponseFromUrl($url) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => $url,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "GET",
      CURLOPT_HTTPHEADER => array("cache-control: no-cache"),
      CURLOPT_SSL_VERIFYPEER => false,
    ));

    $response = curl_exec($curl);
    // detect error, print out error message, if an error occured
    if ($response === false) {
      exit('Error: curl ' + $url + ' failed: ' + curl_error($curl));
    }

    curl_close($curl);

    return $response;
  }

  // retrieve parameters handed to proxy
  $clickUrl = getUrlParameter('click_url');

  // query click URL
  $response = retrieveResponseFromUrl($clickUrl);
?>
<?=$response?>