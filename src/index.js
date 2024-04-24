require("dotenv").config();
require("./configuration/database.config");

const express = require("express");
const port = process.env.APP_PORT;
const routes = require("./routes/routes");

const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
};

app.use(routes);
app.use(cors(corsOptions));
app.use(express.json());

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
