const pool = require("../config/database");

const crearReservaCompleta = async (datos) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const cuposSolicitados = new Map();

for (const servicio of datos.servicios) {
    const salidaId = Number(servicio.salida_id);
    const cantidad = Number(servicio.cantidad);

    const actual = cuposSolicitados.get(salidaId) || {
        cantidad: 0,
        transfer: 0
    };

    actual.cantidad += cantidad;

    if (servicio.requiere_transfer) {
        actual.transfer += cantidad;
    }

    cuposSolicitados.set(salidaId, actual);
}

for (const [salidaId, solicitados] of cuposSolicitados) {
    const salidaResult = await client.query(
        `SELECT
            s.id,
            s.capacidad_total,
            s.capacidad_transfer,
            COALESCE(SUM(rs.cantidad), 0) AS usados,
            COALESCE(
                SUM(
                    CASE
                        WHEN rs.requiere_transfer = TRUE
                        THEN rs.cantidad
                        ELSE 0
                    END
                ),
                0
            ) AS transfer_usados
        FROM salida s
        LEFT JOIN reserva_servicio rs
            ON rs.salida_id = s.id
        LEFT JOIN reserva r
            ON r.id = rs.reserva_id
            AND r.estado <> 'cancelada'
        WHERE s.id = $1
        GROUP BY s.id`,
        [salidaId]
    );

    if (salidaResult.rows.length === 0) {
        throw new Error(`La salida ${salidaId} no existe`);
    }

    const salida = salidaResult.rows[0];

    if (salida.estado === "cancelada") {
        throw new Error(`La salida ${salidaId} está cancelada`);
    }

    const usados = Number(salida.usados);
    const transferUsados = Number(salida.transfer_usados);

    if (usados + solicitados.cantidad > Number(salida.capacidad_total)) {
        throw new Error(`No hay cupos disponibles para la salida ${salidaId}`);
    }

    if (
        transferUsados + solicitados.transfer >
        Number(salida.capacidad_transfer)
    ) {
        throw new Error(
            `No hay cupos de transfer disponibles para la salida ${salidaId}`
        );
    }
}


        // 1. Crear reserva
        const reservaResult = await client.query(
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
                datos.empresa_id,
                datos.cliente_id,
                datos.agencia_id || null,
                datos.vendedor_id || null,
                datos.observaciones || null
            ]
        );

        const reserva = reservaResult.rows[0];

        // 2. Crear pasajeros
        const pasajeros = [];

        for (const pasajero of datos.pasajeros || []) {

            const pasajeroResult = await client.query(
                `INSERT INTO pasajero (
                    reserva_id,
                    nombre,
                    apellido,
                    dni,
                    fecha_nacimiento,
                    telefono,
                    altura,
                    peso,
                    observaciones
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *`,
                [
                    reserva.id,
                    pasajero.nombre,
                    pasajero.apellido,
                    pasajero.dni || null,
                    pasajero.fecha_nacimiento || null,
                    pasajero.telefono || null,
                    pasajero.altura || null,
                    pasajero.peso || null,
                    pasajero.observaciones || null
                ]
            );

            pasajeros.push(pasajeroResult.rows[0]);
        }

        // 3. Crear servicios
        const servicios = [];

        for (const servicio of datos.servicios || []) {

            const servicioResult = await client.query(
                `INSERT INTO reserva_servicio (
                    reserva_id,
                    salida_id,
                    operador_id,
                    cantidad,
                    requiere_transfer,
                    precio,
                    observaciones
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [
                    reserva.id,
                    servicio.salida_id,
                    servicio.operador_id || null,
                    servicio.cantidad,
                    servicio.requiere_transfer,
                    servicio.precio,
                    servicio.observaciones || null
                ]
            );

            servicios.push(servicioResult.rows[0]);
        }

        await client.query("COMMIT");

        return {
            reserva,
            pasajeros,
            servicios
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {
        client.release();
    }
};

// filepath: c:\Users\Ofi RAM\Desktop\Valen\sistema_turismo\backend\src\models\reserva_model.js
// ...existing code...

const obtenerReserva = async (id) => {
    const reservaResult = await pool.query(
        "SELECT * FROM reserva WHERE id = $1",
        [id]
    );

    if (reservaResult.rows.length === 0) {
        return null;
    }

    const pasajerosResult = await pool.query(
        "SELECT * FROM pasajero WHERE reserva_id = $1 ORDER BY id",
        [id]
    );

    const serviciosResult = await pool.query(
        "SELECT * FROM reserva_servicio WHERE reserva_id = $1 ORDER BY id",
        [id]
    );

    return {
        reserva: reservaResult.rows[0],
        pasajeros: pasajerosResult.rows,
        servicios: serviciosResult.rows
    };
};
const cancelarReserva = async (id) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const reservaResult = await client.query(
            `SELECT *
            FROM reserva
            WHERE id = $1
            FOR UPDATE`,
            [id]
        );

        if (reservaResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        const reserva = reservaResult.rows[0];

        if (reserva.estado === "cancelada") {
            await client.query("ROLLBACK");
            return { yaCancelada: true, reserva };
        }

        const resultado = await client.query(
            `UPDATE reserva
            SET estado = 'cancelada'
            WHERE id = $1
             RETURNING *`,
            [id]
        );

        await client.query("COMMIT");

        return {
            yaCancelada: false,
            reserva: resultado.rows[0]
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    crearReservaCompleta,
    obtenerReserva,
    cancelarReserva
};