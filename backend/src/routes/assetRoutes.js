const express = require('express');

const assetController =
    require('../controllers/assetController');

const authenticateToken =
    require('../middleware/authMiddleware');

const authorizeRoles =
    require('../middleware/roleMiddleware');

const router = express.Router();


router.get(
    '/',
    authenticateToken,
    assetController.getAssets
);


router.post(
    '/',
    authenticateToken,
    authorizeRoles('ADMIN'),
    assetController.createAsset
);


router.put(
    '/:id/assign',
    authenticateToken,
    authorizeRoles('ADMIN'),
    assetController.assignAsset
);


router.put(
    '/:id/unassign',
    authenticateToken,
    authorizeRoles('ADMIN'),
    assetController.unassignAsset
);


router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('ADMIN'),
    assetController.updateAsset
);


router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('ADMIN'),
    assetController.deleteAsset
);


module.exports = router;