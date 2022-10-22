const fs = require("fs");
const path = require("path");
const user_uids_path = path.join(process.cwd(), "/data/user_uids.json");
const schedules_path = path.join(process.cwd(), "/data/schedules.json");
console.log(user_uids_path, schedules_path);

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

app.post("/schedules", (req, res) => {
  const { DATE, TIME, TABLE, UID } = req.body;
  fs.readFile(schedules_path, "utf8", (error, _readData) => {
    if (error) {
      res.status(500).end();
      console.log(error);
      return;
    }
    const readData = JSON.parse(_readData);
    const found = readData[DATE + TIME];
    const booking = {};
    booking[UID] = TABLE;
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
