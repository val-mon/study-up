import { MongoClient } from 'mongodb';

let client;
let db;

export const connect = async () => {
  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db('studyup');
  console.log('INFO : Connected to MongoDB Atlas');
};

export const disconnect = async () => {
  await client.close();
};

export const getDb = () => db;
