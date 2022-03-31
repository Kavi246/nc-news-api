const { selectArticleById, updateArticleById, selectAllArticles } = require('../models/articles.models');

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
    }
    else if( typeof req.body.inc_votes !== 'number') {
        return next({status: 400, msg: 'value for the vote increment must be a number!'})
    }
    const { inc_votes } = req.body;

    const dbQueries = [ 
        updateArticleById(article_id, inc_votes), 
        selectArticleById(article_id)
    ]
    Promise.all(dbQueries)
        .then((results) => {
            const updatedArticle = results[0]
            res.status(200).send({updatedArticle})
        })
        .catch(next);
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        res.send( {articles });
    })
}