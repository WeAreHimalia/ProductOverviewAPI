const fs = require('fs');
const csv = require('csvtojson');
const { CartItem, Product } = require('./server/db.js');

// ETL products.csv into products collection
const addProducts = async () => {
  let readable = fs.createReadStream('./data_files/product.csv').pipe(csv());
  await readable.on('data', (row) => {
    var data = JSON.parse(row.toString());
    data.campus = 'hr-rpp';
    data.product_id = data.id;
    data.id = parseInt(data.id);
    data.features = [];
    data.results = [];
    data.related = [];
    readable.pause();
    var newProduct = new Product(data);
    newProduct.save()
    .then(results => {
      readable.resume();
    })
    .catch(err => console.log('error: ', err));
  });
  readable.on('end', () => {
    console.log('CSV file successfully processed');
  });
  readable.on('error', () => {
    console.log("Error Processing the CSV file correctly");
  });
}

// ETL styles into associated product in the products collection
const addStyles = async () => {
  let readable = fs.createReadStream('./data_files/styles.csv').pipe(csv());
  await readable.on('data', (row) => {
    var data = JSON.parse(row.toString());
    data.style_id = parseInt(data.id);
    data['default?'] = false;
    data.default_style === '1' ? data['default?'] = true : null;
    data.photos = [];
    data.sale_price === 'null' ? data.sale_price = null : null;
    delete data.default_style;
    var product_id = data.productId;
    delete data.productId;
    delete data.id;
    readable.pause();
    Product.findOneAndUpdate({ product_id: product_id }, { $push: { results: data } })
    .then(results => {
      readable.resume();
    })
    .catch(err => console.log('error: ', err));
  });
  readable.on('end', () => {
    console.log('CSV file successfully processed');
  });
  readable.on('error', () => {
    console.log("Error Processing the CSV file correctly");
  });
}

// ETL photos.csv into the products collection (products.results)
const addPhotos = async () => {
  let readable = fs.createReadStream('./data_files/photos.csv').pipe(csv());
  await readable.on('data', (row) => {
    var data = JSON.parse(row.toString());
    var style_id = data.styleId;
    delete data.styleId;
    delete data.id;
    readable.pause();
    Product.findOneAndUpdate({ "results.style_id": style_id }, { $push: { "results.$.photos": data } })
    .then(results => {
      readable.resume();
    })
    .catch(err => console.log('error: ', err));
  });
  readable.on('end', () => {
    console.log('CSV file successfully processed');
  });
  readable.on('error', () => {
    console.log("Error Processing the CSV file correctly");
  });
}

// ETL features.csv into the products collection
const addFeatures = async () => {
  let readable = fs.createReadStream('./data_files/features.csv').pipe(csv());
  await readable.on('data', (row) => {
    var data = JSON.parse(row.toString());
    var product_id = data.product_id;
    delete data.product_id;
    delete data.id;
    readable.pause();
    Product.findOneAndUpdate({ product_id: product_id }, { $push: { features: data } })
    .then(results => {
      readable.resume();
    })
    .catch(err => console.log('error: ', err));
  });
  readable.on('end', () => {
    console.log('CSV file successfully processed');
  });
  readable.on('error', () => {
    console.log("Error Processing the CSV file correctly");
  });
}

// ETL related.csv into the products collection
const addRelatedProducts = async () => {
  let readable = fs.createReadStream('./data_files/related.csv').pipe(csv());
  await readable.on('data', (row) => {
    var data = JSON.parse(row.toString());
    var product_id = data.current_product_id;
    readable.pause();
    Product.findOneAndUpdate({ product_id: product_id }, { $push: { related: parseInt(data.related_product_id) } })
    .then(results => {
      readable.resume();
    })
    .catch(err => console.log('error: ', err));
  });
  readable.on('end', () => {
    console.log('CSV file successfully processed');
  });
  readable.on('error', () => {
    console.log("Error Processing the CSV file correctly");
  });
}

// ETL skus.csv into the products collection
const addSkus = async () => {
  let readable = fs.createReadStream('./data_files/skus.csv').pipe(csv());
  await readable.on('data', (row) => {
    var data = JSON.parse(row.toString());
    var style_id = data.styleId;
    delete data.styleId;
    var sku_id = data.id;
    delete data.id;
    data.quantity = parseInt(data.quantity);
    readable.pause();
    Product.findOneAndUpdate({ "results.style_id": style_id }, { $set: { ["results.$.skus." + sku_id]: data } })
    .then(results => {
      readable.resume();
    })
    .catch(err => console.log('error: ', err));
  });
  readable.on('end', () => {
    console.log('CSV file successfully processed');
  });
  readable.on('error', () => {
    console.log("Error Processing the CSV file correctly");
  });
}

// Asynchronously call each function to add items to database;
const addData = async () => {
  await addProducts();
  await addStyles();
  await addPhotos();
  await addFeatures();
  await addRelatedProducts();
  await addSkus();
}

addData();


// For single product testing
// var testProduct1 = {
//   product_id: 11111,
//   campus: "rpp2207",
//   name: "Calvin's shoes",
//   slogan: "Yeah boi, shoes!",
//   description: "These are Calvin's shoes.",
//   category: "Shoes",
//   default_price: "99.99",
//   created_at: "2022-05-11T19:38:15.373Z",
//   updated_at: "2022-05-11T19:38:15.373Z",
//   features: [
//     {
//       feature_id: 55555,
//       feature: "Soul",
//       value: "Rubber"
//     }
//   ],
//   results: [
//     {
//       style_id: 11119,
//       name: "Black & White",
//       original_price: "100.00",
//       sale_price: null,
//       default: true,
//       photos: [
//         {
//           thumbnail_url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
//           url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
//         }
//       ],
//       skus: {
//         "1111111": {
//           quantity: 1,
//           size: "XL"
//         }
//       }
//     }
//   ],
//   related: [22222, 33333]
// }
// var testProduct2 = {
//   product_id: 22222,
//   campus: "rpp2207",
//   name: "Calvin's pants",
//   slogan: "Yeah boi, pants!",
//   description: "These are Calvin's pants.",
//   category: "Pants",
//   default_price: "99.99",
//   created_at: "2022-05-11T19:38:15.373Z",
//   updated_at: "2022-05-11T19:38:15.373Z",
//   features: [
//     {
//       feature_id: 66666,
//       feature: "Fabric",
//       value: "Tweed"
//     }
//   ],
//   results: [
//     {
//       style_id: 22229,
//       name: "Green",
//       original_price: "100.00",
//       sale_price: null,
//       default: true,
//       photos: [
//         {
//           thumbnail_url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
//           url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
//         }
//       ],
//       skus: {
//         "2222222": {
//           quantity: 5,
//           size: "XL"
//         }
//       }
//     }
//   ],
//   related: [11111, 33333]
// }
// var testProduct3 = {
//   product_id: 33333,
//   campus: "rpp2207",
//   name: "Calvin's hat",
//   slogan: "Yeah boi, hat!",
//   description: "This is Calvin's hat.",
//   category: "Hat",
//   default_price: "25.00",
//   created_at: "2022-05-11T19:38:15.373Z",
//   updated_at: "2022-05-11T19:38:15.373Z",
//   features: [
//     {
//       feature_id: 77777,
//       feature: "Style",
//       value: "Dad"
//     }
//   ],
//   results: [
//     {
//       style_id: 22229,
//       name: "Gray",
//       original_price: "25.00",
//       sale_price: null,
//       default: true,
//       photos: [
//         {
//           thumbnail_url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80",
//           url: "https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
//         }
//       ],
//       skus: {
//         "3333333": {
//           quantity: 5,
//           size: "XL"
//         }
//       }
//     }
//   ],
//   related: [11111, 22222]
// }

// const addTestData = () => {
//   Product.insertMany([testProduct1, testProduct2, testProduct3])
//   .then(() => {
//     console.log('data inserted')
//   })
//   .catch((err) => {
//     console.log('error: ', err)
//   })
// }

