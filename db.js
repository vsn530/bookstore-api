const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore";

let dbConnection;
module.exports = {
  connectToDB: (cb) => {
    MongoClient.connect(mongoURI)
      .then((client) => {
        dbConnection = client.db("bookstore");
        return cb();
      })
      .catch((err) => {
        console.log("Error", err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
