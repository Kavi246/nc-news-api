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

    if(!req.body.hasOwnProperty('inc_votes')) {
        return next({status: 400, msg: 'patch request body incorrectly formatted'})
        //return Promise.reject({status: 400, msg: 'patch request body incorrectly formatted'})
    }
    else if( typeof req.body.inc_votes !== 'number') {
        return next({status: 400, msg: 'value for the vote increment must be a number!'})
    }
    const { inc_votes } = req.body;
    
    updateArticleById(article_id, inc_votes).then((updatedArticle) => {
        console.log(updatedArticle)
        res.status(200).send({updatedArticle})
    })
}