const clienteModel = require("../models/cliente_model");

const obtenerClientes = async () => {
    return await clienteModel.obtenerTodos();
};

const obtenerClientePorId = async (id) => {
    return await clienteModel.obtenerPorId(id);
};

const crearCliente = async (datos) => {

    if (!datos.empresa_id) {
        throw new Error("La empresa es obligatoria");
    }

    if (!datos.nombre || datos.nombre.trim() === "") {
        throw new Error("El nombre es obligatorio");
    }

    return await clienteModel.crear(datos);
};

const actualizarCliente = async (id, datos) => {

    if (!datos.nombre || datos.nombre.trim() === "") {
        throw new Error("El nombre es obligatorio");
    }

    return await clienteModel.actualizar(id, datos);
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente
};