const pool = require('../config/db');

const getAllAssets = async () => {

    const result = await pool.query(`
        SELECT
            a.id,
            a.asset_tag,
            a.name,
            a.asset_type,
            a.serial_number,
            a.brand,
            a.model,
            a.status,
            a.assigned_to,
            a.department,
            a.purchase_date,
            a.notes,
            a.created_at,
            a.updated_at,

            u.full_name AS assigned_to_name

        FROM assets a

        LEFT JOIN users u
            ON a.assigned_to = u.id

        ORDER BY a.id DESC
    `);

    return result.rows;
};


const createAsset = async (
    name,
    assetType,
    serialNumber,
    brand,
    model,
    status,
    assignedTo,
    department,
    purchaseDate,
    notes
) => {

    const result = await pool.query(`
        INSERT INTO assets (
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
        )

        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
        )

        RETURNING
            id,
            asset_tag,
            name,
            asset_type,
            serial_number,
            brand,
            model,
            status,
            assigned_to,
            department,
            purchase_date,
            notes,
            created_at,
            updated_at
    `, [
        name,
        assetType,
        serialNumber || null,
        brand || null,
        model || null,
        status || 'AVAILABLE',
        assignedTo || null,
        department || null,
        purchaseDate || null,
        notes || null
    ]);

    return result.rows[0];
};

const assignAsset = async (
    assetId,
    userId
) => {

    const result = await pool.query(`
        UPDATE assets

        SET
            assigned_to = $1,
            status = 'ASSIGNED',
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $2

        RETURNING
            id,
            asset_tag,
            name,
            asset_type,
            serial_number,
            brand,
            model,
            status,
            assigned_to,
            department,
            purchase_date,
            notes,
            created_at,
            updated_at
    `, [
        userId,
        assetId
    ]);

    return result.rows[0];
};

const unassignAsset = async (assetId) => {

    const result = await pool.query(`
        UPDATE assets

        SET
            assigned_to = NULL,
            status = 'AVAILABLE',
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $1

        RETURNING
            id,
            asset_tag,
            name,
            asset_type,
            serial_number,
            brand,
            model,
            status,
            assigned_to,
            department,
            purchase_date,
            notes,
            created_at,
            updated_at
    `, [assetId]);

    return result.rows[0];
};

const updateAsset = async (
    assetId,
    name,
    assetType,
    serialNumber,
    brand,
    model,
    status,
    department,
    purchaseDate,
    notes
) => {

    const result = await pool.query(`
        UPDATE assets

        SET
            name = $1,
            asset_type = $2,
            serial_number = $3,
            brand = $4,
            model = $5,
            status = $6,
            department = $7,
            purchase_date = $8,
            notes = $9,
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $10

        RETURNING
            id,
            asset_tag,
            name,
            asset_type,
            serial_number,
            brand,
            model,
            status,
            assigned_to,
            department,
            purchase_date,
            notes,
            created_at,
            updated_at
    `, [
        name,
        assetType,
        serialNumber || null,
        brand || null,
        model || null,
        status,
        department || null,
        purchaseDate || null,
        notes || null,
        assetId
    ]);

    return result.rows[0];
};

const deleteAsset = async (assetId) => {

    const result = await pool.query(`
        DELETE FROM assets

        WHERE id = $1

        RETURNING id
    `, [assetId]);

    return result.rows[0];
};

module.exports = {
    getAllAssets,
    createAsset,
    assignAsset,
    unassignAsset,
    updateAsset,
    deleteAsset
};