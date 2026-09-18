const express = require('express');

const userController =
    require('../controllers/userController');

const authenticateToken =
    require('../middleware/authMiddleware');

const authorizeRoles =
    require('../middleware/roleMiddleware');

const router = express.Router();


router.get(
    '/',
    authenticateToken,
    authorizeRoles('ADMIN'),
    userController.getUsers
);


router.post(
    '/',
    authenticateToken,
    authorizeRoles('ADMIN'),
    userController.createUser
);


router.get(
    '/technicians',
    authenticateToken,
    authorizeRoles('ADMIN'),
    userController.getTechnicians
);


module.exports = router;