const express = require("express");
const cors = require("cors");
const Transaction = require("./Models/Transaction");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const app = express();

app.options("*", cors());
app.use(cors());
app.use(express.json());
app.get("/api/test", (req, res) => {
  res.json("test ok....");
  console.log("server running...");
});

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const { name, description, datetime, price } = req.body;

  const transaction = await Transaction.create({
    name,
    description,
    datetime,
    price,
  });

  // console.log(req.body);
  try {
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Invalid JSON" });
  }
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);

  const transactions = await Transaction.find();

  res.json(transactions);
});

app.listen(4000);
// aQPLiMyuDXCbIjBy;
