const express = require("express");
const reservasController = require("../controllers/reservas_controller");

const router = express.Router();

router.post("/", reservasController.crearReserva);
router.get("/:id", reservasController.obtenerReserva);
router.patch("/:id/cancelar", reservasController.cancelarReserva);


module.exports = router;