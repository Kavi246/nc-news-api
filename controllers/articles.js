const { selectArticleById, updateArticleById } = require('../models/articles');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticleById(article_id, inc_votes).then((updatedArticle) => {
        console.log(updatedArticle)
        res.status(200).send({updatedArticle})
    })
}