const reservaService = require("../services/reserva_service");

const crearReserva = async (req, res) => {
    try {
        const resultado = await reservaService.crearReservaCompleta(req.body);

        res.status(201).json({
            mensaje: "Reserva creada correctamente",
            ...resultado
        });
    } catch (error) {
        const conflicto =
            error.message.includes("cupos") ||
            error.message.includes("cancelada");

        res.status(conflicto ? 409 : 400).json({
            error: error.message
        });
    }
};

const obtenerReserva = async (req, res) => {
    try {
        const resultado = await reservaService.obtenerReserva(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                error: "Reserva no encontrada"
            });
        }

        res.json(resultado);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};
const cancelarReserva = async (req, res) => {
    try {
        const reserva = await reservaService.cancelarReserva(req.params.id);

        res.json({
            mensaje: "Reserva cancelada correctamente",
            reserva
        });
    } catch (error) {
        const estado = error.message.includes("encontrada") ? 404 : 409;

        res.status(estado).json({
            error: error.message
        });
    }
};

module.exports = {
    crearReserva,
    obtenerReserva,
    cancelarReserva
};