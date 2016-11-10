
	var request = require('request');
	var xml2js = require('xml2js');

	var parser = new xml2js.Parser();
	var parseString = require('xml2js').parseString;

	var xml;
	
		
	// handling gesis2 route
	// header response is set to Access-Control-Allow-Origin to allow cross domain access
	//getting the article_id from the request parameter (req)
	//requesting mr-dlib GET API for getting recommended article for article_id
	// rendering the recommended articles is views/gesis2
	// response is list of articles in XML
exports.gesis2= function(req, response){
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	response.setHeader('Access-Control-Allow-Credentials', true);
	var article_id = req.params.id;
	console.dir(req.params.id);
    request({
        method: "GET",
        url: "https://api-dev.mr-dlib.org/v1/documents/" + article_id + "/related_documents",
        
            }, function (err,res,body){
            	parser.parseString(body, function (err, result) {
            		 xml = result['mr-dlib'].related_articles[0].related_article;
            		 console.log(xml.length);
            	});
            	response.render('gesis2',{ xml : xml });  
        });  
   
};