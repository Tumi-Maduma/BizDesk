const express = require('express');

const dashboardController =
    require('../controllers/dashboardController');

const authenticateToken =
    require('../middleware/authMiddleware');

const router = express.Router();


router.get(
    '/statistics',
    authenticateToken,
    dashboardController.getTicketStatistics
);


module.exports = router;