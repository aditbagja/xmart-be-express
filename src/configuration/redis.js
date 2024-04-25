const { createClient } = require("redis");
const redisURL = process.env.REDIS_URL;

async function redisConnect() {
  await createClient({ url: redisURL })
    .on("error", (error) => {
      console.log(`Connection to Redis error: ${error.message}`);
    })
    .connect();

  console.log("Redis Connected");
}

redisConnect();
