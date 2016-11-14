
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , gesis = require('./routes/gesis')
  , gesis2 = require('./routes/gesis2')
  , gesis3 = require('./routes/gesis3')
  , http = require('http')
  , path = require('path')
   , request = require('request');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();
var parseString = require('xml2js').parseString;


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);

//route for displaying recommended articles for the first partner => partner name/articleID
//controller handler in routes/gesis
app.get('/gesis/:id', gesis.gesis); 

//route for displaying recommended articles for the second partner => partner name/articleID
//controller handler in routes/gesis2
app.get('/gesis2/:id', gesis2.gesis2); 

//route for displaying recommended articles for the second partner => partner name/articleID
//controller handler in routes/gesis2
app.get('/gesis3/:id', gesis3.gesis3);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  
});
