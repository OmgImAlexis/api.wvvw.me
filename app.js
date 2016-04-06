const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('cz');

config.defaults({
    "db":{
        "host": "mongodb",
        "port": 27017,
        "collection": "wvvw_me"
    },
    "session": {
        "secret": "adsknasljdnlj3nj4n23jnql"
    },
    "web": {
        "port": 3000
    },
    "anon": {
        "userId": "559804077d6a168bad287d9b",
        "default": false
    },
    "permalink": {
        "format": "/post/%slug%/"
    }
});

config.load(path.normalize(__dirname + '/config.json'));
config.args();
config.store('disk');

mongoose.connect('mongodb://' + config.joinGets(['db:host', 'db:port', 'db:collection'], [':', '/']));

var app = express();

app.disable('x-powered-by');

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.use(compression());
app.use(express.static(__dirname + '/public', { maxAge: 86400000 }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
    secret: config.get('session:secret'),
    name: 'session',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

app.use('/api/', require('./app/routes/api'));

require('./app/config/passport.js')(app, passport);

app.use('/', require('./app/routes/auth'));
app.use('/', require('./app/routes/web'));
app.use('/admin', require('./app/routes/admin'));

// Handle 404
app.use(function(req, res) {
    res.status(404);
    res.render('http/404', {
        title: '404: File Not Found'
    });
});

// Handle 500
app.use(function(error, req, res) {
    res.status(500);
    res.render('http/500', {
        title: '500: Internal Server Error',
        error: error
    });
});

app.listen(config.get('web:port'), function() {
    console.log('The server is running on port %s', config.get('web:port'));
});
