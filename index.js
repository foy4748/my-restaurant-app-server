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

app.get("/schedules/:id", (req, res) => {
  fs.readFile(schedules_path, "utf8", (error, _readData) => {
    if (error) {
      res.status(500).end();
      console.log(error);
      return;
    }

    const readData = JSON.parse(_readData);
    const bookedTables = readData[req.params.id]?.map(
      (item) => Object.values(item)[0]
    );
    if (bookedTables && bookedTables.length >= 1) {
      res.setHeader("Content-type", "application/json");
      res.setHeader("charset", "UTF-8");
      res.send(bookedTables);
    } else {
      res.send({ found: false });
    }
  });
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
  } catch (error) {
    console.error(error);
  }
  console.log("HIT");
  fs.readFile(schedules_path, "utf8", (error, _readData) => {
    if (error) {
      res.status(500).end();
      console.log(error);
      return;
    }
    const readData = JSON.parse(_readData);
    const found = readData[DATE + TIME];
    const booking = {};
    booking[UID] = table;
    if (found) {
      readData[DATE + TIME].push(booking);
    } else {
      readData[DATE + TIME] = [booking];
    }

    fs.writeFile(schedules_path, JSON.stringify(readData), "utf8", (error) => {
      if (error) {
        res.status(500).end();
        console.log(error);
        return;
      }
    });
  });
  res.status(200).send({ error: false });
});

app.listen(PORT, () => {
  console.log("RESTAURAN APP SERVER RUNNING AT PORT:", PORT);
});

/*
VITE_SERVER_ADDRESS="https://restaurant-app-server-gamma.vercel.app"
*/
