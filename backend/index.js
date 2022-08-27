require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const mysql = require("mysql");
const jwt = require('jsonwebtoken');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: '*' }
});
// const io = require('socket.io')(http);
const port = 3000;
let idOfUser;

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
    console.log("db connected");
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
    var user = { email: email, password: password };

    var qr = `SELECT password, id FROM user WHERE email="${email}"`;

    con.query(qr, (err, result) => {
        if (result.length != 0) {
            if (password != result[0].password) {
                res.json({ "status": 0, "message": "Wrong password" });
            }
            else {
                // var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_KEY,{expiresIn: '60s'});
                var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_KEY);
                idOfUser = result[0].id;
                console.log('ID of User : ', result[0].id," and idOfUser: ",idOfUser);
                res.json({ "status": 1, id: result[0].id, "token": accessToken });
            }
        }
        else {
            res.json({ "status": 0, "message": "Acount does not exist" })
        }

    });
});


//details: GET API
app.get('/details', authenticate, (req, res) => {
    // res.json({"status": 1,"ID": req.params.id});
    // var qr = `SELECT fname, lname, pno FROM user WHERE id="${req.params.id}"`;
    var qr = `SELECT fname, lname, pno,id FROM user`;


    con.query(qr, (err, result) => {
        if (err) res.json({ "status": 0, "message": "data does not exist" });
        res.json({ "status": 1, "user": result });
    });
    // res.json({"user":req.user.email});

});

app.delete('/delete/:id', (req, res) => {

    var delID = req.params.id;
    var qr = `DELETE FROM user WHERE id=${delID}`;

    con.query(qr, (err, result) => {
        if (err) res.json({ "status": 0, "message": "Delete not successful" });
        res.json({ "status": 1 });
    });
});

app.get('/view/:id', (req, res) => {
    // res.json({"status": 1,"ID": req.params.id});
    var qr = `SELECT fname, lname, pno, email FROM user WHERE id="${req.params.id}"`;


    con.query(qr, (err, result) => {
        if (err) res.json({ "status": 0, "message": "data does not exist" });
        res.json({ "status": 1, "user": result[0] });
    });

});

app.put('/update/:id', (req, res) => {
    var id = req.params.id;
    var qr = `UPDATE user SET fname = '${req.body.fname}', lname='${req.body.lname}', pno='${req.body.pno}' WHERE id=${id}`;

    con.query(qr, (err, result) => {
        if (err) res.json({ "status": 0, "error": err });
        else res.json({ "status": 1 });
    });
});

//middleWare
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //BEARER token

    if (token == null) {
        console.log('Unauthorized', 'in authentication function');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
        if (err) return res.json({ "status": 403 });
        req.user = user;
        console.log(user);
        // res.json(user);
        next();
    });
}



io.on('connection', socket => {

    socket.on('Authenticate', id => {
        console.log("id: ",id,"  ","idOfUser: ",idOfUser);
        if (id == idOfUser) {
            console.log("User connected");

            socket.on('message', msg => {
                console.log(msg);
                socket.broadcast.emit('message-broadcast', `${socket.id.substring(0, 2)}: ${msg}`);
            });

            // socket.emit('Authenticate');

            // socket.on('Authentication',token => {});

            socket.on('disconnect', () => {
                console.log('A user disconnect');
            });
        }
        else{
            socket.emit('Unauthorized-User', "You are not logged in.");
        }
    });

});

http.listen(port, () => {
    console.log("sever is running");
});