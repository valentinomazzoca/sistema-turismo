const reservaModel = require("../models/reserva_model");

const crearReservaCompleta = async (datos) => {

    // Validaciones básicas

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

    // Validar pasajeros

    for (const pasajero of datos.pasajeros) {

        if (!pasajero.nombre || pasajero.nombre.trim() === "") {
            throw new Error("El nombre del pasajero es obligatorio");
        }

        if (!pasajero.apellido || pasajero.apellido.trim() === "") {
            throw new Error("El apellido del pasajero es obligatorio");
        }
    }

    // Validar servicios

    for (const servicio of datos.servicios) {

        if (!servicio.salida_id) {
            throw new Error("El servicio debe tener una salida");
        }

        if (!servicio.cantidad || servicio.cantidad <= 0) {
            throw new Error("La cantidad del servicio debe ser mayor a 0");
        }

        if (typeof servicio.requiere_transfer !== "boolean") {
            throw new Error(
                "requiere_transfer debe ser true o false"
            );
        }

        if (servicio.precio === undefined || servicio.precio < 0) {
            throw new Error("El precio no puede ser negativo");
        }
    }

    return await reservaModel.crearReservaCompleta(datos);
};

module.exports = {
    crearReservaCompleta
};