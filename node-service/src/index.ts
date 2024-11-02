import express from "express";
import "dotenv/config";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Node.js!");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Node.js app listening on port ${port}`);
});
