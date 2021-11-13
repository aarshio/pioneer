const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

const uri = process.env.URI;
const client = new MongoClient(uri);
client.connect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/trades/history/all", async (req, res) => {
  const database = client.db("trades");
  const collection = database.collection("history");
  const findResult = await collection.find({}).toArray();
  res.send(findResult);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
