import express from "express";
import {
  crearUsuario,
  autenticarUsuario,
  confirmarUsuario,
  generarToken,
  comprobarToken,
  generarNuevoPassword,
  obtenerPerfiles,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";
const usuarioRoutes = express.Router();

//Autentificacion, registro y confirmacion de usuarios
usuarioRoutes.post("/", crearUsuario); // Registrando usuarios
usuarioRoutes.post("/login", autenticarUsuario); //Autenticar usuarios
usuarioRoutes.get("/confirmar/:token", confirmarUsuario);
usuarioRoutes.post("/olvide-password", generarToken);
usuarioRoutes
  .route("/olvide-password/:token")
  .get(comprobarToken)
  .post(generarNuevoPassword);
usuarioRoutes.get("/perfiles", checkAuth, obtenerPerfiles);
export default usuarioRoutes;
