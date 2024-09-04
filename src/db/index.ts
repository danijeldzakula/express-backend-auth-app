import mongoose, { ConnectOptions } from 'mongoose';

const FALLBACK_URI = 'mongodb://localhost:27017/backend-api';

// Define the MongoDB connection URL
const MONGODB_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_PROD_URI ?? FALLBACK_URI
    : process.env.MONGODB_DEV_URI ?? FALLBACK_URI;

// Mongoose connection options
const mongooseOptions: ConnectOptions = {};

// Create a function to establish a Mongoose connection
export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Export the Mongoose instance (optional, for advanced usage)
export const db = mongoose.connection;
