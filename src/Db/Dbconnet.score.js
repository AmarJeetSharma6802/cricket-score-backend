import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_ATLAS);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
        process.exit(1);
  }
};


export default connectDb;