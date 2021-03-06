module.exports = function(app, passport) {
 app.get('/', function(req, res){
  res.render('index.ejs');
 });
//START LOGIN
 app.get('/login', function(req, res){
  res.render('login.ejs', {message:req.flash('loginMessage')});
 });
 
 app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
 }),
  function(req, res){
   if(req.body.remember){
    req.session.cookie.maxAge = 1000 * 60 * 3;
   }else{
    req.session.cookie.expires = false;
   }
   res.redirect('/');
  });

  // SIGN UP
 app.get('/signup', function(req, res){
  res.render('signup.ejs', {message: req.flash('signupMessage')});
 });

 app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
 }));

 app.get('/profile', isLoggedIn, function(req, res){
  res.render('profile.ejs', {
   user:req.user
  });
 });

 app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
 });




 //AFISARE DE INTREBARI in consola

 app.get('/questions', isLoggedIn, function(req, res){

    var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quizbros"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM questions", function (err, result) {
    if (err) throw err;
    console.log(result);
    // res.send(result); asta nu merge

    //req.send(result);
    //message:req.flash(result)
    //res.json({data: result});
    res.render('questions.ejs', {questions:result});
  });
});
    //res.render('questions.ejs', {message: req.flash(result)})
});


//POSTARE DE INTREBARI
app.post('/questions',function(res,req){ console.log("aici");

var mysql2 = require('mysql');
var con = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database:"quizbros"
});
con.on('error', function(err) {
    console.log("[mysql error]",err);
  });


    console.log("connected");

  //  var newQuestionMysql = {
  //      title: req.body.title,
  //      answer1: req.body.answer1,
  //      answer2: req.body.answer2
  //     };
       var insertQuery = "INSERT INTO questions (title, answer1, answer2) VALUES (?, ?, ?)";
  console.log(res.body.title + " " + res.body.answer1 + " " + res.body.answer2)
       con.query(insertQuery, [res.body.title, res.body.answer1, res.body.answer2]);
    

 



    req.redirect('/questions');

});
};

function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();

 res.redirect('/');
};

