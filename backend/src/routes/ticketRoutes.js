const express = require('express');

const ticketController =
    require('../controllers/ticketController');

const ticketHistoryController =
    require('../controllers/ticketHistoryController');

    const ticketCommentController =
    require('../controllers/ticketCommentController');

const authenticateToken =
    require('../middleware/authMiddleware');

const authorizeRoles =
    require('../middleware/roleMiddleware');

const router = express.Router();


router.get(
    '/',
    authenticateToken,
    ticketController.getTickets
);


router.get(
    '/:id/history',
    authenticateToken,
    ticketHistoryController.getTicketHistory
);

router.get(
    '/:id/comments',
    authenticateToken,
    ticketCommentController.getTicketComments
);


router.post(
    '/:id/comments',
    authenticateToken,
    ticketCommentController.createTicketComment
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


router.put(
    '/:id/assign',
    authenticateToken,
    authorizeRoles('ADMIN'),
    ticketController.assignTicket
);


router.put(
    '/:id/status',
    authenticateToken,
    ticketController.updateTicketStatus
);


module.exports = router;