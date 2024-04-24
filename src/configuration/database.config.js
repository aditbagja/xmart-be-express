const { Pool } = require("pg");
const mongoose = require("mongoose");
const mongoString = process.env.MONGODB_URL;

mongoose.connect(mongoString).then(
  () => {
    console.log("Database Connected");
  },
  (error) => {
    console.log(`Connection to ${mongoString} error: ${error.message}`);
  }
);

const pool = new Pool({
  user: process.env.POSTGRE_USERNAME,
  password: process.env.POSTGRE_PASSWORD,
  host: process.env.POSTGRE_HOST,
  port: process.env.POSTGRE_PORT,
  database: process.env.POSTGRE_DB,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
