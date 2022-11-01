const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  try {
    const uri = process.env.DB_URI;

    mongoose.connect(uri);

    console.log("DB Connected");
  } catch (error) {
    console.log("Couldn't connect DB");
    console.log(error);
  }
}

module.exports = dbConnect;
