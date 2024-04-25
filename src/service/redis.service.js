const redisClient = require("../configuration/redis");
const axios = require("axios");
const expireTime = 600;

// caching example
exports.checkRedisCache = async (req, res, next) => {
  let search = req.query.qrcode;
  const data = await redisClient.get(search);

  console.log("checking from redis cache...");

  if (data === null) {
    return next();
  } else {
    return res.json({
      data: JSON.parse(data),
      info: "data from cache",
    });
  }
};

exports.getAPIData = async (req, res) => {
  var url = `http://localhost:8080/master-management/customer/${req.query.qrcode}`;
  const response = await axios.get(url);
  const data = response.data;

  redisClient.set(data.customer.qrcode, JSON.stringify(data.customer));

  console.log("saving to redis cache...");

  res.send({
    data: data.customer,
    info: "data from API",
  });
};

exports.sampleInsertRedisData = async (req, res) => {
  console.log("starting /redis");

  const dataJson = {
    qrcode: req.body.qrcode,
    rfid: req.body.rfid,
    hargaSatuan: req.body.hargaSatuan,
    jumlah: req.body.jumlah,
    waktuPesan: Date.now(),
  };

  redisClient.setEx(dataJson.qrcode, expireTime, JSON.stringify(dataJson));
  const data = await redisClient.get(dataJson.qrcode);
  console.log(data);
  res.send(JSON.parse(data));
};
