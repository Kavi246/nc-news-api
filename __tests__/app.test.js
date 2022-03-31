const db = require('../db/connection');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');
const res = require('express/lib/response');

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
    describe('status 200: ', () => {
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
                    votes: 100,
                    comment_count: 11
                }
                expect(res.body.article).toEqual(expected);
            })
        })
        test('the comment count property should be 0 if an article with no comments is chosen', () => {
            return request(app)
            .get('/api/articles/4')
            .expect(200)
            .then((res) => {
                const chosenArticle = res.body.article
                expect(chosenArticle.comment_count).toEqual(0);
            })
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
    test('status 404: should respond with an article not found message when an id that does not exist is requested', () => {
        return request(app)
        .get('/api/articles/444')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toEqual('Article not found')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('status 200: updates the valid article and responds with that article.', () => {
        const incrementVotes = { inc_votes: 52 }
        return request(app)
        .patch('/api/articles/4')
        .send(incrementVotes)
        .expect(200)
        .then((res) => {
            const expected = {
                article_id: 4,
                title: 'Student SUES Mitch!',
                topic: 'mitch',
                author: 'rogersop',
                body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
                created_at: '2020-05-06T01:14:00.000Z',
                votes: 52
              }
            expect(res.body.updatedArticle).toEqual(expected)

        })
    })
    test('status 400: responds with a custom error message when the request body does not match our format' , () => {
        const invalidIncrementVotes = ['inc_votes', 108]
        return request(app)
        .patch('/api/articles/7')
        .send(invalidIncrementVotes)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('patch request body incorrectly formatted')
        })
    })
    test('status 400: responds with a custom error message when the vote increment value is not a number' , () => {
        const invalidIncrementVotes = {inc_votes :"o' hunnid"}
        return request(app)
        .patch('/api/articles/7')
        .send(invalidIncrementVotes)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('value for the vote increment must be a number!')
        })
    })
    test('status 404: responds with an article not found message when an id that does not exist is requested' , () => {
        const incrementVotes = {inc_votes : 27}
        return request(app)
        .patch('/api/articles/88')
        .send(incrementVotes)
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Article not found')
        })
    })
    test('status 400: should respond with a bad request message when an invalid id is requested' , () => {
        const incrementVotes = {inc_votes : 77}
        return request(app)
        .patch('/api/articles/tasmania')
        .send(incrementVotes)
        .expect(400)
        .then((res) => {
            console.log(res.body)
            expect(res.body.msg).toMatch('Bad request');
        })
    })
})

describe('GET/api/users', () => {
    test('status 200: responds with an array of objects. Each containing a username property', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.users)).toBe(true)
            expect(body.users.length).toBe(4);
            body.users.forEach((user) => {
                expect(user).toEqual(
                    {
                        username: expect.any(String)
                    }
                )
            })
        })
    })
})