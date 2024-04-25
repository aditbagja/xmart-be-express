const { createClient } = require("redis");
const redisURL = process.env.REDIS_URL;

const redisClient = createClient({ url: redisURL });

redisClient.connect();
redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (error) => {
  console.log(`Connection to Redis error: ${error.message}`);
});

module.exports = redisClient;
