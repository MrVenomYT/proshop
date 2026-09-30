import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    mongoose.set('bufferCommands', false);
    if (!process.env.MONGO_URI) {
      console.log('No MONGO_URI provided in environment. In-memory data store is active.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.warn(`MongoDB not connected (${error.message}). Using in-memory fallback.`);
  }
};

export default connectDb;
