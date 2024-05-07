require("dotenv").config();
require("./configuration/database.config");
require("./configuration/redis");
require("./graphql/types");

const { graphqlHTTP } = require("express-graphql");
const { RootSchema } = require("./graphql/index");

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

app.use(
  "/graphql",
  graphqlHTTP({
    schema: RootSchema,
    graphiql: true,
    pretty: true,
  })
);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
