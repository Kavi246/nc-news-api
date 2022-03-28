const { selectAllTopics } = require('../models/topics');

exports.getAllTopics = (req, res) => {
    selectAllTopics().then((result) => {
        console.log(result);
    })
}