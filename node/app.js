/**
 * Module dependencies.
 */
var express = require('express')
    , cons = require('consolidate')
    , http = require('http')
    , io = require("socket.io")
    , path = require('path')
    , _ = require("underscore")
    , _str = require("underscore.string")
    , config = require("./config").config
    , Wind = require("wind");

var Async = Wind.Async
    , Task = Async.Task
    , Binding = Async.Binding;

_.mixin(_str.exports());
Wind.logger.level = Wind.Logging.Level.WARN;
_.extend(global, {
    _: _,
    Wind: Wind,
    Async: Wind.Async,
    Task: Wind.Async.Task,
    Binding: Wind.Async.Binding
});

var routes = require("./routes/routes");
var app = express();

// all environments
app.engine("tpl", cons.handlebars);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'tpl');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

// development only
if (!app.get('env') || 'development' == app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
server.setMaxListeners(0);

app.options('/register', function (req, res) {
    console.log("register: ", req.body.objectData);
    res.header("Access-Control-Allow-Origin", "*");
    res.json({succ: "OK"}, 200);
});
