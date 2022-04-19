const express = require('express');
const cors = require('cors');

const { getAllTopics } = require('./controllers/topics.controllers')
const { getArticleById, patchArticleById, getAllArticles, getCommentsForArticle, postCommentsForArticle} = require('./controllers/articles.controllers')
const { getAllUsers } = require('./controllers/users.controllers')
const endpoints = require('./endpoints.json');
const res = require('express/lib/response');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/', (req, res) => {
    res.status(200).send({endpoints});
})

app.get('/api/topics', getAllTopics)

app.get('/api/articles/:article_id', getArticleById)
app.patch('/api/articles/:article_id', patchArticleById)
app.get('/api/articles', getAllArticles)
app.get('/api/articles/:article_id/comments', getCommentsForArticle)
app.post('/api/articles/:article_id/comments', postCommentsForArticle)

app.get('/api/users', getAllUsers)

app.use((req, res, next) => {
    res.status(404).send({ message: "path not found" });
});

app.use((err, req, res, next) => {
    const badReqCodes = ['22P02', '23502'];
    if(badReqCodes.includes(err.code)) {
        res.status(400).send({msg: `Bad request: ${err.message}`});
    }
    else {
        next(err);
    } 
})

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
    }
    else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.log(err, " <<< caught error")
    res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;