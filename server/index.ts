import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

registerRoutes(app);

// Servir el frontend desde /dist
app.use(express.static(path.join(__dirname, "../dist")));

// Manejar rutas del frontend (SPA)
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
