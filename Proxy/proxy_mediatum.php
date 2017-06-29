<!--
This proxy is located between the JavaScript widget inserted into a content partner's website and
Mr. DLib's API.

Its purpose is to route the JavaScript widget's request to the correct API calls.

The proxy has to be addressed using this format:
[host]/proxy?id=[MDL's id_original of the publication]&title=[publication's title]
-->

<?php
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
      exit('Error: No parameter ' + $parameterName + ' found in URL.');
    }

    return $parameter;
  }

  // prevent CORS conflicts
  header('Access-Control-Allow-Origin: *');

  // retrieve configuration of proxy
  $config = json_decode(file_get_contents('config.json'));
  $mr_dlib_api_version = $config->mrdlib;
  $partner_environment = $config->partner;
  // map configuration of API to API address
  switch ($mr_dlib_api_version) {
    case 'beta':
      $api = 'api-beta';
      break;
    case 'dev':
      $api = 'api-dev';
      break;
    case 'prod':
      $api = 'api';
      break;
    default:
      exit('Error: API version could not be correctly read from config file.');
  }

  // retrieve parameters handed to proxy
  $id = getUrlParameter('id');
  $title = getUrlParameter('title');



  /* --- (2) RETRIEVE RECOMMENDATIONS FROM MDL's API ---
   * First, recommendations for the document with the given ID are requested. If this fails, as a
   * fallback, recommendations for the given title are requested. This second approach always works.
   * Thus the retrieval of the recommendations always works.
   */

  /**
   * Retrieves the XML that is available under a given URL.
   * 
   * @param string    $url    URL under which the XML to retrieve is available
   *
   * @return string   XML
   */
  function retrieveXmlFromUrl($url) {
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

    return simplexml_load_string($response);
  }

  /**
   * Checks if the given XML is valid and thus can be used for generating the HTML snippet
   * showing recommendations.
   * 
   * @param string    $xml    XML to check
   *
   * @return boolean  true if valid, false otherwise
   */
  function isXmlValid($xml) {
    if ($xml === false OR count($xml->related_articles->related_article) === 0) {
      return false;
    }

    // else
    return true;
  }

  // construct URL to retrieve recommendations using given id
  $retrieval_url_using_id = "https://".$api.".mr-dlib.org/v1/documents/".$id."/related_documents";
	$xml = retrieveXmlFromUrl($retrieval_url_using_id);

  // check if recommendations are retrieved using the given ID, if that fails, retrieve
  // recommendations using the given title
  if (!isXmlValid($xml)) {
    $retrieval_url_using_title = "https://".$api.".mr-dlib.org/v1/documents/".$title."/related_documents";
    $xml = retrieveXmlFromUrl($retrieval_url_using_title);

    if (!isXmlValid($xml)) {
      exit('Error: No recommendations could be retrieved.');
    }
  }

  // extract recommendations and number of recommendations from XML
  $recommendations = $xml->related_articles->related_article;
  $numRecommendations = count($recommendations);

  console.log($recommendations);



  /* --- (3) GENERATE HTML SNIPPET FOR RECOMMENDATIONS ---
   * Iterate over recommendations and embed the relevant data.
  */
?>
<!DOCTYPE html>
<html>
  <body>
    <ul>
<?php
  // iterate over recommendations
  for($i = 0; $i < $numRecommendations; $i++) {
?>
      <li><?=$recommendations[$i]->title?></li> 
<?php
  }
?>
    </ul>
  </body>
</html>
