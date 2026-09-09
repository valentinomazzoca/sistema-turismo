const actividadModel = require("../models/actividad.model");

const obtenerActividades = async () => {
    const actividades = await actividadModel.obtenerTodas();

    return actividades;
};

const crearActividad = async (datos) => {
    const actividad = await actividadModel.crear(datos);

    return actividad;
};

module.exports = {
    obtenerActividades,
    crearActividad
};