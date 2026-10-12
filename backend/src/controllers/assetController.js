const assetModel = require('../models/assetModel');


const getAssets = async (req, res) => {

    try {

        const assets =
            await assetModel.getAllAssets();

        res.json(assets);

    } catch (error) {

        console.error(
            'Error retrieving assets:',
            error
        );

        res.status(500).json({
            message: 'Failed to retrieve assets'
        });
    }
};


const createAsset = async (req, res) => {

    try {

        const {
            name,
            asset_type,
            serial_number,
            brand,
            model,
            status,
            assigned_to,
            department,
            purchase_date,
            notes
        } = req.body;


        if (!name || !asset_type) {

            return res.status(400).json({
                message:
                    'Asset name and asset type are required'
            });
        }


        const newAsset =
            await assetModel.createAsset(
                name,
                asset_type,
                serial_number,
                brand,
                model,
                status,
                assigned_to,
                department,
                purchase_date,
                notes
            );


        res.status(201).json(newAsset);

    } catch (error) {

        console.error(
            'Error creating asset:',
            error
        );

        res.status(500).json({
            message: 'Failed to create asset'
        });
    }
};

const assignAsset = async (req, res) => {

    try {

        const assetId =
            Number(req.params.id);

        const {
            user_id
        } = req.body;


        if (!assetId) {

            return res.status(400).json({
                message: 'Invalid asset ID'
            });
        }


        if (!user_id) {

            return res.status(400).json({
                message:
                    'User ID is required'
            });
        }


        const updatedAsset =
            await assetModel.assignAsset(
                assetId,
                user_id
            );


        if (!updatedAsset) {

            return res.status(404).json({
                message: 'Asset not found'
            });
        }


        res.json({
            message:
                'Asset assigned successfully',
            asset: updatedAsset
        });

    } catch (error) {

        console.error(
            'Error assigning asset:',
            error
        );

        res.status(500).json({
            message:
                'Failed to assign asset'
        });
    }
};

const unassignAsset = async (req, res) => {

    try {

        const assetId =
            Number(req.params.id);


        if (!assetId) {

            return res.status(400).json({
                message: 'Invalid asset ID'
            });
        }


        const updatedAsset =
            await assetModel.unassignAsset(
                assetId
            );


        if (!updatedAsset) {

            return res.status(404).json({
                message: 'Asset not found'
            });
        }


        res.json({
            message:
                'Asset unassigned successfully',
            asset: updatedAsset
        });

    } catch (error) {

        console.error(
            'Error unassigning asset:',
            error
        );

        res.status(500).json({
            message:
                'Failed to unassign asset'
        });
    }
};

const updateAsset = async (req, res) => {

    try {

        const assetId =
            Number(req.params.id);

        const {
            name,
            asset_type,
            serial_number,
            brand,
            model,
            status,
            department,
            purchase_date,
            notes
        } = req.body;


        if (!assetId) {

            return res.status(400).json({
                message: 'Invalid asset ID'
            });
        }


        if (!name || !asset_type || !status) {

            return res.status(400).json({
                message:
                    'Asset name, asset type and status are required'
            });
        }


        const updatedAsset =
            await assetModel.updateAsset(
                assetId,
                name,
                asset_type,
                serial_number,
                brand,
                model,
                status,
                department,
                purchase_date,
                notes
            );


        if (!updatedAsset) {

            return res.status(404).json({
                message: 'Asset not found'
            });
        }


        res.json({
            message:
                'Asset updated successfully',
            asset: updatedAsset
        });

    } catch (error) {

        console.error(
            'Error updating asset:',
            error
        );

        res.status(500).json({
            message:
                'Failed to update asset'
        });
    }
};

const deleteAsset = async (req, res) => {

    try {

        const assetId =
            Number(req.params.id);


        if (!assetId) {

            return res.status(400).json({
                message: 'Invalid asset ID'
            });
        }


        const deletedAsset =
            await assetModel.deleteAsset(
                assetId
            );


        if (!deletedAsset) {

            return res.status(404).json({
                message: 'Asset not found'
            });
        }


        res.json({
            message:
                'Asset deleted successfully'
        });

    } catch (error) {

        console.error(
            'Error deleting asset:',
            error
        );

        res.status(500).json({
            message:
                'Failed to delete asset'
        });
    }
};

module.exports = {
    getAssets,
    createAsset,
    assignAsset,
    unassignAsset,
    updateAsset,
    deleteAsset
};