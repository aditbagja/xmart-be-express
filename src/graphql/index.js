const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");
const {
  TransaksiType,
  TransaksiInputType,
  BarangType,
  CartType,
  CartInputType,
} = require("./types");
const Transaksi = require("../model/transaksi");
const redisClient = require("../configuration/redis");
const {
  saveTransaksiToPostgre,
  getAllBarang,
  getDetailBarang,
} = require("./apis");

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Mutation Schema",
  fields: {
    checkinBarang: {
      type: new GraphQLList(CartType),
      args: {
        barang: {
          type: CartInputType,
        },
      },
      resolve: async (root, params) => {
        try {
          const request = params.barang;

          let cartExist = JSON.parse(
            await redisClient.get(`cart - ${request.qrcode}`)
          );

          const barang = await getDetailBarang(request.rfid);
          const newBarang = {
            ...barang,
            jumlah: 1,
          };

          console.log("Berhasil checkin barang ke Redis");

          if (cartExist) {
            cartExist.map((data) => {
              if (request.rfid === data.rfid) {
                data.jumlah = data.jumlah + request.jumlah;
                return cartExist;
              }
            });

            if (!cartExist.some((data) => data.rfid === request.rfid)) {
              cartExist.push(newBarang);
            }

            redisClient.set(
              `cart - ${request.qrcode}`,
              JSON.stringify(cartExist)
            );

            return cartExist;
          } else {
            let newCart = [];

            newCart.push(newBarang);
            redisClient.set(
              `cart - ${request.qrcode}`,
              JSON.stringify(newCart)
            );

            return newCart;
          }
        } catch (error) {
          console.log(`Gagal checkin barang ke Redis: ${error.message}`);
          throw error;
        }
      },
    },
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
                qrcode: newTransaksi.qrcode,
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
                listTransaksiCached.push(newTransaksi);
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
    allBarang: {
      type: new GraphQLList(BarangType),
      resolve: async (parent, args) => {
        const cachedBarang = JSON.parse(await redisClient.get("list-barang"));

        if (cachedBarang) {
          console.log("Berhasil mendapatkan data barang dari Cache");
          return cachedBarang;
        }

        const barang = await getAllBarang();
        redisClient.set("list-barang", JSON.stringify(barang));

        return barang;
      },
    },
    barangById: {
      type: BarangType,
      args: {
        rfid: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (root, params) => {
        const cachedBarang = JSON.parse(
          await redisClient.get(`barang - ${params.rfid}`)
        );

        if (cachedBarang) {
          console.log("Berhasil mendapatkan data detail barang dari Cache");
          return cachedBarang;
        }

        const detailBarang = await getDetailBarang(params.rfid);
        redisClient.set(
          `barang - ${params.rfid}`,
          JSON.stringify(detailBarang)
        );

        return detailBarang;
      },
    },
    allTransaksi: {
      type: new GraphQLList(TransaksiType),
      resolve: async (parent, args) => {
        const cachedTransaksi = JSON.parse(
          await redisClient.get("list-transaksi")
        );

        if (cachedTransaksi) {
          console.log("Berhasil mendapatkan data transaksi dari Cache");
          return cachedTransaksi;
        }

        const listTransaksi = await Transaksi.find({});
        redisClient.set("list-transaksi", JSON.stringify(listTransaksi));

        return listTransaksi;
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
          console.log("Berhasil mendapatkan data detail transaksi dari Cache");
          return cachedTransaksi;
        }

        const detailTransaksi = Transaksi.findById(params.id);
        redisClient.set(
          `transaksi - ${params.id}`,
          JSON.stringify(detailTransaksi)
        );

        return detailTransaksi;
      },
    },
    userCart: {
      type: new GraphQLList(CartType),
      args: {
        qrcode: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (root, params) => {
        const cart = JSON.parse(
          await redisClient.get(`cart - ${params.qrcode}`)
        );

        console.log("Berhasil mendapatkan data Cart");

        return cart;
      },
    },
  },
});

const RootSchema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

module.exports = { RootSchema };
