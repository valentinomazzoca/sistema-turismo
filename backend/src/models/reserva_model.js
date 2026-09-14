const pool = require("../config/database");

const crearReserva = async (datos) => {
    const {
        empresa_id,
        cliente_id,
        agencia_id,
        vendedor_id,
        observaciones
    } = datos;

    const resultado = await pool.query(
        `INSERT INTO reserva (
            empresa_id,
            cliente_id,
            agencia_id,
            vendedor_id,
            observaciones
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            empresa_id,
            cliente_id || null,
            agencia_id || null,
            vendedor_id || null,
            observaciones || null
        ]
    );

    return resultado.rows[0];
};

module.exports = {
    crearReserva
};