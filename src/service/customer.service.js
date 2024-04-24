const db = require("../configuration/database.config");

exports.findAll = async (req, res) => {
  await db.query("SELECT * FROM customer").then((data) => {
    res.send(data.rows);
  });
};
