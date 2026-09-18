const express = require('express');

const knowledgeBaseController =
    require('../controllers/knowledgeBaseController');

const authenticateToken =
    require('../middleware/authMiddleware');

const authorizeRoles =
    require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
    '/categories',
    authenticateToken,
    knowledgeBaseController.getCategories
);

router.get(
    '/articles',
    authenticateToken,
    knowledgeBaseController.getArticles
);

router.get(
    '/articles/:id',
    authenticateToken,
    knowledgeBaseController.getArticle
);

router.post(
    '/articles',
    authenticateToken,
    authorizeRoles('ADMIN'),
    knowledgeBaseController.createArticle
);

router.put(
    '/articles/:id',
    authenticateToken,
    authorizeRoles('ADMIN'),
    knowledgeBaseController.updateArticle
);

router.delete(
    '/articles/:id',
    authenticateToken,
    authorizeRoles('ADMIN'),
    knowledgeBaseController.deleteArticle
);

module.exports = router;