var express = require('express');
var subdomain = require('subdomain')
var app = express();
var morgan = require('morgan');
var fs = require('fs');
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(subdomain({
    base: 'wvvw.me',
    removeWWW: true
}));

app.use('/subdomain/assets/', express.static(__dirname + '/public'));

app.use(morgan('combined', {
    stream: accessLogStream
}))

app.get('/', function(req, res) {
    res.render('index');
});

app.get('*', function(req, res) {
    res.render('http/404');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});