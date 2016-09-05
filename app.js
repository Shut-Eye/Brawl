var express = require('express');
var app = express();

var port = process.env.PORT || 1337;

app.use('/', express.static('bin/client'));
app.use('/', express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.listen(port, function () {
    console.log('Brawl listening on port ' + port + '!');
});