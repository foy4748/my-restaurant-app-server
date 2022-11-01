const mongoose = require("mongoose");

async function dbConnect() {
  try {
    const uri =
      "mongodb+srv://foy4748_db:mIg474474_db@cluster0.qilkt.mongodb.net/TESTDATA?retryWrites=true&w=majority";

    mongoose.connect(uri);

    console.log("DB Connected");
  } catch (error) {
    console.log("Couldn't connect DB");
    console.log(error);
  }
}

module.exports = dbConnect;
