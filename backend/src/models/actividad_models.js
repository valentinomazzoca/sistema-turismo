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
const actualizar = async (
    id,
    {
        nombre,
        descripcion,
        duracion,
        precio_base,
        requiere_peso,
        requiere_altura
    }
) => {

    const resultado = await pool.query(
        `UPDATE actividad
        SET
            nombre = $1,
            descripcion = $2,
            duracion = $3,
            precio_base = $4,
            requiere_peso = $5,
            requiere_altura = $6
        WHERE id = $7
         RETURNING *`,
        [
            nombre,
            descripcion,
            duracion,
            precio_base,
            requiere_peso,
            requiere_altura,
            id
        ]
    );

    return resultado.rows[0];
};

module.exports = {
    obtenerTodas,
    crear,
    actualizar
};