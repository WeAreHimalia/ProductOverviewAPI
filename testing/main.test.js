const server = require('../server/index.js').server;
const mongoose = require('mongoose');
const request = require('supertest');

beforeAll(() => {
  const mongoDB = "mongodb://127.0.0.1/sdc";
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
})

afterAll(done => {
  server.close();
  mongoose.connection.close()
  done();
});

describe('GET /products/id', () => {
  it('should return the requested product', async () => {
    const res = await request(server).get('/products/3');
    expect(res.statusCode).toBe(200);
    expect(res.body.product_id).toEqual(3);
  });
});

describe('GET /products/id2', () => {
  it('should return the requested product', async () => {
    const res = await request(server).get('/products/2');
    expect(res.statusCode).toBe(200);
    expect(res.body.product_id).toEqual(2);
  });
});

describe('GET /products/id3', () => {
  it('should return the requested product', async () => {
    const res = await request(server).get('/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.product_id).toEqual(1);
  });
});