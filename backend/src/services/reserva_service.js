const reservaModel = require("../models/reserva_model");

const crearReserva = async (datos) => {

    if (!datos.empresa_id) {
        throw new Error("La empresa es obligatoria");
    }

    return await reservaModel.crearReserva(datos);
};

module.exports = {
    crearReserva
};