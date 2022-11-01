const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const user_uids_path = path.join(process.cwd(), "/data/user_uids.json");
const schedules_path = path.join(process.cwd(), "/data/schedules.json");

const ObjectId = mongoose.Types.ObjectId;
// Importing Data Models
const TABLE = require("./Models/TableSchema.js");
const DATE_n_TIME = require("./Models/DateSchema.js");

const dbConnect = require("./dbConnect.js");
dbConnect();
const corsOptions = {
  origin: [
    "https://posh-restaurant-app-foy4748.netlify.app/",
    "http://localhost:3000/",
  ],
  methods: ["GET", "POST"],
};

const PORT = process.env.PORT || 3001;

//Importing Packages and Middlewares
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Usage
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send({});
});

app.post("/user-uids", (req, res) => {
  res.status(200).send({});
});

app.get("/schedules/:id", async (req, res) => {
  const date_n_time = req.params.id;
  try {
    const foundData = await DATE_n_TIME.findOne({ date_n_time })
      .populate("tables")
      .exec();
    if (foundData) {
      res.send(foundData.tables);
      return;
    } else {
      res.send([]);
      return;
    }
  } catch (error) {
    console.error(error);
  }
});

// Schedule Handler
app.post("/schedules", async (req, res) => {
  const { DATE, TIME, TABLE: table, UID } = req.body;
  const date_n_time = DATE + TIME;
  try {
    const newTable = new TABLE({ table, uid: UID, date_n_time });
    await newTable.save();

    await DATE_n_TIME.findOneAndUpdate(
      { date_n_time },
      { $push: { tables: new ObjectId(newTable) } },
      {
        upsert: true,
      }
    );
    res.status(200).send({ error: false });
  } catch (error) {
    console.error(error);
    res.status(200).send({ error: true });
  }
});

app.listen(PORT, () => {
  console.log("RESTAURAN APP SERVER RUNNING AT PORT:", PORT);
});
