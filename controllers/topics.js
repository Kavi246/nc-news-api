const { selectAllTopics } = require('../models/topics');

exports.getAllTopics = (req, res) => {
    selectAllTopics().then((topics) => {
        console.log(topics, "< controller log");
        res.status(200).send(topics)
    })
}