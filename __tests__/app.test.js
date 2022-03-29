const db = require('../db/connection');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe('general errors when requesting', () => {
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

describe.only('GET/api/articles/:article_id', () => {
    test('should respond with a single matching article when a valid id is requested', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
            const expected = {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100
              }
            expect(res.body.article).toEqual(expected);
        })
    })
    test('status 400: should respond with a bad request message when an invalid id is requested', () => {
        return request(app)
        .get('/api/articles/invalidId')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toMatch('Bad request')
        })
    })
    test.only('status 404: should respond with a article not found message when an id that does not exist is requested', () => {
        return request(app)
        .get('/api/articles/444')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toEqual('Article not found')
        })
    })
})