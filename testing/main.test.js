const server = require('../server/index.js').server;
const mongoose = require('mongoose');
const request = require('supertest');


beforeAll( async () => {
  const mongoDB = "mongodb://127.0.0.1/sdc";
  await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
})

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

describe('GET /products/id', () => {
  it('should return the product of the requested product_id', async () => {
    const res = await request(server).get('/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.product_id).toBe(1);
    expect(res.body.name).toBe('Camo Onesie');
    expect(res.body.features.length).toBe(2);
  });
});

describe('GET /products/id/styles', () => {
  it('should return the styles of the requested product_id', async () => {
    const res = await request(server).get('/products/1/styles');
    expect(res.body.results.length).toBe(6);
    expect(res.body.results[0].style_id).toBe(1);
    expect(res.body.results[0].photos.length).toBe(6);
    expect(res.body.results[0].skus[1].size).toBe('XS');
  });
});

describe('GET /products/id/related', () => {
  it('should return the related products of the requested product_id', async () => {
    const res = await request(server).get('/products/1/related');
    expect(res.body).toEqual([2, 3, 8, 7]);
  });
});