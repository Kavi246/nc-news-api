const express = require('express');

const {getAllTopics} = require('./controllers/topics')

const app = express();
app.use(express.json());

app.get('/api/topics', getAllTopics)

app.use((req, res, next) => {
    res.status(404).send({ message: "path not found" });
});

app.use((err, req, res, next) => {
    console.log(err, '<<< err');
    res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;