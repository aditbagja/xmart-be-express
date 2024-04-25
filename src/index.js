require("dotenv").config();
require("./configuration/database.config");
require("./configuration/redis");

const express = require("express");
const port = process.env.APP_PORT;
const routes = require("./routes/routes");

const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
