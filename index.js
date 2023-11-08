const express = require("express");
const app = express();
let cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is service sharing server site");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
