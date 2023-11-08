const express = require("express");
const app = express();
const port = process.emitWarning.env || 5000;

app.get("/", (req, res) => {
  res.send("This is service sharing server site");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
