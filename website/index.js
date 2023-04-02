// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the User class from User.js
var Users = require('./Users.js');
var Room = require('./commonRooms.js');
const e = require('express');

/***************************************/

app.use('/hello', (req, res) => {
	res.send("Hello World");
});

// endpoint for creating a new person
// this is the action of the "create new person" form
app.use('/signup', (req, res) => {

});

app.use('/login', (req, res) => {

});

//endpoint for creating a new user from "Add User" request form
app.use('/addUser', (req, res) =>{
	var newUser = new Users ({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			id: req.body.id,
			classYear: req.body.classYear,
			collegeEmail: req.body.collegeEmail,
			password: req.body.password,
			role: req.body.role
		    });

		// save the user to the database
		newUser.save( (err) => { 
		if (err) {
		    	res.type('html').status(200);
		    	res.write('uh oh: ' + err);
		    	console.log(err);
		    	res.end();
		}
		else {
			 // display the "successfull created" message
			res.send('successfully added ' + newUser.id + ' to the database');
		}
	});
});

// endpoint for showing all the users enrolled in the database
app.use('/allUsers', (req, res) => {
	Users.find( {}, (err, u) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (u.length == 0) {
			res.type('html').status(200);
			res.write('There are no users in the database.');
			res.end();
			return;
		    }
		    else {
			res.type('html').status(200);
			res.write('Here are the users in the database:');
			res.write('<ul>');
			// show all the users
			u.forEach( (user) => {
			    res.write('<li>');
			    res.write('Name: ' + user.firstName + " "+ user.lastName + '; user ID: ' + user.id + '; graduation year: ' + user.classYear + '; email: ' + user.collegeEmail + '; user role: ' + user.role + '; reservations: ' + user.numReserve );
			    // this creates a link to the /delete endpoint
			    res.write(" <a href=\"/deleteUser?user=" + user.userID + "\">[Delete]</a>");
			    res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    }).sort({ 'user.id' : 'asc' });
});

//endpoint for deleting a user
app.use('/deleteUser', (req, res) => {
		var User = {'Users' : req.query.Users};
	Users.findOneAndDelete(User, (err, u) => {
		 if (err) {
			 console.log("error" + err);
		 } else if (!u) {
			 console.log("not a user" + err);
		 }
	 });
	 res.send('successfully deleted user from the database');
	 res.redirect('/allUsers');
});


// endpoint for showing all the common rooms in the database
app.use('/allRooms', (req, res) => {
	Room.find( {}, (err, cR) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (cR.length == 0) {
				res.type('html').status(200);
				res.write('There are no common rooms');
				res.end();
				return;
		    }
		    else {
				res.type('html').status(200);
				res.write('Here are the common rooms in the database:');
				res.write('<ul>');
				// show all the common rooms
				cR.forEach( (commonroom) => {
					res.write('<li>');
					res.write('Name: ' + commonroom.roomName + '; capacity: ' + commonroom.capacity + '; dorm name: ' + commonroom.dorm + '; floor number: ' + commonroom.floor + '; time slots: ' + commonroom.timeSlots + '; availability : ' + commonroom.avail + '; reservations limit : ' + commonroom.numReserve);
					// this creates a link to the /delete endpoint
					res.write(" <a href=\"/delete?name=" + commonroom.roomName + "\">[Delete]</a>");
					res.write(" <a href=\"/public/editCommonRoom.html\">[Edit]</a>");
					res.write('</li>');
				});
				res.write('</ul>');
				res.end();
		    }
		}
	}).sort({ 'dorm': 'asc' });
});

//endpoint for creating a new common room from "Common Room" request form
app.use('/create', (req, res) =>{
	var newCommonRoom = new Room ({
			roomName: req.body.name,
			capacity: req.body.capacity,
			dorm: req.body.dorm,
			floor: req.body.floor,
			timeSlots: req.body.timeSlots,
			avail: req.body.avail,
			numReserve: req.body.numReserve
		    });

		// save the Common Room to the database
		newCommonRoom.save( (err) => { 
		if (err) {
		    	res.type('html').status(200);
		    	res.write('uh oh: ' + err);
		    	console.log(err);
		    	res.end();
		}
		else {
			 // display the "successfull created" message
			res.send('successfully added ' + newCommonRoom.roomName + ' to the database');
		}
	});
});

//endpoint for deleting a common room
app.use('/delete', (req, res) => {
       var CommonRoom = {'CommonRoom' : req.query.CommonRoom};
	Room.findOneAndDelete(CommonRoom, (err, room) => {
		if (err) {
			console.log("error" + err);
		}
		else if (!room) {
			console.log("not a common room" + err);
		}
	});
	res.send('successfully deleted common room from the database');
	res.redirect('/allRooms');
});

// editing the name, capacity, floor and timeslots of a communal space
app.use('/update', (req, res) => {
	var CommonRoom = {'CommonRoom' : req.query.CommonRoom}; // common room we are updating
	let commonroom = {};
		Room.findOne(CommonRoom, (err, result) => {
			if (err) {
				commonroom = {};
			}  
			if (result == null) {
				commonroom = result;
			}
		});
		Room.findOneAndUpdate(CommonRoom, { $set: {
			roomName: req.body.name ? req.body.name : commonroom.name,
			capacity: req.body.capacity ? req.body.capacity : commonroom.capacity,
			floor: req.body.floor ? req.body.floor : commonroom.floor,
			timeSlots: req.body.timeSlots ? req.body.timeSlots : commonroom.timeSlots,
			avail: req.body.avail ? req.body.avail : commonroom.avail,
			numReserve: req.body.numReserve ? req.body.numReserve : commonroom.numReserve }},
			(err, result) => {
				if (err) {
					res.type('html').status(200);
					console.log(err);
					
				} 
				if (result == null) {
					res.type('html').status(200);
					console.log("original information found "+ err);
					
				} else {
					res.send('successfully updated the common room information');
					res.redirect('/public/home.html');
					return;
				}
			}
		);
	}
);

/*************************************************/

app.use('/public', express.static('public'));

app.use('/', (req, res) => { res.redirect('/public/home.html'); });

app.listen(3000, () => {
	console.log('Listening on port 3000');
});