require("dotenv").config();
const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;
const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

//connect to mongodb
function connectDB() {
  mongoose.connect(DB_URI, dbConfig);
  const db = mongoose.connection;
  db.on("error", (error) => console.error(error));
  db.on("open", () => console.log("Connected to mongodb"));
}

module.exports = connectDB;
