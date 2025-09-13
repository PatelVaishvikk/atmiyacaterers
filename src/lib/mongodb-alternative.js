// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;

// // Alternative configuration for SSL issues
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // Try without SSL first
//   ssl: false,
//   // If SSL is required, try these options
//   // ssl: true,
//   // sslValidate: false,
//   // tlsAllowInvalidCertificates: true,
//   // tlsAllowInvalidHostnames: true,
//   retryWrites: true,
//   w: 'majority',
//   // Connection timeout
//   connectTimeoutMS: 30000,
//   socketTimeoutMS: 30000,
//   serverSelectionTimeoutMS: 30000,
//   // Buffer settings
//   bufferMaxEntries: 0,
//   bufferCommands: false,
// };

// let client;
// let clientPromise;

// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// if (process.env.NODE_ENV === 'development') {
//   if (!global._mongoClientPromiseAlt) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromiseAlt = client.connect().catch(err => {
//       console.error('MongoDB alternative connection error:', err);
//       throw err;
//     });
//   }
//   clientPromise = global._mongoClientPromiseAlt;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect().catch(err => {
//     console.error('MongoDB alternative connection error:', err);
//     throw err;
//   });
// }

// export default clientPromise;


import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const options = {
  // Connection timeout settings
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
};

// Add TLS settings only if using MongoDB Atlas or remote MongoDB
if (uri && uri.includes('mongodb+srv')) {
  options.tls = true;
  options.tlsAllowInvalidCertificates = true;
  options.tlsAllowInvalidHostnames = true;
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch(err => {
    console.error('MongoDB connection error:', err);
    throw err;
  });
}

export default clientPromise;