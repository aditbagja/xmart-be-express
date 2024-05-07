const mongoose = require("mongoose");

const transaksiSchema = new mongoose.Schema(
  {
    qrcode: {
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
  },
  {
    collection: "transaksi",
    versionKey: false,
  }
);

const Transaksi = mongoose.model("transaksi", transaksiSchema);

module.exports = Transaksi;
