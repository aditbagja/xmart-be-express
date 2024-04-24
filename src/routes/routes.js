const express = require("express");
const customerService = require("../service/customer.service");

const router = express.Router();

router.get("/customer-list", customerService.findAll);

module.exports = router;
