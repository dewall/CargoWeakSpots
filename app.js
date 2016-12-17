var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');

var app = express();

app.set('port', (process.env.PORT || 3000));
app.set('views', '/');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/')));


app.get('/', function(request, response) {
    response.sendFile('/index.html', { root: __dirname + '/' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found ' + req.url);
    err.status = 404;
    next(err);
});


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
