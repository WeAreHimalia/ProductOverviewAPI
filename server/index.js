const express = require('express');
const { Cart, Product } = require('./db.js');
// const db2 = require('./db2.js');
const app = express();
const port = 3030;

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/loaderio*', (req, res) => {
  res.status(200).download('./loaderio-000c030e4afab49efcc48d99e9c8a735.txt')
})

app.get('/products/:id', (req, res) => {
  Product.findOne({product_id: req.params.id}).lean()
  .then((data) => {
    data.id = data.product_id;
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send(`${err}`);
  });
});

app.get('/products/:id/styles', (req, res) => {
  Product.findOne({product_id: req.params.id}).lean()
  .then((data) => {
    var id_string = data.product_id.toString();
    data.product_id = id_string;
    if (data.results.length === 0) {
      data.results.push(
        {
          "style_id": 999999999,
          "name": "Aaron",
          "original_price": "999",
          "sale_price": null,
          "default?": true,
          "photos": [
              {
                  "thumbnail_url": "https://ca.slack-edge.com/T5B2RG0JW-U03P8D7RN6S-0c1ef7a3f508-512",
                  "url": "https://ca.slack-edge.com/T5B2RG0JW-U03P8D7RN6S-0c1ef7a3f508-512",
              }
          ],
          "skus": {
              "999999999": {
                  "size": "Xtra M",
                  "quantity": 999
              }
          }
        }
      )
    }
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send(`${err}`);
  });
});

app.get('/products/:id/related', (req, res) => {
  Product.findOne({product_id: req.params.id}).lean()
  .then((data) => {
    res.status(200).send(data.related);
  })
  .catch((err) => {
    res.status(500).send(`${err}`);
  });
});

app.get('/cart', (req, res) => {
  Cart.find({}).lean()
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    res.status(500).send(`${err}`);
  });
});

app.post('/cart', (req, res) => {
  var sku = req.body.sku_id;
  if (!sku) {
    res.status(500).send('Error: Items added to cart need a SKU number.')
  } else {
    Cart.findOneAndUpdate({
      sku_id: sku
    }, {
      $inc: {
        count: 1
      }
    }, { upsert: true })
    .then((data) => {
      res.status(201).send();
    })
  }
});

app.delete('/cart', (req, res) => {
  Cart.deleteMany({})
  .then((data) => {
    res.status(200).send();
  })
  .catch((err) => {
    res.status(500).send(`${err}`);
  });
})

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})


module.exports = { server };