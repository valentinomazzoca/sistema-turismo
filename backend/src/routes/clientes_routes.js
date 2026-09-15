const express = require("express");

const clientesController =
    require("../controllers/clientes_controller");

const router = express.Router();

router.get("/", clientesController.obtenerClientes);

router.get("/:id", clientesController.obtenerClientePorId);

router.post("/", clientesController.crearCliente);

router.put("/:id", clientesController.actualizarCliente);

module.exports = router;