const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");
const { TransaksiType, TransaksiInputType } = require("./types");
const Transaksi = require("../model/transaksi");
const redisClient = require("../configuration/redis");
const { default: axios } = require("axios");

const saveTransaksiToPostgre = async (transaksi) => {
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

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Mutation Schema",
  fields: {
    tambahTransaksi: {
      type: new GraphQLList(TransaksiType),
      args: {
        transaksi: { type: new GraphQLList(TransaksiInputType) },
      },
      resolve: async (root, params) => {
        try {
          const response = await Promise.all(
            params.transaksi.map(async (data) => {
              const newTransaksi = await new Transaksi(data).save();

              let IdString = newTransaksi._id.toString();

              const transaksiRequest = {
                transaksiId: IdString,
                qrcode: newTransaksi.qrCode,
                rfid: newTransaksi.rfid,
                jumlah: newTransaksi.jumlah,
              };

              saveTransaksiToPostgre(transaksiRequest);
              redisClient.set(
                `transaksi - ${IdString}`,
                JSON.stringify(newTransaksi)
              );

              let listTransaksiCached = JSON.parse(
                await redisClient.get("list-transaksi")
              );

              if (!listTransaksiCached) {
                listTransaksiCached = [];
              }

              listTransaksiCached.push(newTransaksi);
              redisClient.set(
                "list-transaksi",
                JSON.stringify(listTransaksiCached)
              );

              return newTransaksi;
            })
          );

          console.log(
            `Berhasil menyimpan data transaksi: ${JSON.stringify(
              params.transaksi
            )}`
          );

          return response;
        } catch (error) {
          console.log(`Gagal menyimpan data transaksi: ${error.message}`);
          throw error;
        }
      },
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "Query Schema",
  fields: {
    allTransaksi: {
      type: new GraphQLList(TransaksiType),
      resolve: async (parent, args) => {
        const cachedTransaksi = JSON.parse(
          await redisClient.get("list-transaksi")
        );
        if (cachedTransaksi) {
          return cachedTransaksi;
        }
        return Transaksi.find({});
      },
    },
    transaksiById: {
      type: TransaksiType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (root, params) => {
        const cachedTransaksi = JSON.parse(
          await redisClient.get(`transaksi - ${params.id}`)
        );
        if (cachedTransaksi) {
          return cachedTransaksi;
        }
        return Transaksi.findById(params.id);
      },
    },
  },
});

const RootSchema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

module.exports = { RootSchema };
