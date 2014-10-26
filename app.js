var express = require('express');

var app = express();
var http = require('http');
app.set('views', './views');
app.set('view engine', 'jade');

// Middleware
var bodyParser = require('body-parser');
app.use(bodyParser());

// DB
var Firebase = require('firebase');

// Request library
var request = require('request');

// keys
var coreId = process.env.CORE_ID;
var accessToken = process.env.ACCESS_TOKEN;
var sparkCoreURL = "https://api.spark.io/v1/devices/";
var fbURL = process.env.FIRE_URL;
var fbSecret = process.env.FIRE_SECRET;

var FirebaseTokenGenerator = require("firebase-token-generator");
var tokenGenerator = new FirebaseTokenGenerator(fbSecret);

app.route('/')
.get(function (req, res, next){
  console.log('Rendered color form');
  return res.render('index', { title: 'Orb Orb Orb', message: 'Hello there!'});
})
.post(function (req, res, next){
  var r = String( "000" + req.param('rVal')).slice(-3);
  var g = String( "000" + req.param('gVal')).slice(-3);
  var b = String( "000" + req.param('bVal')).slice(-3);
  var rgbStr = r + g + b;
  console.log('Sending color ', rgbStr);
  request.post(sparkCoreURL + coreId + "/color").form({access_token:accessToken, params: rgbStr});
  return res.render('index', { title: 'Boom!', message: 'Color '+ r + ':' + g + ':' + b + ' sent!'});
});

// Used for the prototype POE Orb
app.route('/color').get(function (req, res, next){
  // simply rotate the color for each request
  var colorDb = new Firebase(fbURL+'/color');
  var token = tokenGenerator.createToken({uid: "1", some: "arbitrary", data: "here"});
  colorDb.authWithCustomToken(token, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Login Succeeded!", authData);
      colorDb.once('value', function(data){
        colorObj = data.val();
        console.log('Request for color. Returned:', colorObj);
        // Randomly generate a new color for each request
        var rVal = Math.floor((Math.random() * 254) + 1);
        var gVal = Math.floor((Math.random() * 254) + 1);
        var bVal = Math.floor((Math.random() * 254) + 1);
        colorObj = {r: rVal, g: gVal, b: bVal, updated_at: (new Date()).getTime()};
        colorDb.set(colorObj);
        console.log('Set new color. Updated:', colorObj);
        return res.type('json').json(colorObj);
      }); 
    }
  }); 

});

http.createServer(app).listen(process.env.PORT || 3000);
