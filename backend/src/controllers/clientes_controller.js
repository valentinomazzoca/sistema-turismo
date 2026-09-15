const clienteService = require("../services/cliente_service");

const obtenerClientes = async (req, res) => {

    try {

        const clientes = await clienteService.obtenerClientes();

        res.json(clientes);

    } catch (error) {

        console.error("Error al obtener clientes:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};

const obtenerClientePorId = async (req, res) => {

    try {

        const cliente =
            await clienteService.obtenerClientePorId(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json(cliente);

    } catch (error) {

        console.error("Error al obtener cliente:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};

const crearCliente = async (req, res) => {

    try {

        const cliente =
            await clienteService.crearCliente(req.body);

        res.status(201).json({
            mensaje: "Cliente creado correctamente",
            cliente
        });

    } catch (error) {

        console.error("Error al crear cliente:", error);

        res.status(500).json({
            error: error.message
        });
    }
};

const actualizarCliente = async (req, res) => {

    try {

        const cliente =
            await clienteService.actualizarCliente(
                req.params.id,
                req.body
            );

        if (!cliente) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json({
            mensaje: "Cliente actualizado correctamente",
            cliente
        });

    } catch (error) {

        console.error("Error al actualizar cliente:", error);

        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente
};