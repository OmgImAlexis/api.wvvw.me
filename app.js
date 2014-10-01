var express = require('express');
var subdomain = require('subdomain')
var app = express();
var morgan = require('morgan');
var fs = require('fs');
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
});

app.use(morgan('combined', {
    stream: accessLogStream
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(subdomain({
    base: 'wvvw.me',
    removeWWW: true
}));

app.use('/subdomain/assets/', express.static(__dirname + '/public'));

app.get('/subdomain/github', function(req, res) {
    res.redirect('http://github.com/omgimalexis');
});

app.get('/subdomain/twitter', function(req, res) {
    res.redirect('http://twitter.com/omgimalexis');
});

app.get('/subdomain/tumblr', function(req, res) {
    res.redirect('http://reblogalert.tumblr.com');
});

app.get('/subdomain/_', function(req, res) {
    res.render('_');
});


app.get('/subdomain/home', function(req, res) {
    res.render('http://27.33.120.16:3000');
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('*', function(req, res) {
    res.render('http/404');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
