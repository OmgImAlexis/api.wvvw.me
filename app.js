var express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    fs = require('fs');

var app = express()

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
    flags: 'a'
});

mongoose.connect('mongodb://localhost:27017/wvvwme', function() {
    console.error('Connected to MongoDB.');
});
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

app.use(morgan('combined', {
    stream: accessLogStream
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var env = process.env.NODE_ENV || 'production';

if (!env == 'dev') {
    app.use(function(req, res, next) {
        if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
            res.redirect('https://' + req.get('Host') + req.url);
        } else {
            next();
        }
    });
}

app.use(express.static(__dirname + '/public'));

app.use('/', require('./routes/web.js'));

app.get('*', function(req, res) {
    res.render('http/404');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
