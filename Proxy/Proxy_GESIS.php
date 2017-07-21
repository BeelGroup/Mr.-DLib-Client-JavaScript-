<?php
require_once 'Action.php';
error_reporting(E_ALL);
ini_set('error_reporting', E_ALL);

class Proxy extends Action {

    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        $verb = $_SERVER['REQUEST_METHOD'];

        if ($verb == 'GET' and isset($_GET['id'])) {
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://api.mr-dlib.org/v1/documents/" . $_GET["id"] . "/related_documents",
                //CURLOPT_URL => "https://api-beta.mr-dlib.org/v1/documents/" . $_GET["id"] . "/related_documents",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "GET",
                CURLOPT_HTTPHEADER => array(
                    "cache-control: no-cache"
                ),
                CURLOPT_SSL_VERIFYPEER => false,
            ));

            $response = curl_exec($curl);
            $err = curl_error($curl);

            curl_close($curl);
            $xml = simplexml_load_string($response);
            if ($xml === false OR count($xml->related_articles->related_article) === 0) AND isset($_GET['title'])) {
                $curl = curl_init();
                curl_setopt_array($curl, array(
		  CURLOPT_URL => "https://api.mr-dlib.org/v1/documents/".rawurlencode($_GET["title"])."/related_documents",
          //CURLOPT_URL => "https://api-beta.mr-dlib.org/v1/documents/".rawurlencode($_GET["title"])."/related_documents",          
		  CURLOPT_RETURNTRANSFER => true,
		  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		  CURLOPT_CUSTOMREQUEST => "GET",
		  CURLOPT_HTTPHEADER => array(
			"cache-control: no-cache"
		  ),

		  CURLOPT_SSL_VERIFYPEER => false,
		));

		$response = curl_exec($curl);
		$err = curl_error($curl);
		$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);

		curl_close($curl);
		$xml = simplexml_load_string($response);
			
		}
		if ($xml === false OR count($xml->related_articles->related_article) === 0)
		{echo "Recommendations are currently not available";
		echo rawurlencode($_GET["title"]);
            } else {

                $rec = $xml->related_articles->related_article;
                $reclength = count($rec);
                ?>	
                <!DOCTYPE html>
                <html>
                    <body>
                        <fieldset>
                            <div class="sidegroup">		
                                <ul class= "similar">
                                    <?php for ($x = 0; $x < $reclength; $x++) { ?>
                                        <li>
                                            <?php
                                            // $anames = (string) $rec[$x]->authors;
                                            $anames = (string) $rec[$x]->authors;
                                            $author_split = explode(",", $anames);

                                            if (sizeof($author_split) > 1) {
                                                ?><div class='mdl-authors'><span style="font-size: 80%"><?= $author_split[0] . ", et.al." ?> </span></div> <?php
                                            } else {
                                                ?><div class='mdl-authors'><span style="font-size: 80%"><?= $rec[$x]->authors ?></span></div> <?php
                                            }
                                            ?>


                                            <div class='article_link'>
                                                <a class= 'mdl-title' href='<?= str_replace("sowiport.gesis.org", $_SERVER['SERVER_NAME'], $rec[$x]->fallback_url); ?>' target='_blank' onclick="makelog('http://<? echo $_SERVER[ 'SERVER_NAME' ]; ?>/Session/Analysis?do=log&array[]=<? echo session_id(); ?>&array[]=<? echo $_SERVER[ 'HTTP_USER_AGENT' ]; ?>&array[]=<? echo $_SERVER[ 'REMOTE_ADDR']; ?>&array[]=<? echo str_replace(array("http://sowiportdev.gesis.intra", "http://sowiportbeta.gesis.org", "http://sowiport.gesis.org"),'',$rec[$x]->fallback_url); ?>&array[]=/search/id/<? echo $_GET['id']; ?>&array[]=goto_similar_dlib&array[]=goto&array[]=-1&array[]=<? $dlibk=explode("access_key=",$rec[$x]->click_url); $dlibkt=explode("&",$dlibk[1]); echo $dlibkt[0]; ?>');makeDliblog('http://<? echo $_SERVER[ 'SERVER_NAME' ]; ?>/Dlib/Proxy?url=<?= $rec[$x]->click_url ?>','1');"><?= $rec[$x]->title ?></a>	<?php if ($rec[$x]->year > 0) { ?>
                                                    <span class='mdl-year'>(<?= $year = $rec[$x]->year ?>)</span>
                                                <?php } ?>
                                            </div>
                                            <?php if ($rec[$x]->published_in != '') { ?>
                                                <span class='mdl-journal'><span style="font-size: 80%">In: <?= $rec[$x]->published_in ?>. </span></span>

                                            <?php } ?>
                                        </li>
                                        <hr>

                                    <?php } ?>


                                </ul>
                            </div>
                        </fieldset>

                    </body>
                </html>
            <?php } ?>

            <?php
            
        } else if (isset($_GET['url']) or isset($_POST['url'])) {

            $enable_jsonp = false;
            $enable_native = true;
            $mode = 'native';
            $valid_url_regex = '/.*/';
// ############################################################################
            $url = $_GET['url'];
            if (!$url) {

                // Passed url not specified.
                $contents = 'ERROR: url not specified';
                $status = array('http_code' => 'ERROR');
            } else if (!preg_match($valid_url_regex, $url)) {

                // Passed url doesn't match $valid_url_regex.
                $contents = 'ERROR: invalid url';
                $status = array('http_code' => 'ERROR');
            } else {
                $ch = curl_init($url);

                if (strtolower($_SERVER['REQUEST_METHOD']) == 'post') {
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $_POST);
                }

                if ($_GET['send_cookies']) {
                    $cookie = array();
                    foreach ($_COOKIE as $key => $value) {
                        $cookie[] = $key . '=' . $value;
                    }
                    if ($_GET['send_session']) {
                        $cookie[] = SID;
                    }
                    $cookie = implode('; ', $cookie);

                    curl_setopt($ch, CURLOPT_COOKIE, $cookie);
                }

                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                curl_setopt($ch, CURLOPT_HEADER, true);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                curl_setopt($ch, CURLOPT_USERAGENT, $_GET['user_agent'] ? $_GET['user_agent'] : $_SERVER['HTTP_USER_AGENT'] );

                list( $header, $contents ) = preg_split('/([\r\n][\r\n])\\1/', curl_exec($ch), 2);

                $status = curl_getinfo($ch);

                curl_close($ch);
            }
// Split header text into an array.
            $header_text = preg_split('/[\r\n]+/', $header);
            if ($mode == 'native') {
                if (!$enable_native) {
                    $contents = 'ERROR: invalid mode';
                    $status = array('http_code' => 'ERROR');
                }

                // Propagate headers to response.
                foreach ($header_text as $header) {
                    if (preg_match('/^(?:Content-Type|Content-Language|Set-Cookie):/i', $header)) {
                        header($header);
                    }
                }

                print $contents;
            } else {

                // $data will be serialized into JSON data.
                $data = array();

                // Propagate all HTTP headers into the JSON data object.
                if ($_GET['full_headers']) {
                    $data['headers'] = array();

                    foreach ($header_text as $header) {
                        preg_match('/^(.+?):\s+(.*)$/', $header, $matches);
                        if ($matches) {
                            $data['headers'][$matches[1]] = $matches[2];
                        }
                    }
                }

                // Propagate all cURL request / response info to the JSON data object.
                if ($_GET['full_status']) {
                    $data['status'] = $status;
                } else {
                    $data['status'] = array();
                    $data['status']['http_code'] = $status['http_code'];
                }

                // Set the JSON data object contents, decoding it from JSON if possible.
                $decoded_json = json_decode($contents);
                $data['contents'] = $decoded_json ? $decoded_json : $contents;

                // Generate appropriate content-type header.
                $is_xhr = strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
                header('Content-type: application/' . ( $is_xhr ? 'json' : 'x-javascript' ));

                // Get JSONP callback.
                $jsonp_callback = $enable_jsonp && isset($_GET['callback']) ? $_GET['callback'] : null;

                // Generate JSON/JSONP string
                $json = json_encode($data);

                print $jsonp_callback ? "$jsonp_callback($json)" : $json;
            }
        }
    }

}
?>
