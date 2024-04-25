const express = require("express");
const customerService = require("../service/customer.service");
const redisService = require("../service/redis.service");

const router = express.Router();

router.get("/customer-list", customerService.findAll);
router.get("/redisGet", redisService.checkRedisCache, redisService.getAPIData);
router.post("/redis", redisService.sampleInsertRedisData);

module.exports = router;
