const { connect, connection } = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/<database name here>';

connect(connectionString);

module.exports = connection;