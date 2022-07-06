const express = require('express');
const bodyparser = require('body-parser');
const mysql = require("mysql");

const app = express();
const port = 3000;
var data;

//middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    var allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Pragma, Content-Type,If-Modified-Since,clientTab,Expires, Accept,Authorization, Cache-Control');
    next();
});

//for mysql database connection
const con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "userDetail",
        port: 3308
    }
);
con.connect((err) => {
    if (err) throw err;
});


//signup APIs
app.get('/signup', function (req, res) {
    res.json(200, 'page is working on port 4200');
});

app.post('/signup', function (req, res) {

    var fname = req.body.fname;
    var lname = req.body.lname;
    var pno = req.body.pno;
    var email = req.body.email;
    var password = req.body.password;
    var qr;
    var check = 0;

    qr = `SELECT fname FROM user WHERE email='${email}'`;

    con.query(qr, (err, result) => {
        // console.log(result);
        if (result.length != 0) {
            res.json({ "status": 0, "message": "Account already exists" });
        }
        else {
            qr = `INSERT INTO user(fname,lname,pno,email,password) VALUES ('${fname}','${lname}','${pno}','${email}','${password}')`;

            con.query(qr, (err, result) => {
                res.json({ "status": 1, "message": "page is working" });
                check = 0;
            });
        }
    });
});


//loginAPIs
app.get('/login', function (req, res) {
    res.json(200, 'page is working on port 4200');
});

app.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var qr = `SELECT fname, lname, pno, password FROM user WHERE email="${email}"`;

    con.query(qr, (err, result) => {
        if (result.length != 0) {
            if (password != result[0].password) {
                res.json({ "status": 0, "message": "Wrong password" });
            }
            else {
                res.json({ "status": 1, "user": result[0] });
            }
        }
        else {
            res.json({ "status": 0, "message": "Acount does not exist" })
        }

    });
});


//details: GET API
app.get('/details/:id', (req, res) => {
    // res.json({"status": 1,"ID": req.params.id});
    var qr = `SELECT fname, lname, pno FROM user WHERE email="${req.params.id}"`;


    con.query(qr, (err, result) => {
        if (err) res.json({ "status": 0, "message": "data does not exist" });
        res.json({ "status": 1, "user": result[0] });
    });

});


app.listen(port, () => {
    console.log("sever is running");
});