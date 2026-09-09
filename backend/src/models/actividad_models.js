const pool = require("../config/database");

const obtenerTodas = async () => {
    const resultado = await pool.query(
        "SELECT * FROM actividad ORDER BY id"
    );

    return resultado.rows;
};

const crear = async ({
    empresa_id,
    nombre,
    descripcion,
    duracion,
    precio_base,
    requiere_peso,
    requiere_altura
}) => {

    const resultado = await pool.query(
        `INSERT INTO actividad
        (
            empresa_id,
            nombre,
            descripcion,
            duracion,
            precio_base,
            requiere_peso,
            requiere_altura
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            empresa_id,
            nombre,
            descripcion,
            duracion,
            precio_base,
            requiere_peso,
            requiere_altura
        ]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerTodas,
    crear
};