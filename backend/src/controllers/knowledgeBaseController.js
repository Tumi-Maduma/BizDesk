const knowledgeBaseModel =
    require('../models/knowledgeBaseModel');

const getCategories = async (req, res) => {

    try {

        const categories =
            await knowledgeBaseModel.getCategories();

        res.json(categories);

    } catch (error) {

        console.error(
            'Error retrieving knowledge categories:',
            error
        );

        res.status(500).json({
            message:
                'Failed to retrieve knowledge categories'
        });
    }
};

const getArticles = async (req, res) => {

    try {

        const articles =
            await knowledgeBaseModel.getArticles();

        res.json(articles);

    } catch (error) {

        console.error(
            'Error retrieving knowledge articles:',
            error
        );

        res.status(500).json({
            message:
                'Failed to retrieve knowledge articles'
        });
    }
};

const getArticle = async (req, res) => {

    try {

        const articleId =
            Number(req.params.id);

        if (!articleId) {

            return res.status(400).json({
                message:
                    'Invalid article ID'
            });
        }

        const article =
            await knowledgeBaseModel
                .getArticleById(articleId);

        if (!article) {

            return res.status(404).json({
                message:
                    'Article not found'
            });
        }

        res.json(article);

    } catch (error) {

        console.error(
            'Error retrieving knowledge article:',
            error
        );

        res.status(500).json({
            message:
                'Failed to retrieve knowledge article'
        });
    }
};

const createArticle = async (req, res) => {

    try {

        const {
            title,
            content,
            category_id
        } = req.body;

        if (
            !title ||
            !content ||
            !category_id
        ) {

            return res.status(400).json({
                message:
                    'Title, content and category are required'
            });
        }

        const categoryId =
            Number(category_id);

        if (!categoryId) {

            return res.status(400).json({
                message:
                    'Invalid category'
            });
        }

        const newArticle =
            await knowledgeBaseModel.createArticle(
                title.trim(),
                content.trim(),
                categoryId,
                req.user.id
            );

        res.status(201).json(
            newArticle
        );

    } catch (error) {

        console.error(
            'Error creating knowledge article:',
            error
        );

        res.status(500).json({
            message:
                'Failed to create knowledge article'
        });
    }
};

const updateArticle = async (req, res) => {

    try {

        const articleId =
            Number(req.params.id);

        const {
            title,
            content,
            category_id
        } = req.body;

        if (!articleId) {

            return res.status(400).json({
                message:
                    'Invalid article ID'
            });
        }

        if (
            !title ||
            !content ||
            !category_id
        ) {

            return res.status(400).json({
                message:
                    'Title, content and category are required'
            });
        }

        const categoryId =
            Number(category_id);

        if (!categoryId) {

            return res.status(400).json({
                message:
                    'Invalid category'
            });
        }

        const updatedArticle =
            await knowledgeBaseModel.updateArticle(
                articleId,
                title.trim(),
                content.trim(),
                categoryId
            );

        if (!updatedArticle) {

            return res.status(404).json({
                message:
                    'Article not found'
            });
        }

        res.json({
            message:
                'Article updated successfully',

            article:
                updatedArticle
        });

    } catch (error) {

        console.error(
            'Error updating knowledge article:',
            error
        );

        res.status(500).json({
            message:
                'Failed to update knowledge article'
        });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const articleId =
            Number(req.params.id);

        if (!articleId) {
            return res.status(400).json({
                message: 'Invalid article ID'
            });
        }

        const deletedArticle =
            await knowledgeBaseModel.deleteArticle(
                articleId
            );

        if (!deletedArticle) {
            return res.status(404).json({
                message: 'Article not found'
            });
        }

        res.json({
            message:
                'Knowledge Base article deleted successfully'
        });

    } catch (error) {
        console.error(
            'Error deleting article:',
            error
        );

        res.status(500).json({
            message:
                'Unable to delete Knowledge Base article'
        });
    }
};

module.exports = {
    getCategories,
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle
};