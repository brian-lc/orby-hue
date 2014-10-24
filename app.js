var express = require('express');

var app = express();
var http = require('http');
app.set('views', './views')
app.set('view engine', 'jade')

// Middleware
var bodyParser = require('body-parser');
app.use(bodyParser());

// DB
var Firebase = require('firebase');

// Request library
var request = require('request');

// keys
var fbURL = process.env.FB_URL;
var coreId = process.env.CORE_ID
var accessToken = process.env.ACCESS_TOKEN
var sparkCoreURL = "https://api.spark.io/v1/devices/"

app.route('/')
.get(function (req, res, next){
  console.log('Rendered color form');
  res.render('index', { title: 'Orb Orb Orb', message: 'Hello there!'});
})
.post(function (req, res, next){
  var r = String( "000" + req.param('rVal')).slice(-3);
  var g = String( "000" + req.param('gVal')).slice(-3);
  var b = String( "000" + req.param('bVal')).slice(-3);
  var rgbStr = r + g + b;
  console.log('Sending color ', rgbStr);
  request.post(sparkCoreURL + coreId + "/color").form({access_token:accessToken, params: rgbStr});
  res.render('index', { title: 'Boom!', message: 'Color '+ r + ':' + g + ':' + b + ' sent!'});

});

http.createServer(app).listen(process.env.PORT || 3000);
