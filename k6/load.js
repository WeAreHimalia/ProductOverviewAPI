import http from 'k6/http';
import { check, sleep } from 'k6';

const getScenarioOptions = (funcName) => {
  var options = {
    executor: 'ramping-arrival-rate',
    startTime: '1s', // the ramping API test starts a little later
    startRate: 50,
    timeUnit: '1s', // we start at 50 iterations per second
    stages: [
      { target: 100, duration: '30s' }, // go from 50 to 200 iters/s in the first 30 seconds
      { target: 100, duration: '3m30s' }, // hold at 200 iters/s for 3.5 minutes
      { target: 0, duration: '30s' }, // ramp down back to 0 iters/s over the last 30 second
    ],
    preAllocatedVUs: 300, // how large the initial pool of VUs would be
    maxVUs: 600, // if the preAllocatedVUs are not enough, we can initialize more
    tags: { test_type: 'api' }, // different extra metric tags for this scenario
    exec: funcName, // same function as the scenario above, but with different env vars
  }
  return options;
}

export const options = {
  scenarios: {
    api_product: getScenarioOptions('productAPI'),
    api_styles: getScenarioOptions('stylesAPI'),
    api_related: getScenarioOptions('relatedAPI'),
    api_cart_get: getScenarioOptions('cartAPI_GET'),
    api_cart_post: getScenarioOptions('cartAPI_POST'),
    api_cart_delete: getScenarioOptions('cartAPI_DELETE')
  },
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration': ['p(99)<2000'] // 99% of requests must complete below 1.5s
  },
};

var id = 1000011
const BASE_URL = 'http://localhost:3030';

export function productAPI() {

  const res = http.get(`${BASE_URL}/products/${id.toString()}`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  id--
  sleep(1);
};

export function stylesAPI() {
  const res = http.get(`${BASE_URL}/products/${id.toString()}/styles`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  id--
  sleep(1);
};

export function relatedAPI() {
  const res = http.get(`${BASE_URL}/products/${id.toString()}/styles`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  id--
  sleep(1);
};

export function cartAPI_GET() {
  const res = http.get(`${BASE_URL}/cart`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
};

export function cartAPI_POST() {
  const payload = JSON.stringify({
    sku_id: id,
    count: 1
  })
  const res = http.post(`${BASE_URL}/cart`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, {
    'is status 201': (r) => r.status === 201,
  });
  id--
  sleep(1);
};

export function cartAPI_DELETE() {
  const res = http.del(`${BASE_URL}/cart`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
};