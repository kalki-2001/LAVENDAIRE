var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
const { urlencoded } = require('express');
var path = require('path');
var fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(require('express-post-redirect'));
app.use(express.json());

const mycon = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'lav'
});

mycon.connect((err) => {
    if (err) 
    {
      console.log("Database Connection Failed !!!", err);
    } 
    else 
    {
      console.log("Connected to Database");
    }
});

app.get('/register',function(req,res)
{
    res.render('signup',{msg: false});
});


app.get('/login',function(req,res)
{
    res.render('signin',{msg: false});
});


app.post('/registeruser', urlencodedParser, function (req, res) 
{
    var email = req.body.email;
    var uname = req.body.uname;
    var pass = req.body.psw;
        mycon.query(`select * from Details where email=?; `,[email],function(err1,results)
        {
            if(results.length == 0)
            {
                    mycon.query(`insert into Details values('${email}','${uname}','${pass}'); `,function(err2,results1)
                    {
                        res.render('signup',{msg: "User successfully registered !!!"});
                    });
            }
            else
            { 
                res.render('signup',{msg: "User already exists !!!"});             
            }
        });
});


app.post('/loginuser', urlencodedParser, function (req, res) 
{
        mycon.query(`select * from Details where (email=? && password=?); `,[req.body.email,req.body.psw],function(err1,results)
        {
            console.log(results);
            if(results.length == 0)
            {
                res.render('signin',{msg:"No user with this credentials"});
            }
            else
            { 
                res.render('dashboard',{result: results[0].username});             
            }
        });
});        

app.get('/logout',function(req,res)
{
    res.redirect('login');
});

app.listen(4000,function(){
    console.log("Server running");
});