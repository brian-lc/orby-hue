var express = require('express');

var app = express();
var http = require('http');

app.route('/color')
.get(function(req, res, next){
  res.send('red');
})

http.createServer(app).listen(process.env.PORT || 3000);
