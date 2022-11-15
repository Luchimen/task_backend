import express from "express";
import dotenv from "dotenv";
import conectarBd from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import cors from "cors";
//Inicializando express y guardandolo en app
const app = express();
app.use(express.json());

//Permitiendo el uso de archivos .env
dotenv.config();
//Conectarse a la base de datos
conectarBd();

app.use(cors());

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

//Asignando un puerto
const port = process.env.PORT || 4000;
//Escuchando la peticion
const servidor = app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

//Socket.io

import { Server } from "socket.io";
const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  //dEFINIR LOS EVENTOS
  console.log("Desde socket en index");

  socket.on("abrir proyecto", (proyecto) => {
    socket.join(proyecto);
  });
  socket.on("nueva tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea agregada", tarea);
  });
  socket.on("eliminar tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea eliminada", tarea);
  });
  socket.on("editar tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea editada", tarea);
  });
  socket.on("cambiar estado", (tarea) => {

    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("estado cambiado", tarea);
  });
});
