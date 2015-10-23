var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    compression = require('compression'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    nconf = require('nconf');

nconf.use('memory');

nconf.argv().env().file({ file: './config.json' });

mongoose.connect('mongodb://' + nconf.get('database:host') + ':' + nconf.get('database:port') + '/' + nconf.get('database:collection'), function(err){
    if(err){ console.log('Cannot connect to mongodb, please check your config.json'); process.exit(1); }
});

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
    secret: nconf.get('session:secret'),
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

app.listen(nconf.get('web:port'), function() {
    console.log('The server is running on port %s', nconf.get('web:port'));
});
