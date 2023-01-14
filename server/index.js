const express = require('express');
const db = require('./db.js');
const db2 = require('./db2.js');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/products', (req, res) => {
  res.send('/products API route');
})

app.get('/products/:id', (req, res) => {
  res.send(`/products/:id API route for ${req.params.id}`);
})

app.get('/products/::id/styles', (req, res) => {
  res.send(`/products/:id/styles API route for ${req.params.id}`);
})

app.get('/products/::id/related', (req, res) => {
  res.send(`/products/:id/related API route for ${req.params.id}`);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})