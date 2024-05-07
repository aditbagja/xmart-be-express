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

const CartType = new GraphQLObjectType({
  name: "Cart",
  description: "Cart Schema",
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
    jumlah: {
      type: GraphQLInt,
    },
  },
});

const CartInputType = new GraphQLInputObjectType({
  name: "CartInput",
  description: "Cart Input Schema",
  fields: {
    qrcode: {
      type: GraphQLString,
    },
    rfid: {
      type: GraphQLString,
    },
    namaBarang: {
      type: GraphQLString,
    },
    hargaSatuan: {
      type: GraphQLInt,
    },
    jumlah: {
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
    qrcode: {
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
    qrcode: {
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

module.exports = {
  BarangType,
  CartType,
  CartInputType,
  TransaksiType,
  TransaksiInputType,
};
