const { MongoClient } = require('mongodb');

let client;
let db;

const connect = async () => {
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db('studyup');
  console.log('INFO : Connected to MongoDB Atlas');
};

const disconnect = async () => {
  await client.close();
};

const getDb = () => db;

module.exports = { connect, disconnect, getDb };
