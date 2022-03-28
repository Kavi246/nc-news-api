const { selectAllTopics } = require('../models/topics');

exports.getAllTopics = async (req, res) => {
    const topics = await selectAllTopics()
    res.status(200).send(topics);
}