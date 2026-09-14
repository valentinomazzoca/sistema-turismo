const actividadModel = require("../models/actividad_models");

const obtenerActividades = async () => {
    const actividades = await actividadModel.obtenerTodas();

    return actividades;
};

const crearActividad = async (datos) => {
    const {
        nombre,
        duracion,
        precio_base,
        requiere_peso,
        requiere_altura
    } = datos;

    if (!nombre || nombre.trim() === "") {
        throw new Error("El nombre de la actividad es obligatorio");
    }

    if (!duracion || duracion <= 0) {
        throw new Error("La duración debe ser mayor a 0");
    }

    if (precio_base === undefined || precio_base < 0) {
        throw new Error("El precio base no puede ser negativo");
    }

    if (typeof requiere_peso !== "boolean") {
        throw new Error("requiere_peso debe ser booleano");
    }

    if (typeof requiere_altura !== "boolean") {
        throw new Error("requiere_altura debe ser booleano");
    }

    return await actividadModel.crear(datos);
};

const actualizarActividad = async (id, datos) => {
    const {
        nombre,
        duracion,
        precio_base,
        requiere_peso,
        requiere_altura
    } = datos;

    if (!nombre || nombre.trim() === "") {
        throw new Error("El nombre de la actividad es obligatorio");
    }

    if (!duracion || duracion <= 0) {
        throw new Error("La duración debe ser mayor a 0");
    }

    if (precio_base === undefined || precio_base < 0) {
        throw new Error("El precio base no puede ser negativo");
    }

    if (typeof requiere_peso !== "boolean") {
        throw new Error("requiere_peso debe ser booleano");
    }

    if (typeof requiere_altura !== "boolean") {
        throw new Error("requiere_altura debe ser booleano");
    }

    return await actividadModel.actualizar(id, datos);
};

const desactivarActividad = async (id) => {
    return await actividadModel.desactivar(id);
};

module.exports = {
    obtenerActividades,
    crearActividad,
    actualizarActividad,
    desactivarActividad
};