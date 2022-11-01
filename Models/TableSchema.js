const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TABLE_SchemaObj = {
  table: {
    type: Number,
    max: 9,
  },
  date_n_time: {
    type: String,
    minLength: 10,
    maxLength: 10,
  },
  uid: String,
};

const TABLE_Schema = Schema(TABLE_SchemaObj);

const TABLE = mongoose.model("TABLE", TABLE_Schema);

module.exports = TABLE;
