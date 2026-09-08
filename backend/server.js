const app = require("./src/app");
const pool = require("./src/config/database");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");

        console.log("Base de datos conectada correctamente");

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error al conectar con PostgreSQL:");
        console.error(error);
    }
};

startServer();