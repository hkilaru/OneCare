var accountSid = 'AC5e784cc0b718fb1573cdc572e67f4914';
var authToken = 'e222367896ed8b225294cd28b6097fd0';
var twilio = require('twilio');
var Model = require('./db.js');
var jwt  = require('jwt-simple');
var client = new twilio.RestClient(accountSid, authToken);
var ObjectId = require('mongoose').Types.ObjectId;
var http = require('http');
var request = require("request");
var api_key = 'key-417e9083f77969e4e9cf916a2ef8769c';
var domain = 'app25011ddcdf3a4f38b11f9b60d62e1106.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});




var dbFunc = {

	receiveEmail: function(message, docEmail, userID, docID, res){
		console.log("receiveEmail called with...", message, docEmail, userID, docID);
			var note = {
				seen: false,
				hidden: false,
				body: message,
				user: userID,
				doctor: docID
			}

		this.addNote(note, res);
	},

	sendEmail: function(patientName, patientUserID, docID, docEmail, res){
		var message = "Your patient, " + patientName + " has added you as a doctor in their OneCare network. If you would like to add any notes for this patient, simply reply to this email. Please DO NOT change the subject of this email thread";

		var data = {
		  from: 'OneCare <onecare@app25011ddcdf3a4f38b11f9b60d62e1106.mailgun.org>',
		  to: docEmail, //can only send to email addresses we registed with Mailgun
		  subject: patientUserID + ":" + docID,
		  text: message
		};
		mailgun.messages().send(data, function (error, body) {
			if(error){
				console.log("Doctor not contacted", error);
			}
			console.log('email sent!', body);
			res.sendStatus(200);
		});

	},

	// GET USER ZIP CODE // SEND USERNAME STRING
	getZip: function(username, res) {
		Model.user.findOne({"username": username}, function(err, user) {
			if(err) {
				console.log('username not found');
			}
			res.send(user.zipcode);
		});
	},

	addScript: function(script, res) {
		/*
			Script Format
			{
				"name": 'bactrim',
				"dosage": '1 tablet',
				"refill": '08-17-2016',
				"frequency": '2x per day',
				"reminderTime": '2016-08-10T20:00:00.000Z',
				"username": 'harish'
		}
		*/
		var message = "Time to take your " + script.name + ' (' + script.dosage + ')!';
		var newScript = new Model.script(script);
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
				this.setReminder(script.username, newScript._id, message, script.reminderTime, script.refill, script.name); //script.reminderTime is an array of times
			}.bind(this));
		}.bind(this));

	},


	getScripts: function(username, res) {
		Model.user.findOne({'username': username}).populate('scripts').exec(function (err, found) {
			if(err){
				console.log('error in fetching scripts', err);
			}
			if (found) {
			  res.send(found.scripts);
			} else {
				res.send([])
			}
		});
	},

  addDoc: function(data, res, next) {
  	var newDoc = new Model.doctor(data.doc);
  	newDoc.save(function(err) {
  		if (err) {
  			console.log(err);
  		}
  		Model.user.update({"username": data.username}, {$push:{"doctors": newDoc}}, function(err){
				if(err){
					next(new Error("doctor added to user model"));
				}
				if(newDoc.email){ //email doctor if patient provided email address
					this.sendEmail(data.first_last, data.userID, newDoc._id, newDoc.email, res);
				}
				else{
					res.status(201).send(newDoc);
				}
			}.bind(this));
  	}.bind(this));
  },

  getDocs: function(username, res, next) {
		Model.user.findOne({"username": username}).populate('doctors').exec(function(err, user){
			if(err){
				next(new Error(err));
			}
			if (user) {
	  		res.send(user.doctors);
			} else {
				res.send([]);
			}
		});
  },

	deleteDoc: function(id, res, next) {
		Model.doctor.remove({"_id": id}, function(err){
			if(err){
				next("doctor not deleted", err);
			}
			// console.log('delete doctor 500 ');
			res.status(200).send("doctor deleted");
		});
  },

	updateDoc: function(doctor, res) {
		Model.doctor.findOneAndUpdate({"_id": doctor._id}, {
			// name: String,
			// phone: String,
			// email: String,
			// specialty: String,
			// address: String,
			// patients: [{type: Schema.Types.ObjectId, ref: 'User'}],
			// notes: [{type: Schema.Types.ObjectId, ref: 'Note'}]
			$set: {
				name: doctor.name,
		  	phone: doctor.phone,
				email: doctor.email,
				specialty: doctor.specialty,
				address: doctor.address
			}
		}).then(function(doc, err){
			console.log('doctor updated', doc);
		}).then(function(){
			console.log('error in updating doctor');
		});
	},


	/* AUTHENTICATION FUNCTION */


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
						next(new Error("err"));
					}
					else{
						var token = jwt.encode(user, 'secret'); //create new token
			      res.json({"token": token, "user": {"id": user._id, "username": user.username}}); //send new token and user object
					}
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
						var token = jwt.encode(user, 'secret'); //create new token
						console.log("USER to be signed in", user);
						var resultData = {"token": token, "user": {"id": user._id, "username": user.username, "first_last": user.firstName + ' ' + user.lastName}}
						console.log("RESULT DATA", resultData);
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
	    		res.status(200).send();
	    	}
	    });
	  }
	},

	getZip: function(user, res) {

		if (!user.username) {
			console.log('no usern@me found');
		}
		else {
			Model.user.findOne({'username': user.username}, function(err, user) {
				if (err) {
					console.error(err);
				}
				else {
					res.status(200).send(user.zipcode);
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
				res.send(newSymptom);
			});
	},

	setReminder: function(username, scriptID, message, time, refillDate, drugName) { //time is an array
		// look up user object and find their phone number
				Model.user.findOne({"username": username}, function(err, user){
										"use strict";
					if(err){
						next(new Error(err));
					}
					var phoneNum = "+" + user.phone;
					for(let i = 0; i < time.length; i++) {
						if(time[i] !== null){
							var options = {
								method: 'POST',
							  url: 'http://worker-aws-us-east-1.iron.io/2/projects/57a8f721bc022f00078da23f/schedules',
							  qs: { oauth: '0DHLF4oFfGZIbMcdg2W6' },
							  headers:
							   { 'cache-control': 'no-cache',
							     'content-type': 'application/json',
							     oauth: '0DHLF4oFfGZIbMcdg2W6'
								 },
							  body:
							   { schedules:
							      [ { code_name: 'test_worker',
							          payload: JSON.stringify({phone: phoneNum, message: message}),
							          start_at: time[i], //need to change the date to the ISO version new Date('09 August 2016 15:05').toISOString()
							          run_every: 60, //interval in seconds
							          run_times: 10  //how many times until stopped
										} ]
								},
							  json: true
							};
							request(options, function (error, response, body) { //POST to Iron Worker to schedule the recurring texts
							  if (error) throw new Error(error);
								if(body.schedules){
									Model.script.findOneAndUpdate({"_id": scriptID}, { //add ironID to script document
										$push: {
											reminderID: body.schedules[0].id,
										}
									})
									.then(function(res) {
										console.log("reminder has been saved");
									})
									.catch(function(err) {
										console.log(new Error("reminder has not been saved", err));
									});
								}
							});
					}
				}

					//set refill reminder

					if(refillDate){
						var options = {
							method: 'POST',
							url: 'http://worker-aws-us-east-1.iron.io/2/projects/57a8f721bc022f00078da23f/schedules',
							qs: { oauth: '0DHLF4oFfGZIbMcdg2W6' },
							headers:
							 { 'cache-control': 'no-cache',
								 'content-type': 'application/json',
								 oauth: '0DHLF4oFfGZIbMcdg2W6'
							 },
							body:
							 { schedules:
									[ { code_name: 'test_worker',
											payload: JSON.stringify({phone: phoneNum, message: 'Hello from OneCare! Remember to refill your ' + drugName + ' today.' }),
											start_at: refillDate, //need to change the date to the ISO version new Date('09 August 2016 15:05').toISOString()
											run_every: null, //interval in seconds
											run_times: 1  //how many times until stopped
									} ]
							},
							json: true
						};

						request(options, function (error, response, body) { //POST to Iron Worker to schedule the recurring texts
							if (error) throw new Error(error);
							if(body.schedules){
								Model.script.findOneAndUpdate({"_id": scriptID}, { //add ironID to script document
									$push: {
										reminderID: body.schedules[0].id,
									}
								})
								.then(function(){
									console.log("reminderID for DATE added");
								})
								.catch(function(err){
									console.log("reminderID for DATE not added", err);
								});

							}
						});
				}
	});
},

deleteReminder: function(scriptID, res) {
	//REMOVES SCRIPT DOCUMENT (reference still persists in user doc but it won't reference anything)
	Model.script.findOne({"_id": scriptID}, function(err, script){
		"use strict";
		if(err){next(new Error(err))}
		// console.log("ironID: ", script.reminderID);
		var ironIDs = script.reminderID;
		for(let i = 0; i < ironIDs.length; i++){
			"use strict";
			if(ironIDs[i] !== null){
				var options = {
					method: 'POST',
					url: 'http://worker-aws-us-east-1.iron.io/2/projects/57a8f721bc022f00078da23f/schedules/'+ ironIDs[i] + '/cancel',
					qs: { oauth: '0DHLF4oFfGZIbMcdg2W6' },
					headers:
					 { 'cache-control': 'no-cache',
						 'content-type': 'application/json',
						 oauth: '0DHLF4oFfGZIbMcdg2W6'
					 }
				};
				request(options, function (error, response, body) {
					if (error) throw new Error(error);
				});
			}
		}
		Model.script.remove({"_id": scriptID}, function(err){
			if(err){
				console.log("reminder not deleted", err);
			}
			else{
				res.status(202).send(script);
			}
		});
	});
},

	addNote: function(data, res) {
		console.log("NOTE about to be created: ", data);
  	var newNote = new Model.note(data);
  	newNote.save(function(err) {
  		if (err) {
  			console.log("NEW NOTE not SAVED", err);
  		}
  		Model.doctor.update({"_id": data.doctor}, {$push:{"notes": newNote}}, function(err){
				if(err){
					next(new Error("note added to doctor model"));
				}
				res.status(201).send(newNote);
			});
  	});
  },

  getNotes: function(doctorID, res) {
  	Model.doctor.findOne({"_id": doctorID}).populate('notes').exec(function(err, found) {
  		if (err) {
  			res.status(404).send(err);
  		} else {
        res.status(200).send(found.notes);
  		}
  	});
  },

  editNote(targetNoteID, edit, res) {
    var success = Model.note.findOneAndUpdate({"_id": targetNoteID}, {$set: edit})
    .then(function(found) {
    	if (res) {
        res.status(200).send("note updated: ", found);
    	}
    })
    .catch(function(err) {
    	console.error("failed to update note", found)
    	if (res) {
	    	res.sendStatus(500);
    	}
    })
  },

  editAllNotes(doctorID, edit, res) {
  	var editOne = this.editNote;
    Model.doctor.findOne({"_id": doctorID}).populate('notes').exec(function(err, found) {
      found.notes.forEach(function(note) {
      	editOne(ObjectId(note._id), edit);
      });
      if (err) {
      	res.status(500).send("error: ", err);
      } else {
	      res.status(200).send("All doctors notes updated!");
      }
    })
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
