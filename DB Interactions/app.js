/*
Brad Powell
CS 290 Winter 2019
Database Interactions and UI
*/

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
var bodyParser = require('body-parser');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs290_powelbra',
    password: '6994',
    database: 'cs290_powelbra'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('static'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 2581);

function handleErr(error) {
    console.log(JSON.stringify(error));
    res.write(JSON.stringify(error));
    res.end();
}

app.get('/', function (req, res) {
    context = {};

    res.render('home', context);
});

app.post('/', function (req, res) {
    var sql = 'INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?,?,?,?,?)';
    var inserts = [req.body.name, req.body.reps || null, req.body.weight || null, req.body.date || null, req.body.unit];

    pool.query(sql, inserts, function (error) {
        if (error) {
            handleErr(error);
        } else {
            res.status(200);
            res.end();
            /*
            
            */
        }
    });
});

app.get('/get-table', function (req, res) {
    var sql = 'SELECT * FROM workouts';
    pool.query(sql, function (error, results) {
        if (error) {
            handleErr(error);
        } else {
            console.log(results);
            res.type('application/json');
            res.send(results);
        }
    });
})

app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){
        var createString = "CREATE TABLE workouts("+
        "id INT PRIMARY KEY AUTO_INCREMENT,"+
        "name VARCHAR(255) NOT NULL,"+
        "reps INT,"+
        "weight INT,"+
        "date VARCHAR(255),"+
        "lbs BOOLEAN)";
        pool.query(createString, function (err) {
            context.results = "Table reset";
            res.render('home', context);
        });
    });
});

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