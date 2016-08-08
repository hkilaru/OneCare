var accountSid = 'AC5e784cc0b718fb1573cdc572e67f4914';
var authToken = 'e222367896ed8b225294cd28b6097fd0';
var twilio = require('twilio')
var Model = require('./db.js');
var jwt  = require('jwt-simple');
var client = new twilio.RestClient(accountSid, authToken);
var ObjectId = require('mongoose').Types.ObjectId;
var cron = require('cron');
var cronJob = cron.CronJob;
var CronJobManager = require('cron-job-manager')
var reminderManager = new CronJobManager();


var dbFunc = {

	addScript: function(script, res, next) {
		/*
			Script Format
			{
				"name": 'bactrim',
				"dosage": '1 tablet',
				"refill": '08-17-2016',
				"frequency": '2x per day',
				"reminderTime": '10:00 AM',
				"username": 'harish'
		}
		*/
		var message = "Time to take your " + script.name + ' (' + script.dosage + ')!';

		var convertToCronTime = function(time) {
			var hour = Number(time.split('').splice(0, time.indexOf(":")).join(''));
			var minuteString = time.split('').splice(time.indexOf(":") + 1, time.indexOf(":") + 1).join('');
			if(time[time.length-2] === "P" && (time[0] + time[1] !== '12')){
				hour +=12;
			}
			var hourString = hour.toString();
			var cronConvert = minuteString + ' ' + hourString + ' ' + '* * *';
			return cronConvert;
		};

		var cronTime = convertToCronTime(script.reminderTime);

		var newScript = new Model.script(script);
		console.log('newScript: ', newScript);
		newScript.save(function(err){
			if(err) {
				console.log('error', err);
			}

			Model.user.update({"username": script.username}, {$push:{"scripts": newScript}},
			function(err){
				if(err){
					res.send(new Error("script not added to user document"));
				}

				//call set reminder function
				this.setReminder(script.username, newScript._id, message, cronTime, next);

			}.bind(this));
		}.bind(this));

	},


	getScripts: function(username, res) {
		Model.user.findOne({'username': username}).populate('scripts').exec(function (err, found) {
			if(err){
				console.log('error in fetching scripts', err);
			}
			console.log('these are the found scripts for user: ', found.scripts);
			res.send(found.scripts);
		});
	},

  addDoc: function(data, res, next) {
		console.log("addDoc called with", data);
  	var newDoc = new Model.doctor(data.doc);
  	newDoc.save(function(err) {
  		if (err) {
  			console.log(err);
  		}
  		Model.user.update({"username": data.username}, {$push:{"doctors": newDoc}}, function(err){
				if(err){
					next(new Error("doctor added to user model"));
				}
				res.send(newDoc);
			});
  	});
  },

  getDocs: function(username, res, next) {
		Model.user.findOne({"username": username}).populate('doctors').exec(function(err, user){
			if(err){
				next(new Error(err));
			}
			console.log("?!?!", user);
			res.send(user.doctors);
		});
  },

	deleteDoc: function(id, res, next) {
		Model.doctor.remove({"_id": id}, function(err){
			if(err){
				next("reminder not deleted", err);
			}
			next("doctor deleted");
		});
  },


	/* AUTHENTICATION FUNCTIONS */

	signup: function(newUser, res, next) {
		Model.user.findOne({"username": newUser.username}, function(err, user){
			if(err) {
				console.log("Error: ", error);
			}
			if(!user) {
				var user = new Model.user(newUser);
				user.save(function(err){
					if(err) {
						console.log("new user not saved", err);
					}
				console.log("new user saved");
				var token = jwt.encode(user, 'secret'); //create new token
	      res.json({"token": token, "user": {"id": user._id, "username": user.username}}); //send new token and user object
			});

			}
			else {
				next(new Error("user already exists"));
			}
		});
	},

	signin: function(reqUser, res, next){
		var userPassword = reqUser.password;
		Model.user.findOne({"username": reqUser.username}, function(err, user){

			if(err){
				console.log("err was hit"); //if error in query
				next("Error: ", err);
			}
			if(!user){ //if user not found
				next(new Error("username does not exist"));
			}
			else{ //if user found
				user.comparePassword(reqUser.password, function(err, isMatch){
					if(err) {
						console.log("error occurred", err);
						next(new Error("EREROER",  err));
					}
					if(!isMatch){
						next(new Error("Incorrect password")); //will send an error if incorrect password
					}
					else{
						console.log("password correct!");
						var token = jwt.encode(user, 'secret'); //create new token
						console.log('this is token',token);
						var resultData = {"token": token, "user": {"id": user._id, "username": user.username}}
	          res.status(201).send(resultData); //send new token and user object
					}
				});
			}
		});
	},

	checkAuth: function(req, res, next){
		var token = req.headers['x-access-token'];
	  if (!token) {
	    next(new Error('No token'));
	  }
	  else {
	    var user = jwt.decode(token, 'secret');
	    Model.user.find(user, function(err, user){
	    	if(err){
	    		next("Error: ", error);
	    	}
	    	if(!user.length){ //user not found
	    		res.status(401).send();
	    	}
	    	else{ //token decoded and user found in database
	    		console.log("user authenticated");
	    		res.status(200).send();
	    	}
	    });
	  }
	},

	addSymptom: function(data, res) {
		var newSymptom = new Model.symptom(data);
			newSymptom.save(function(err) {
				if (err) {
					console.log(err);
				}
				console.log('New sympson added!');
				res.send(newSymptom);
			});
	},

	setReminder: function(username, scriptID, message, time, next) {
		console.log("sendReminder called for", username, "with the message:", message);
		// look up user object and find their phone number
				Model.user.findOne({"username": username}, function(err, user){
					if(err){
						next(new Error(err));
					}
					phoneNum = "+" + user.phone;
					console.log("Number on file", phoneNum);
					//with manager
					//manager.add('next_job', '0 40 * * * *', function() { console.log('tick...')});
					console.log("arguments...", scriptID.toString(), "at", time);
					reminderManager.add(scriptID.toString(), time, function() {
						console.log('this was the proper format!');
						client.sendMessage({
							to: phoneNum,
							from:"+16462332065",
							body: message,
						}, function( err, data) {
							if(err){
								console.log("CronJob not set: ", err);
							}
							next("Message sent.");
						});
					}, {"start": true});

					console.log("reminderManager", reminderManager);
					next("Reminder successfully set");
	});
},

deleteReminder: function(reminderID, next) {
	//REMOVES SCRIPT DOCUMENT (reference still persists in user doc but it won't reference anything)
	Model.script.remove({"_id": reminderID}, function(err, user){
		if(err){
			next("reminder not deleted", err);
		}
		if(reminderManager.exists(reminderID.toString())) {
			reminderManager.deleteJob(reminderID.toString());
		}
		next("reminder deleted");
	});
},

	saveBrain: function(brainState, trainingData, name) {
		var success = Model.brain.findOneAndUpdate({"_id": ObjectId("57a3a316dcba0f71400f021a")}, {
			$set: {
				brainState: brainState,
		  	trainingInputs: trainingData,
			  name: name
			}
		})
		.then(function(res) {
			console.log("Brain ", name, " updated! ");
		})
		.catch(function(err) {
			console.error("dun goofed!  ", err);
		});
	}
};



module.exports = dbFunc;
