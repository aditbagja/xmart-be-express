const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const BarangType = new GraphQLObjectType({
  name: "Barang",
  description: "Barang Schema",
  fields: {
    rfid: {
      type: GraphQLString,
    },
    namaBarang: {
      type: GraphQLString,
    },
    hargaSatuan: {
      type: GraphQLInt,
    },
  },
});

const TransaksiType = new GraphQLObjectType({
  name: "Transaksi",
  description: "Transaksi Schema",
  fields: {
    _id: {
      type: GraphQLID,
    },
    qrCode: {
      type: GraphQLString,
    },
    rfid: {
      type: GraphQLString,
    },
    hargaSatuan: {
      type: GraphQLInt,
    },
    jumlah: {
      type: GraphQLInt,
    },
    waktuPesan: {
      type: GraphQLString,
    },
  },
});

const TransaksiInputType = new GraphQLInputObjectType({
  name: "TransaksiInput",
  description: "Transaksi Input Schema",
  fields: {
    qrCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    rfid: {
      type: new GraphQLNonNull(GraphQLString),
    },
    hargaSatuan: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    jumlah: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});

module.exports = { BarangType, TransaksiType, TransaksiInputType };
