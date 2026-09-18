const pool = require('../config/db');

const getCategories = async () => {

    const result = await pool.query(`
        SELECT
            id,
            name,
            description,
            created_at
        FROM knowledge_categories
        ORDER BY name
    `);

    return result.rows;
};

const getArticles = async () => {

    const result = await pool.query(`
        SELECT
            a.id,
            a.title,
            a.content,
            a.category_id,
            c.name AS category_name,
            a.created_by,
            u.full_name AS created_by_name,
            a.created_at,
            a.updated_at

        FROM knowledge_articles a

        INNER JOIN knowledge_categories c
            ON a.category_id = c.id

        LEFT JOIN users u
            ON a.created_by = u.id

        ORDER BY a.created_at DESC
    `);

    return result.rows;
};

const createArticle = async (
    title,
    content,
    categoryId,
    createdBy
) => {

    const result = await pool.query(`
        INSERT INTO knowledge_articles (
            title,
            content,
            category_id,
            created_by
        )

        VALUES ($1, $2, $3, $4)

        RETURNING
            id,
            title,
            content,
            category_id,
            created_by,
            created_at,
            updated_at
    `, [
        title,
        content,
        categoryId,
        createdBy
    ]);

    return result.rows[0];
};

const updateArticle = async (
    id,
    title,
    content,
    categoryId
) => {

    const result = await pool.query(`
        UPDATE knowledge_articles

        SET
            title = $1,
            content = $2,
            category_id = $3,
            updated_at = CURRENT_TIMESTAMP

        WHERE id = $4

        RETURNING
            id,
            title,
            content,
            category_id,
            created_by,
            created_at,
            updated_at
    `, [
        title,
        content,
        categoryId,
        id
    ]);

    return result.rows[0];
};

const deleteArticle = async (id) => {
    const result = await pool.query(`
        DELETE FROM knowledge_articles
        WHERE id = $1
        RETURNING id
    `, [id]);

    return result.rows[0];
};

const getArticleById = async (id) => {

    const result = await pool.query(`
        SELECT
            a.id,
            a.title,
            a.content,
            a.category_id,
            c.name AS category_name,
            a.created_by,
            u.full_name AS created_by_name,
            a.created_at,
            a.updated_at

        FROM knowledge_articles a

        INNER JOIN knowledge_categories c
            ON a.category_id = c.id

        LEFT JOIN users u
            ON a.created_by = u.id

        WHERE a.id = $1
    `, [id]);

    return result.rows[0];
};

module.exports = {
    getCategories,
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};