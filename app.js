var express = require('express');
var subdomain = require('subdomain')
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(subdomain({
    base: 'wvvw.me',
    removeWWW: true
}));

app.use('/subdomain/assets/', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('*', function(req, res) {
    res.render('http/404');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});