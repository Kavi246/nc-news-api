const db = require('../db/connection');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');
const { get } = require('express/lib/response');

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

describe('GET/api/articles/:article_id', () => {
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

describe('GET /api/articles', () => {
    test('status 200: responds with all articles, sorted by date (descending)', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
            expect(Array.isArray(res.body.articles)).toBe(true);
            expect(res.body.articles.length).toBe(12);
        })
    })
    test('status 200: each article should have a comment count property along with all other properties', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
            const articlesArr = res.body.articles;
            articlesArr.forEach((article) => {
                expect(article).toEqual(
                    {
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    }
                )
            })
        })
    })

})

describe('GET /api/articles/:article_id/comments', () => {
    test('status 200: responds with an array of comments for the given article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((res) => {
            const commentsArr = res.body.comments;
            expect(commentsArr.length).toEqual(11);
            commentsArr.forEach((comment) => {
                expect(comment).toEqual(
                    {
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    }
                )
            })
        })
    })
    test('status 400: Bad request due to invalid article_id', () => {
        return request(app)
        .get('/api/articles/dbugle/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toMatch('Bad request:')
        })
    })
    test('status 404: responds with a "not found" message when article_id doesn\'t exist', () => {
        return request(app)
        .get('/api/articles/65/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article not found')
        })
    })
    test('status 200: responds with a no comments message when article_id exists but has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            console.log(body)
            expect(body.msg).toBe('This article has no comments')
        })
    })
})
describe.only('POST /api/articles/:article_id/comments', () => {
    test('status 201: responds with the newly posted comment when the author exists in the user\'s table', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({ username: "butter_bridge", body:"testing testing 123" })
        .expect(201)
        .then(({ body }) => {
            expect(body.postedComment).toEqual({
                   "article_id": 3,
                   "author": "butter_bridge",
                   "body": "testing testing 123",
                   "comment_id": 19,
                   "created_at": expect.any(String),
                   "votes": 0,
                })
        })
    })
    test('status 404: responds with an error message when the author does not exist in the user\'s table', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({ username: "KaviP", body:"testing testing 123" })
        .expect(404)
        .then(({ body }) => {
            console.log(body);
            expect(body.msg).toEqual("User does not exist")
        })
    })
    test('status 404: responds with an error message when the article does not exist', () => {
        return request(app)
        .post('/api/articles/66/comments')
        .send({ username: "butter_bridge", body: "testtesttest" })
        .expect(404)
        .then(({ body }) => {
            console.log(body);
            expect(body.msg).toEqual("Article does not exist")
        })
    })
    test('status 400: responds with an error message when the sent object does not have the correct keys', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({ username: "test", comment_body:"shouldFail" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toEqual("The comment to be posted was incorrectly formatted")
        })
    })
    test('status 400: responds with an error message when the sent data is of the wrong type', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({ username: "test", body: 180 })
        .expect(400)
        .then(({ body }) => {
            console.log(body);
            expect(body.msg).toEqual("The comment's author and body must be a string")
        })
    })
})