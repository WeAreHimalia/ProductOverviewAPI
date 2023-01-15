const express = require('express');
const db = require('./db.js');
// const db2 = require('./db2.js');
const app = express();
const port = 3030;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})