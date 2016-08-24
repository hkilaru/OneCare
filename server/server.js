 var express = require('express');
var bodyParser = require('body-parser');
var dbHelpers = require('../db/dbhelper.js');
var path = require('path');
var app = express();
var brain = require('./brain.js');
var twilio = require('twilio');
var Yelp = require('yelp');
var ObjectId = require('mongoose').Types.ObjectId;

app.use(express.static('public'));

var rootPath = path.normalize(__dirname + '/../client');
// app.use(express.static(__dirname + "/client"));
app.use("/node_modules",express.static(__dirname + "/../node_modules"));
app.use("/styles", express.static(rootPath + "/styles"));
app.use("/public", express.static(rootPath + '/public'));
app.use("/server", express.static(__dirname + "/../server"));
app.use("/assets", express.static(__dirname + "/../client/assets"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(process.env.PORT || 3000, function(){
  console.log('Server is running');
});

// GET USER ZIPCODE
app.post('/api/user/zip', function(req, res) {
  // SAMPLE POST REQUEST POSTMAN
  // {"username": "kenton"}
  var user = req.body;
  dbHelpers.getZip(user, res);
});

app.post('/api/email/receive', function(req, res){
  console.log("FULL BODY", req.body);
  var message = req.body['stripped-text']; //wrong property, need to change
  var docEmail = req.body['sender']; //format: 'hckilaru@gmail.com'
  var userID = '';
  req.body['Subject'][0] === 'R' ? subject = req.body['Subject'].slice(4) : subject = req.body['Subject'] //depending on email client, Subject could include "Re:" at beginning
  var userDocIDs = subject.split(":");
  console.log("Args to be passed", message, docEmail, userID);
  dbHelpers.receiveEmail(message, docEmail, userDocIDs[0], userDocIDs[1], res);
});
app.post('/api/email/send', function(req, res, next){
  console.log("request recieved at sendEmail");
  dbHelpers.sendEmail(req.body.name, res);
});
// Add a new reminder to the reminder collection
app.post('/api/reminder/add', function(req, res) {
  var newScript = req.body;
  dbHelpers.addScript(newScript, res);
});

app.post('/api/reminder/delete', function(req, res){
  var reminderID = req.body.reminderID;
  dbHelpers.deleteReminder(reminderID, res);
});

app.post('/api/script/find', function(req, res) {
  var username = req.body.username;
  dbHelpers.getScripts( username, res);
});

app.post('/api/doctor/add', function(req, res) {
  var newDoc = req.body;
  dbHelpers.addDoc(newDoc, res);
});

app.post('/api/doctor/delete', function(req, res, next) {
  var docID = req.body.docID;
  dbHelpers.deleteDoc(docID, res, next);
});


// Add doctor to user model
app.post('/api/user/doctor/add', function(req, res) {
  var data = req.body;
  console.log('this is the data that is being sent to helper', data);
  dbHelpers.addUserDoc(data, res);
});

app.post('/api/user/doctor/edit', function(req, res) {
  var doctor = req.body;
  dbHelpers.updateDoc(doctor, res);
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
  var username = req.body.username;
  var message = req.body.message;
  //phone will not be a parameter in final version, we'll look it up based on the username
  var phone = req.body.phone;
  var time = req.body.time;
  dbHelpers.setReminder(username, message, phone, time, res);
});

app.post('/api/symptomEntry/add', function(req, res) {
  var newSympson = req.body;
  dbHelpers.addSymptom(newSympson, res);
});

app.post('/api/brain/recommend', function(req, res) {
  var username = req.body.username;
  var symptoms = req.body.symptoms;
  var data = brain.OCBrain.activate(symptoms);
  //query db for user docs.
  brain.OCBrain.doctors(username, data, function(list) {res.status(200).send(list)});
});

app.get('/api/brain/save', function(req, res) {
  brain.OCBrain.save("MainBrain");
  res.send("huehuehue");
});

app.post('/api/reminder/delete', function(req, res, next){
  var reminderID = req.body.reminderID;
  dbHelpers.deleteReminder(reminderID, next);
});

app.post('/api/brain/add', function(req, res) {
  var pair = req.body.pair;
  res.send(brain.OCBrain.addTrainingPair(pair));
  brain.OCBrain.train(1);
  brain.OCBrain.save("MainBrain");
});

app.get('/api/brain/print', function(req, res) {
  res.send(brain.OCBrain.print());
});

app.post('/api/note/add/*', function(req, res) {
  var doctorID = ObjectId(req.url.split('/').pop());
  var data = {
    seen: false,
    hidden: false,
    body: req.body.message,
    user: ObjectId(req.body.user),
    doctor: doctorID
  };
  dbHelpers.addNote(data, res);
});

app.get('/api/note/getAll/*', function(req, res) {
  //retrieves all notes for specified doctor
  var doctorID = ObjectId(req.url.split('/').pop());
  dbHelpers.getNotes(doctorID, res);
});

// fun learning exp!
// var yelp = new Yelp({
//   consumer_key: '1GCGSst4AI3oOk0DnqltxA',
//   consumer_secret: 'O9ocbqwcV23tNrWIpXzqseTIFEE',
//   token: 'GDNZad3iIfLT1-gEoPfXpU7ultv9fTZx',
//   token_secret: '8w-B0W2XoCWds244gwpoBhbbeaM'
// });

// app.post('/api/yelp', function(req, res) {
//   yelp.search({ term: req.body.name, location:  req.body.zip })
//   .then(function(data) {
//     console.log(req.body);
//     res.status(200).send(data);
//   })
//   .catch(function(err) {
//     console.log(req.body.name, req.body.zip);
//     res.sendStatus(400);
//   });
// });

app.put('/api/note/getAll/*', function(req, res) {
  //retrieves all notes for specified doctor
  var doctorID = ObjectId(req.url.split('/').pop());
  var edit = req.body;
  console.log(edit);
  dbHelpers.editAllNotes(doctorID, edit, res);
})

app.put('/api/note/edit/*', function(req, res) {
  var targetNoteID = ObjectId(req.url.split('/').pop());
  var edit = req.body;
  dbHelpers.editNote(targetNoteID, edit, res);
})

app.get('/*', function(req, res) {
  res.sendFile(path.join(rootPath + "/index.html"));
});
