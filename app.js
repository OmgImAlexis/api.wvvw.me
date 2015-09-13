var fs = require('fs');

fs.exists('./config/config.js', function(exists) {
    if (!exists) {
        console.log('Please copy "config/sampleConfig.js" to config/config.js and fill in the fields.');
        process.exit();
    } else {
        var express = require('express'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            methodOverride = require('method-override'),
            session = require('express-session'),
            MongoStore = require('connect-mongo')(session),
            logger = require('express-logger'),
            compression = require('compression'),
            mongoose = require('mongoose'),
            passport = require('passport'),
            config = require('./config/config.js'),
            User = require('./app/models/User'),
            Post = require('./app/models/Post');

        mongoose.connect(config.db.uri, function(err){
            if(err){
                console.log('Is mongodb running?');
                process.exit();
            } else {
                console.log('Connected to mongodb');
            }
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
            secret: config.db.session.secret,
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

        require('./config/passport.js')(app, passport);

        app.use('/', require('./app/routes/auth'));
        app.use('/', require('./app/routes/web'));
        app.use('/admin', require('./app/routes/admin'));

        // Handle 404
        app.use(function(req, res) {
            res.status(400);
            res.render('http/404', {
                title: '404: File Not Found'}
            );
        });

        // Handle 500
        app.use(function(error, req, res, next) {
            res.status(500);
            res.render('http/500', {
                title:'500: Internal Server Error',
                error: error
            });
        });

        app.listen(config.env.port, function() {
            console.log('The server is running on port %s', config.env.port);
        });
    }
});
