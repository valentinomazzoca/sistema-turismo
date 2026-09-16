const reservaModel = require("../models/reserva_model");

const crearReservaCompleta = async (datos) => {
    if (!datos.empresa_id) {
        throw new Error("La empresa es obligatoria");
    }

    if (!datos.cliente_id) {
        throw new Error("El cliente es obligatorio");
    }

    if (!Array.isArray(datos.pasajeros) || datos.pasajeros.length === 0) {
        throw new Error("La reserva debe tener al menos un pasajero");
    }

    if (!Array.isArray(datos.servicios) || datos.servicios.length === 0) {
        throw new Error("La reserva debe tener al menos un servicio");
    }

    for (const pasajero of datos.pasajeros) {
        if (!pasajero.nombre?.trim()) {
            throw new Error("El nombre del pasajero es obligatorio");
        }

        if (!pasajero.apellido?.trim()) {
            throw new Error("El apellido del pasajero es obligatorio");
        }
    }

    for (const servicio of datos.servicios) {
        if (!servicio.salida_id) {
            throw new Error("El servicio debe tener una salida");
        }

        if (
    !Number.isInteger(Number(servicio.cantidad)) ||
    Number(servicio.cantidad) <= 0
) { 
            throw new Error("La cantidad debe ser mayor a 0");
        }

        if (typeof servicio.requiere_transfer !== "boolean") {
            throw new Error("requiere_transfer debe ser true o false");
        }

        if (
    servicio.precio === undefined ||
    !Number.isFinite(Number(servicio.precio)) ||
    Number(servicio.precio) < 0
) {
            throw new Error("El precio no puede ser negativo");
        }
    }

    return reservaModel.crearReservaCompleta(datos);
};

const obtenerReserva = async (id) => {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error("El ID de reserva no es válido");
    }

    return reservaModel.obtenerReserva(Number(id));
};
const cancelarReserva = async (id) => {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error("El ID de reserva no es válido");
    }

    const resultado = await reservaModel.cancelarReserva(Number(id));

    if (!resultado) {
        throw new Error("Reserva no encontrada");
    }

    if (resultado.yaCancelada) {
        throw new Error("La reserva ya está cancelada");
    }

    return resultado.reserva;
};

module.exports = {
    crearReservaCompleta,
    obtenerReserva,
    cancelarReserva
};