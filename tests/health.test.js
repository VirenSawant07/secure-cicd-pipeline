'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/index');

function request(path) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      http.get(`http://127.0.0.1:${port}${path}`, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          server.close();
          resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
        });
      }).on('error', (err) => {
        server.close();
        reject(err);
      });
    });
  });
}

describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const { statusCode, body } = await request('/health');
    assert.equal(statusCode, 200);
    assert.equal(body.status, 'ok');
    assert.ok(body.uptime >= 0);
    assert.ok(body.timestamp);
  });
});

describe('GET /api/v1/info', () => {
  it('should return 200 with app info', async () => {
    const { statusCode, body } = await request('/api/v1/info');
    assert.equal(statusCode, 200);
    assert.equal(body.name, 'secure-cicd-app');
    assert.ok(body.version);
    assert.equal(body.internalSecret, undefined);
  });
});

describe('GET /nonexistent', () => {
  it('should return 404', async () => {
    const { statusCode, body } = await request('/nonexistent');
    assert.equal(statusCode, 404);
    assert.equal(body.error, 'Not Found');
  });
});
