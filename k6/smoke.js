import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';

export const options = {
  vus: 1, // 1 user looping for 1 minute
  duration: '1m',

  thresholds: {
    http_req_duration: ['p(99)<2000'], // 99% of requests must complete below 1.5s
  },
};

var id = 1000011
const BASE_URL = 'http://localhost:3030';

export default () => {

  const myObjects = http.get(`${BASE_URL}/products/${id.toString()}`).json();
  check(myObjects, { 'retrieved product': (obj) => obj.product_id = id });
  id--
  sleep(1);
};