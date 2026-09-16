const pool = require("../config/database");

const obtenerTodos = async () => {
    const resultado = await pool.query(
        `SELECT *
        FROM cliente
        ORDER BY id DESC`
    );

    return resultado.rows;
};

const obtenerPorId = async (id) => {
    const resultado = await pool.query(
        `SELECT *
        FROM cliente
        WHERE id = $1`,
        [id]
    );

    return resultado.rows[0];
};

const crear = async (datos) => {
    const {
        empresa_id,
        nombre,
        apellido,
        telefono,
        email,
        observaciones
    } = datos;

    const resultado = await pool.query(
        `INSERT INTO cliente (
            empresa_id,
            nombre,
            apellido,
            telefono,
            email,
            observaciones
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            empresa_id,
            nombre,
            apellido || null,
            telefono || null,
            email || null,
            observaciones || null
        ]
    );

    return resultado.rows[0];
};

const actualizar = async (id, datos) => {
    const {
        nombre,
        apellido,
        telefono,
        email,
        observaciones
    } = datos;

    const resultado = await pool.query(
        `UPDATE cliente
        SET
            nombre = $1,
            apellido = $2,
            telefono = $3,
            email = $4,
            observaciones = $5
        WHERE id = $6
         RETURNING *`,
        [
            nombre,
            apellido || null,
            telefono || null,
            email || null,
            observaciones || null,
            id
        ]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar
};