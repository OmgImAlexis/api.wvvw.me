var express = require('express'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose'),
    fs = require('fs'),
    passport = require('./config/passport.js');

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

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
    secret: 'keyboard cat',
    name: 'session',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use('/unloq_cSNJlqmaPjljiZWL.html', function(res, res){
    res.send('unloq_cSNJlqmaPjljiZWL');
});

app.use('/', require('./app/routes/auth.js'));
app.use('/', require('./app/routes/web.js'));
app.use('/admin', require('./app/routes/admin.js'));

app.get('*', function(req, res) {
    res.render('http/404');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
