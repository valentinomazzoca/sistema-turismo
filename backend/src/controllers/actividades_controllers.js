const actividadService = require("../services/actividad.service");

const obtenerActividades = async (req, res) => {
    try {

        const actividades = await actividadService.obtenerActividades();

        res.json(actividades);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al obtener las actividades"
        });
    }
};

const crearActividad = async (req, res) => {
    try {

        const actividad = await actividadService.crearActividad(req.body);

        res.status(201).json(actividad);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al crear la actividad"
        });
    }
};

module.exports = {
    obtenerActividades,
    crearActividad
};