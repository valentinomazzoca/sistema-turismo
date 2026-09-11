const actividadModel = require("../models/actividad_models");

const obtenerActividades = async () => {
    const actividades = await actividadModel.obtenerTodas();

    return actividades;
};

const crearActividad = async (datos) => {
    const actividad = await actividadModel.crear(datos);

    return actividad;
};
const actualizarActividad = async (id, datos) => {

    const actividad = await actividadModel.actualizar(id, datos);

    return actividad;
};

module.exports = {
    obtenerActividades,
    crearActividad,
    actualizarActividad
};