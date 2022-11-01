const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const DATE_n_TIME_SchemaObj = {
  date_n_time: {
    type: String,
    minLength: 10,
    maxLength: 10,
  },
  tables: [ObjectId],
};

const DATE_n_TIME_Schema = Schema(DATE_n_TIME_SchemaObj);

const DATE_n_TIME = mongoose.model("DATE_n_TIME", DATE_n_TIME_Schema);

module.exports = DATE_n_TIME;
