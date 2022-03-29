const express = require('express');

const {getAllTopics} = require('./controllers/topics')
const {getArticleById} = require('./controllers/articles')

const app = express();
app.use(express.json());

app.get('/api/topics', getAllTopics)
app.get('/api/articles/:article_id', getArticleById)

app.use((req, res, next) => {
    res.status(404).send({ message: "path not found" });
});

app.use((err, req, res, next) => {
    const badReqCodes = ['22P02'];
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