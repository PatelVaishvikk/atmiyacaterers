// src/lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI missing');
const dbName = process.env.MONGODB_DB || 'atmiya_caterers';

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 30000 });
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) global._mongoClientPromise = client.connect();
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
export async function getDb() {
  const c = await clientPromise;
  return c.db(dbName);
}
