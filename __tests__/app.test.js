const db = require('../db/connection');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe.skip('GET/api/topics', () => {
    test('should return an object', () => {
        
    })
})