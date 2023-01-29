const server = require('../server/index.js').server;
const mongoose = require('mongoose');
const request = require('supertest');


afterAll( async () => {
  server.close();
  await mongoose.connection.close();
});

describe('GET /products/id', () => {
  it('should return the correct statusCode', async () => {
    const res = await request(server).get('/products/1');
    expect(res.statusCode).toBe(200);
  });
});

/******************** PRODUCTS ********************/

describe('GET /products/id', () => {
  it('should return the correct statusCode and data for the requested product_id', async () => {
    const res = await request(server).get('/products/1000011');
    expect(res.statusCode).toBe(200);
    expect(res.body.product_id).toBe(1000011);
    expect(res.body.name).toBe('Evangeline Shoes');
    expect(res.body.features.length).toBe(1);
  });
});

describe('GET /products/id TypeError', () => {
  it('should return the correct statusCode and error message for a product that does not exist', async () => {
    const res = await request(server).get('/products/0');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe(`TypeError: Cannot read properties of null (reading 'product_id')`);
  });
});

describe('GET /products/id CastError ', () => {
  it('should return the correct statusCode and error message for an incorrect data type', async () => {
    const res = await request(server).get('/products/asdf');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe(`CastError: Cast to Number failed for value "asdf" (type string) at path "product_id" for model "Products"`);
  });
});

/******************** STYLES ********************/

describe('GET /products/id/styles', () => {
  it('should return the correct statusCode and data for the requested product_id', async () => {
    const res = await request(server).get('/products/1000011/styles');
    expect(res.body.results.length).toBe(5);
    expect(res.body.results[0].style_id).toBe(1958098);
    expect(res.body.results[0].photos.length).toBe(4);
    expect(res.body.results[0].skus[11323863].size).toBe('7');
  });
});

describe('GET /products/id/styles TypeError', () => {
  it('should return the correct statusCode and error message for a product that does not exist', async () => {
    const res = await request(server).get('/products/0/styles');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe(`TypeError: Cannot read properties of null (reading 'product_id')`);
  });
});

describe('GET /products/id/styles CastError ', () => {
  it('should return the correct statusCode and error message for an incorrect data type', async () => {
    const res = await request(server).get('/products/asdf/styles');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe(`CastError: Cast to Number failed for value "asdf" (type string) at path "product_id" for model "Products"`);
  });
});

describe('GET /products/id/styles with no styles', () => {
  it('should append the dummy style data if the product does not have any styles', async () => {
    const res = await request(server).get('/products/1000010/styles');
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].style_id).toBe(999999999);
    expect(res.body.results[0].skus[999999999].size).toBe('Xtra M');
  })
})
/******************** RELATED ********************/

describe('GET /products/id/related', () => {
  it('should return the correct statusCode and related products data for the requested product_id', async () => {
    const res = await request(server).get('/products/1000011/related');
    expect(res.body).toEqual([275004, 93556, 125885, 166656, 875619, 592637]);
  });
});

describe('GET /products/id/related TypeError', () => {
  it('should return the correct statusCode and error message for a product that does not exist', async () => {
    const res = await request(server).get('/products/0/related');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe(`TypeError: Cannot read properties of null (reading 'related')`);
  });
});

describe('GET /products/id/related CastError ', () => {
  it('should return the correct statusCode and error message for an incorrect data type', async () => {
    const res = await request(server).get('/products/asdf/related');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe(`CastError: Cast to Number failed for value "asdf" (type string) at path "product_id" for model "Products"`);
  });
});

/******************** CART ********************/

describe('POST /cart', () => {
  it('should return the correct statusCode and add item to cart database ', async () => {
    var cartItem = {
      sku_id: 12345,
      count: 1
    }
    const res = await request(server).post('/cart').send(cartItem);
    expect(res.statusCode).toBe(201);
  });
});

describe('POST /cart with incorrect data format', () => {
  it('should return the correct statusCode and error message for an incorrect data format', async () => {
    var cartItem = 'Incorrect data'
    const res = await request(server).post('/cart').send(cartItem);
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe(`Error: Items added to cart need a SKU number.`);
  });
});

describe('GET /cart', () => {
  it('should return the correct statusCode and data for the requested product_id', async () => {
    const res = await request(server).get('/cart');
    expect(res.statusCode).toBe(200);
    expect(res.body[res.body.length - 1].sku_id).toBe(12345);
  });
});

describe('GET /cart', () => {
  it('should return the correct statusCode and data for the requested product_id', async () => {
    const res = await request(server).get('/cart');
    expect(res.statusCode).toBe(200);
    expect(res.body[res.body.length - 1].sku_id).toBe(12345);
  });
});

describe('DELETE /cart', () => {
  it('should delete all items from the cart collection', async () => {
    const delRes = await request(server).delete('/cart');
    expect(delRes.statusCode).toBe(200);
    const newRes = await request(server).get('/cart');
    expect(newRes.body.length).toBe(0);
  });
});
