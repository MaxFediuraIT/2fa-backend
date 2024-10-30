import mongoose from "mongoose";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
    );
    console.log("database connected");
  } catch (error) {
    console.log("database connection error", error.message);
  }
};

export { connectDB };
