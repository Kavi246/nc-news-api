const db = require('../db/connection');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe.only('general errors when requesting', () => {
    test('correct 404 response when a path is not found', () => {
        const invalidPath = "/app/tropics"
        return request(app)
        .get(invalidPath)
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe('path not found')
        })
    })
})

describe('GET/api/topics', () => {
    test('should respond with an array of objects when the request is succesful', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body)).toBe(true);
        })
    })
    test('each topic object should have slug property and a description property', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            response.body.forEach((topic) => {
                expect(topic).toEqual({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })

})