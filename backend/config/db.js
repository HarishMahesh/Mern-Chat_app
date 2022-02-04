const mongoose = require("mongoose");

const dbUrl =
  "mongodb+srv://harish:harish1923@cluster0.xu2gr.mongodb.net/chatApp";

const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("connected to db");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
