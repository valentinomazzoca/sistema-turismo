const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const app = express();
const actividadesRoutes = require("./routes/actividades_routes");

app.use(cors());
app.use(express.json());

app.get("/api/saludo", (req, res) => {
    res.json({
        mensaje: "API Turismo System funcionando correctamente"
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
module.exports = app;