var express = require('express');
var bodyParser = require('body-parser');
var dbHelpers = require('../db/dbhelper.js');
var path = require('path');
var app = express();
var brain = require('./brain.js');
var twilio = require('twilio');

app.use(express.static('public'));

var rootPath = path.normalize(__dirname + '/../client');
// app.use(express.static(__dirname + "/client"));
app.use("/node_modules",express.static(__dirname + "/../node_modules"));
app.use("/styles", express.static(rootPath + "/styles"));
app.use("/public", express.static(rootPath + '/public'));
app.use("/server", express.static(__dirname + "/../server"));
app.use("/assets", express.static(__dirname + "/../client/assets"));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(process.env.PORT || 3000, function(){
  console.log('Server is running');
});


app.get('/fuckDan', function(req, res){
  console.log('request received at /fuckDan');
  res.send(JSON.stringify({"message": "Fuck Dan"}));
});

app.post('/api/reminder/add', function(req, res, next) {
  console.log('request received at addScriptReminder');
	var newScript = req.body;
	dbHelpers.addScript(newScript, res, next);
});

app.post('/api/reminder/delete', function(req, res, next){
  console.log("request received at deleteScript");
  var reminderID = req.body.reminderID;
  dbHelpers.deleteReminder(reminderID, next);
})

app.post('/api/script/find', function(req, res) {
	var username = req.body.username;
	dbHelpers.getScripts( username, res);
});

app.post('/api/doctor/add', function(req, res) {
  var newDoc = req.body;
  dbHelpers.addDoc(newDoc, res);
});

// Add doctor to user model
app.post('/api/user/doctor/add', function(req, res) {
  var data = req.body;
  console.log('this is the data that is being sent to helper', data);
  dbHelpers.addUserDoc(data, res);
});
//

// Retrieve doctors from user model
app.post('/api/doctors/get', function(req, res, next) {
  var data = req.body.username;
  dbHelpers.getDocs(data, res, next);
});
//

// USER SIGNUP SIGNIN

app.post('/api/signup', function(req, res, next) {
  var userSignup = req.body;
  dbHelpers.signup(userSignup, res, next);
});

app.post('/api/signin', function(req, res, next) {
  var userSignin = req.body;
  dbHelpers.signin(userSignin, res, next);
});

app.post('/api/script/remind', function(req, res, next) {
  console.log("request received at setReminder route");
  var username = req.body.username;
  var message = req.body.message;
  //phone will not be a parameter in final version, we'll look it up based on the username
  var phone = req.body.phone;
  var time = req.body.time;
  dbHelpers.setReminder(username, message, phone, time, res);
});

app.post('/api/symptomEntry/add', function(req, res) {
  var newSympson = req.body;
  console.log(newSympson);
  dbHelpers.addSymptom(newSympson, res);
});

app.post('/api/brain/recommend', function(req, res) {
  var username = req.body.username
  var symptoms = req.body.symptoms;
  console.log("The brain shall now ponder: ", symptoms);
  var data = brain.OCBrain.activate(symptoms);
  console.log("The brain has decided to recommend: ", data);
  //query db for user docs.
  brain.OCBrain.doctors(username, data, function(list) {res.status(200).send(list)});
});

app.get('/api/brain/save', function(req, res) {
  brain.OCBrain.save("MainBrain");
  res.send("huehuehue");
});

app.post('/api/brain/add', function(req, res) {
  var pair = req.body.pair;
  res.send(brain.OCBrain.addTrainingPair(pair))
  brain.OCBrain.train(1);
  brain.OCBrain.save("MainBrain");
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(rootPath + "/index.html"));
});
