import express from "express";
import {
  obtenerProyectos,
  crearProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
  buscarColaborador,
} from "../controllers/proyectoController.js";

import checkAuth from "../middleware/checkAuth.js";

const proyectoRoutes = express.Router();

proyectoRoutes
  .route("/")
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, crearProyecto);

proyectoRoutes
  .route("/:id")
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto);

proyectoRoutes.get("/tareas/:id", checkAuth, obtenerTareas);
proyectoRoutes.post("/colaboradores", checkAuth, buscarColaborador);
proyectoRoutes.post("/colaboradores/:id", checkAuth, agregarColaborador);
proyectoRoutes.post(
  "/eliminar-colaboradores/:id",
  checkAuth,
  eliminarColaborador
);
export default proyectoRoutes;
