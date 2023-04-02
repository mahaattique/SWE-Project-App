var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var reserveSchema = new Schema({
   roomName: { type: String, required: true, unique: true },
   dorm: { type: String, required: true, unique: false },
   floor: { type: Number, required: true, unique: false },
   time: { type: String, required: true, unique: false }
});

var userSchema = new Schema({
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   id: { type: Number, required: true, unique: true },
   classYear: { type: Number, required: true },
   collegeEmail: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   role: { type: String, required: false },
   allReserve: [{ type: Schema.Types.ObjectId, ref: 'Reservations' }]
});

var Reservations  = mongoose.model('Reservations', reserveSchema);

// export userSchema as a class called Users
module.exports = mongoose.model('Users', userSchema);