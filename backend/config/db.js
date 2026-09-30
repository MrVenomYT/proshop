import mongoose from 'mongoose';

let cachedPromise = null;

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    mongoose.set('bufferCommands', false);
    if (!process.env.MONGO_URI) {
      console.log('No MONGO_URI provided in environment. In-memory data store is active.');
      return null;
    }

    cachedPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });

    const conn = await cachedPromise;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
    console.warn(`MongoDB connection notice (${error.message}). Using in-memory fallback.`);
    return null;
  }
};

export default connectDb;
