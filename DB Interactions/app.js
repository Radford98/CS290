/*
Brad Powell
CS 290 Winter 2019
Database Interactions and UI
Note: I am also taking CS 340 on databases this quarter, so some of the implementations (put, delete) I learned to use in that class.
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
app.set('port', 2582);

// Handle error from mysql queries
function handleErr(error) {
    console.log(JSON.stringify(error));
    res.write(JSON.stringify(error));
    res.end();
}

// Convert date string in the form YYYY-MM-DD to MM-DD-YYYY
function convertMDY(date) {
    if (date != '') {
        return date.substring(5, 7) + '-' + date.substring(8) + '-' + date.substring(0, 4);
    } else {
        return null;
    }
}

// Display homepage
app.get('/', function (req, res) {
    context = {};

    res.render('home', context);
});

// Insert data to DB
app.post('/', function (req, res) {
    var sql = 'INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?,?,?,?,?)';
    req.body.date = convertMDY(req.body.date);
    var inserts = [req.body.name, req.body.reps || null, req.body.weight || null, req.body.date || null, req.body.unit];

    pool.query(sql, inserts, function (error) {
        if (error) {
            handleErr(error);
        } else {
            res.status(200);
            res.end();
        }
    });
});

// Get the data for the table
app.get('/get-table', function (req, res) {
    var sql = 'SELECT * FROM workouts';
    pool.query(sql, function (error, results) {
        if (error) {
            handleErr(error);
        } else {
            res.type('application/json');
            res.send(results);
        }
    });
});

// Reset the table to empty
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

// Display update page
app.get('/:id', function (req, res) {
    var context = {};
    var sql = 'SELECT * FROM workouts WHERE id = ?';
    pool.query(sql, [req.params.id], function (error, results) {
        if (error) {
            handleErr(error);
        } else {
            context = results[0];
            if (context.date != null) {
                context.date = context.date.substring(6) + '-' + context.date.substring(0, 2) + '-' + context.date.substring(3, 5);
            }
            res.render('update', context);
        }
    })
});

app.put('/:id', function (req, res) {
    var sql = 'SELECT name, reps, weight, date, lbs FROM workouts WHERE id = ?';
    pool.query(sql, [req.params.id], function (error, results) {
        if (error) {
            handleErr(error);
        } else {
            var current = results[0];
            sql = 'UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?';
            req.body.uDate = convertMDY(req.body.uDate);
            var inserts = [req.body.uName || current.name, req.body.uReps || current.reps, req.body.uWeight || current.weight, req.body.uDate || current.date, req.body.uUnit || current.lbs, req.params.id];
            pool.query(sql, inserts, function (error, results) {
                if (error) {
                    handleErr(error);
                } else {
                    res.status(200);
                    res.end();
                }
            })
        }
    })
})

app.delete('/:id', function (req, res) {
    var sql = 'DELETE FROM workouts WHERE id = ?';
    pool.query(sql, [req.params.id], function (error, results) {
        if (error) {
            handleErr(error);
        } else {
            res.status(202).end();
        }
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