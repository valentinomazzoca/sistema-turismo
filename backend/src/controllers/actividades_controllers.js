const actividadService = require("../services/service");

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
        console.error("ERROR AL CREAR ACTIVIDAD:");
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};
const actualizarActividad = async (req, res) => {

    try {

        const id = req.params.id;

        const actividad = await actividadService.actualizarActividad(
            id,
            req.body
        );

        if (!actividad) {
            return res.status(404).json({
                error: "Actividad no encontrada"
            });
        }

        res.json(actividad);

    } catch (error) {

        console.error("Error al actualizar actividad:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};
module.exports = {
    obtenerActividades,
    crearActividad,
    actualizarActividad
};