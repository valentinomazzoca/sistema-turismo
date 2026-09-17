const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const app = express();
const actividadesRoutes = require("./routes/actividades_routes");
const reservasRoutes = require("./routes/reserva_routes");
const clientesRoutes = require("./routes/clientes_routes");

app.use(cors());
app.use(express.json());

app.get("/api/saludo", (req, res) => {
    res.json({
        mensaje: "API Turismo System funcionando correctamente"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        service: "backend-turismo",
        timestamp: new Date().toISOString()
    });
});

app.post("/api/actividad", async (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    try {
        const query = "INSERT INTO Actividad (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *";
        const values = [nombre, descripcion, precio];
        const result = await pool.query(query, values);
        const nuevaActividad = result.rows[0];
        res.status(201).json(nuevaActividad);

    } catch (error) {
        console.error("Error al crear la actividad:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

app.use("/api/actividades", actividadesRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/clientes", clientesRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada"
    });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Error interno del servidor";

    res.status(statusCode).json({
        error: message
    });
});

module.exports = app;