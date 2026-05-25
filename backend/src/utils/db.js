const mongoose = require('mongoose');

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('INFO : Connected to MongoDB Atlas');
};

const disconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { connect, disconnect };
