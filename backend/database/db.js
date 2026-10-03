import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected");
  } catch (error) {
    console.log("mongo db doesnot connected", error);
  }
};
export default connectDB;
