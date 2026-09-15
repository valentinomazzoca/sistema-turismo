const reservaService = require("../services/reserva_service");

const crearReserva = async (req, res) => {

    try {

        const resultado =
            await reservaService.crearReservaCompleta(req.body);

        res.status(201).json({
            mensaje: "Reserva creada correctamente",
            ...resultado
        });

    } catch (error) {

        console.error("Error al crear reserva:", error);

        res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    crearReserva
};