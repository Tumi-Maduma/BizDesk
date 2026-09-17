const express = require('express');

const ticketController = require('../controllers/ticketController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();


router.get(
    '/',
    authenticateToken,
    ticketController.getTickets
);


router.get(
    '/:id',
    authenticateToken,
    ticketController.getTicket
);


router.post(
    '/',
    authenticateToken,
    ticketController.createTicket
);


module.exports = router;