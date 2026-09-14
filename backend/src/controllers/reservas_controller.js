const reservaService = require("../services/reserva_service");

const crearReserva = async (req, res) => {

    try {

        const reserva = await reservaService.crearReserva(req.body);

        res.status(201).json({
            mensaje: "Reserva creada correctamente",
            reserva
        });

    } catch (error) {

        console.error("Error al crear reserva:", error);

        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    crearReserva
};