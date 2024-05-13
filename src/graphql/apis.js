const { default: axios } = require("axios");

exports.getAllBarang = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/master-management/barang"
    );

    console.log("Berhasil memuat data Barang");
    const barang = response.data.data;
    return barang;
  } catch (error) {
    console.log(`Gagal mendapatkan data Barang: ${error.message}`);
    throw error;
  }
};

exports.getDetailBarang = async (rfid) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/master-management/barang/${rfid}`
    );

    console.log("Berhasil memuat data Detail Barang");
    const barang = response.data.data;
    return barang;
  } catch (error) {
    console.log(`Gagal mendapatkan data Detail Barang: ${error.message}`);
    throw error;
  }
};

exports.getCustomerTransaksi = async (qrcode) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/transaksi-management/customer-transaksi?qrcode=${qrcode}`
    );

    console.log("Berhasil mendapatkan data Customer Transaksi");
    const transaksi = response.data.data;
    return transaksi;
  } catch (error) {
    console.log(`Gagal mendapatkan data Customer Transaksi: ${error.message}`);
    throw error;
  }
};

exports.saveTransaksiToPostgre = async (transaksi) => {
  await axios
    .post("http://localhost:8080/transaksi-management/transaksi", transaksi)
    .then((response) => {
      console.log("Data transaksi berhasil disimpan ke PostgreSQL");
    })
    .catch((error) => {
      console.log(
        `Gagal menyimpan data transaksi ke PostgreSQL: ${error.message}`
      );
    });
};
