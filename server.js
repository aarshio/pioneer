const express = require("express");
const { MongoClient } = require("mongodb");
var cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
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

app.get("/universe/all", async (req, res) => {
  const database = client.db("universe");
  const allCollection = database.collection("all");
  const freshCollection = database.collection("fresh");

  const findResult = await allCollection.find({}).toArray();
  const lastRun = await freshCollection.findOne({ _id: "all" });
  res.send({ lastRun: lastRun, rows: findResult });
});

app.get("/universe/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const database = client.db("universe");
  const allCollection = database.collection("all");
  const findResult = await allCollection.findOne({ _id: symbol });
  res.send(findResult);
});

app.post("/post", async (req, res) => {
  const reqData = req.body;
  const secretDatabase = client.db("secrets");
  const secretsCollection = secretDatabase.collection("one");
  const secret = await secretsCollection.findOne({ _id: "secret" });
  if (reqData["secret"] === secret["value"]) {
    const postsDatabase = client.db("posts");
    const allCollections = postsDatabase.collection("all");
    const post = await allCollections.insertOne({
      symbol: reqData["symbol"].toLowerCase(),
      timestamp: new Date().getTime(),
      data: reqData["data"],
    });
    res.send(post);
  } else {
    res.send("💩");
  }
});

app.get("/posts/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toLowerCase();
  const database = client.db("posts");
  const allCollections = database.collection("all");
  const findResult = await allCollections
    .find({ symbol: symbol })
    .sort({ timestamp: -1 })
    .toArray();
  res.send(findResult);
});

app.listen(port, () => {
  console.log(`Pioneer listening at http://localhost:${port}`);
});
