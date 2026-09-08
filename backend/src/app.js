const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/saludo", (req, res) => {
    res.json({
        mensaje: "API Turismo System funcionando correctamente"
    });
});

module.exports = app;