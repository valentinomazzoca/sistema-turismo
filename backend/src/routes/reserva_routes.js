const express = require("express");

const reservasController =
    require("../controllers/reservas_controller");

const router = express.Router();

router.post("/", reservasController.crearReserva);

module.exports = router;