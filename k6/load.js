import http from 'k6/http';
import { check, sleep } from 'k6';

var testLength = .5

const getStartTimeString = (multiplier) => {
  var waitTime = testLength * multiplier;
  var str = '';
  str += Math.floor(waitTime) + 'm';
  var sec = (waitTime - Math.floor(waitTime)) * 60;
  str += sec + 's';
  return str;
}

const getScenarioOptions = (funcName, startTime) => {
  var options = {
    executor: 'constant-arrival-rate',
    duration: '30s',
    rate: 1100,
    timeUnit: '1s',
    preAllocatedVUs: 1,
    maxVUs: 20000,
    exec: funcName, // same function as the scenario above, but with different env vars
    startTime: startTime
  }
  return options;
}

export const options = {
  scenarios: {
    api_product: getScenarioOptions('productAPI', getStartTimeString(0)),
    api_styles: getScenarioOptions('stylesAPI', getStartTimeString(1)),
    api_related: getScenarioOptions('relatedAPI', getStartTimeString(2)),
    api_cart_get: getScenarioOptions('cartAPI_GET', getStartTimeString(3)),
    api_cart_post: getScenarioOptions('cartAPI_POST', getStartTimeString(4)),
    api_cart_delete: getScenarioOptions('cartAPI_DELETE', getStartTimeString(5))
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'count'],
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration': ['p(99)<2000']
  },
};

var id = 1000011
const BASE_URL = 'http://localhost:3030';

for (let key in options.scenarios) {
  // Each scenario automaticall tags the metrics it generates with its own name
  let reqDurationName = `http_req_duration{scenario:${key}}`;
  let reqFailedName = `http_req_failed{scenario:${key}}`;
  // Check to prevent us from overwriting a threshold that already exists
  if (!options.thresholds[reqDurationName]) {
      options.thresholds[reqDurationName] = [];
  }
  if (!options.thresholds[reqFailedName]) {
    options.thresholds[reqFailedName] = [];
  }
}

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