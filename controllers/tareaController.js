import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;
  const { usuario } = req;

  const proyectoSeleccionado = await Proyecto.findOne({ _id: proyecto });

  if (!proyectoSeleccionado) {
    return res.status(404).json({
      ok: false,
      msg: "El proyecto no existe",
    });
  }
  if (usuario.id !== proyectoSeleccionado.creador.toString()) {
    return res.status(404).json({
      ok: false,
      msg: "No tiene autorización para esa acción",
    });
  }
  try {
    const newTarea = await Tarea(req.body);
    await newTarea.save();
    proyectoSeleccionado.tareas.push(newTarea._id);
    await proyectoSeleccionado.save();
    res.status(200).json({
      ok: true,
      msg: "Accion realizada con exito",
      newTarea,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema hable con el administrador",
    });
  }
};
const obtenerTarea = async (req, res) => {
  const { id } = req.params;
  let tarea = await Tarea.findById(id).populate("proyecto");
  if (!tarea) {
    return res.status(404).json({
      ok: false,
      msg: "La tarea no existe",
    });
  }
  if (req.usuario.id !== tarea.proyecto.creador.toString()) {
    return res.status(400).json({
      ok: false,
      msg: "No tiene permisos para realizar esta acción",
    });
  }
  tarea = { ...tarea._doc, proyecto: tarea.proyecto._id };
  //   console.log(tarea);
  res.status(200).json({
    ok: true,
    msg: "Accion completada",
    tarea,
  });
};
const actualizarTarea = async (req, res) => {
  const { id } = req.params;
  let tarea = await Tarea.findById(id).populate("proyecto");
  if (!tarea) {
    return res.status(404).json({
      ok: false,
      msg: "La tarea no existe",
    });
  }
  if (req.usuario.id !== tarea.proyecto.creador.toString()) {
    return res.status(400).json({
      ok: false,
      msg: "No tiene permisos para realizar esta acción",
    });
  }
  if (req.body.proyecto !== tarea.proyecto._id.toString()) {
    return res.status(400).json({
      ok: false,
      msg: "El proyecto asociado con esa tarea no existe",
    });
  }
  tarea = { ...tarea._doc, ...req.body };

  try {
    const tareaEditada = await Tarea.findByIdAndUpdate(id, tarea, {
      returnOriginal: false,
    });
    res.status(200).json({
      ok: true,
      msg: "Tarea modificada",
      tarea: tareaEditada,
    });
  } catch (error) {
    console.log(error);
  }
};
const eliminarTarea = async (req, res) => {
  const { id } = req.params;
  let tarea = await Tarea.findById(id).populate("proyecto");
  if (!tarea) {
    return res.status(404).json({
      ok: false,
      msg: "La tarea no existe",
    });
  }
  if (req.usuario.id !== tarea.proyecto.creador.toString()) {
    return res.status(400).json({
      ok: false,
      msg: "No tiene permisos para realizar esta acción",
    });
  }
  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea._id);

    await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);
    res.status(200).json({
      ok: true,
      msg: "Tarea eliminada con exito",
    });
  } catch (error) {
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const tarea = await Tarea.findById(id).populate("proyecto");
  if (!tarea) {
    res.status(404).json({
      ok: false,
      msg: "La tarea seleccionada no existe",
    });
  }
  if (
    req.usuario.id !== tarea.proyecto.creador.toString() &&
    !tarea.proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario.id.toString()
    )
  ) {
    return res.status(404).json({
      ok: false,
      msg: "No tiene autorización para esa acción",
    });
  }
  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario.id;
  await tarea.save();
  const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado");
  res.status(200).json({
    ok: true,
    msg: "Tarea cambiada satisfactoriamente",
    tarea: tareaAlmacenada,
  });
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
