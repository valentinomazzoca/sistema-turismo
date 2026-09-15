const pool = require("../config/database");

const crearReservaCompleta = async (datos) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

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

module.exports = {
    crearReservaCompleta
};