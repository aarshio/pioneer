const express = require("express");
const { MongoClient } = require("mongodb");
var cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());

const uri = process.env.URI;
const client = new MongoClient(uri);
client.connect();

app.get("/", (req, res) => {
  res.send("👽 Pioneer 10.1");
});

app.get("/trades/history/all", async (req, res) => {
  const database = client.db("trades");
  const historyCollection = database.collection("history");
  const freshCollection = database.collection("fresh");

  const findResult = await historyCollection.find({}).toArray();
  const lastRun = await freshCollection.findOne({ _id: "history" });
  res.send({ lastRun: lastRun, rows: findResult });
});

app.listen(port, () => {
  console.log(`Pioneer listening at http://localhost:${port}`);
});
