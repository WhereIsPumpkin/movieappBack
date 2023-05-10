import mongoose from "mongoose";

const connect = () => {
  const url = process.env.MONGO_URL;
  try {
    mongoose.connect(url);
  } catch (error) {
    console.log("Could not connect to MongoDB", error);
  }
};

export default connect;
