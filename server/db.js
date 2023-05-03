const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const { MONGO_URI } = process.env;

mongoose.connect(
	MONGO_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	{
		compressors: ['zlib']
	}
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
	console.log('Connected to MongoDB');
});

const UserSchema = new Schema({
	_id: ObjectId,
	patreonData: {
		access_token: String,
		refresh_token: String,
		expires_in: Number,
		scope: String,
		token_type: String
	},
	patreonId: { type: String, index: true },
	sessionToken: { type: String, index: true },

	compute: {
		lastReset: Date,
		resetDay: Number,
		patreonComputeLeft: Number,
		providedComputeLeft: Number,
	}
});
const User = mongoose.model('User', UserSchema);

// Handle job queues through MongoDB
// because I don't want to complicate this project
// even more with Redis or RabbitMQ

const JobSchema = new Schema({
	_id: ObjectId,
	type: { type: String, index: true },
	data: Object,
	status: String,
	result: Object,

	runAt: { type: Date, index: true },
	createdAt: Date,
	updatedAt: Date
});
const Job = mongoose.model('Job', JobSchema);

module.exports = {
	User,
	Job
};
