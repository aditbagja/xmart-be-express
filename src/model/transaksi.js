const mongoose = require("mongoose");

const transaksiSchema = new mongoose.Schema({
  qrCode: {
    require: true,
    type: String,
  },
  rfid: {
    require: true,
    type: String,
  },
  hargaSatuan: {
    require: true,
    type: Number,
  },
  jumlah: {
    require: true,
    type: Number,
  },
  waktuPesan: {
    type: Date,
    default: Date.now(),
  },
});

const Transaksi = mongoose.model("transaksi", transaksiSchema);

module.exports = Transaksi;
