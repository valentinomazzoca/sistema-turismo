const express = require("express");
const actividadesController = require("../controllers/actividades_controllers");

const router = express.Router();

router.get("/", actividadesController.obtenerActividades);

router.post("/", actividadesController.crearActividad);

module.exports = router;