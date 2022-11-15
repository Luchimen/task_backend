import express from "express";
import {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
} from "../controllers/tareaController.js";
import checkAuth from "../middleware/checkAuth.js";
const tareaRoutes = express.Router();

tareaRoutes.use(checkAuth);

tareaRoutes.post("/", agregarTarea);
tareaRoutes
  .route("/:id")
  .get(obtenerTarea)
  .put(actualizarTarea)
  .delete(eliminarTarea);
tareaRoutes.post("/estado/:id", cambiarEstado);
export default tareaRoutes;
