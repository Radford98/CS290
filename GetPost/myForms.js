var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({ default: 'main' });
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2568);

app.get('/', function (req, res) {
    var qParams = [];
    for (var p in req.query) {  // Pull the data from the URL query
        qParams.push({ 'name': p, 'value': req.query[p] });
    }
    var context = {};
    context.dataList = qParams;
    context.type = "GET";
    
    res.render('home', context);
    
});

app.post('/', function (req, res) {
    var qParams = [];
    for (var p in req.body) {   // Pull the data from the body submission
        qParams.push({ 'name': p, 'value': req.body[p] });
    }
    var context = {};
    context.dataList = qParams;
    context.type = "POST";
    res.render('home', context);
});

/* I needed to see for myself that redirecting to the above page(s) from another
page would display the correct information, so I made another page to test going
to the homepage. Uses the same form in the home page.   */
app.get('/otherpage', function (req, res) {
    res.render('otherpage');
})

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
