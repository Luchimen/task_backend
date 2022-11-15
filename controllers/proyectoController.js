import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  const { usuario } = req;
  const listaProyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario.id } },
      { creador: { $in: req.usuario.id } },
    ],
  }).select("-tareas");
  res
    .status(200)
    .json({ ok: true, msg: "Accion completada correctamente", listaProyectos });
};
const crearProyecto = async (req, res) => {
  console.log(req);
  const newProyecto = await Proyecto(req.body);
  newProyecto.creador = req.usuario.id;
  try {
    await newProyecto.save();
    res.status(200).json({
      ok: true,
      msg: "Proyecto creado correctamente",
      newProyecto,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Hubo un error contacte con el administrador",
    });
  }
};
const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;
  const proyecto = await Proyecto.findById(id)
    .populate({
      path: "tareas",
      populate: { path: "completado", select: "nombre" },
    })
    .populate("colaboradores", "nombre email");
  if (!proyecto) {
    return res.status(404).json({
      ok: false,
      msg: "Proyecto no encontrado",
    });
  }
  if (
    usuario.id !== proyecto.creador.toString() &&
    !proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario.id.toString()
    )
  ) {
    return res.status(404).json({
      ok: false,
      msg: "No tiene autorización para esa acción",
    });
  }
  res.status(200).json({
    ok: true,
    msg: "Accion completada",
    proyecto,
  });
};
const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;
  let proyecto = await Proyecto.findById(id);
  if (!proyecto) {
    return res.status(404).json({
      ok: false,
      msg: "Proyecto no encontrado",
    });
  }
  if (usuario.id !== proyecto.creador.toString()) {
    return res.status(404).json({
      ok: false,
      msg: "No tiene autorización para esa acción",
    });
  }
  proyecto = { ...proyecto._doc, ...req.body };
  try {
    const proyectoEditado = await Proyecto.findByIdAndUpdate(id, proyecto, {
      returnOriginal: false,
    });
    res.status(200).json({
      ok: true,
      msg: "Proyecto modificado",
      proyecto: proyectoEditado,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Acion no completada llame al administrador",
    });
  }
};
const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;
  const proyecto = await Proyecto.findById(id);
  if (!proyecto) {
    return res.status(404).json({
      ok: false,
      msg: "Proyecto no encontrado",
    });
  }
  if (usuario.id !== proyecto.creador.toString()) {
    return res.status(404).json({
      ok: false,
      msg: "No tiene autorización para esa acción",
    });
  }
  try {
    await Proyecto.findByIdAndRemove(id);
    res.status(200).json({
      ok: true,
      msg: "Proyecto eliminado con exito",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Ocurrio un problema desde eliminarProyecto",
    });
  }
};
const buscarColaborador = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v"
  );
  if (!usuario) {
    res.status(404).json({
      ok: false,
      msg: "Usuario con ese correo no encontrado",
    });
    return;
  }
  res.status(200).json({
    ok: true,
    msg: "Usuario si existe",
    usuario,
  });
  // try {

  // } catch (error) {
  //   console.log(error);
  // }
};
const agregarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  3;
  if (!proyecto) {
    res.status(404).json({
      ok: false,
      msg: "El proyecto seleccionado no existe",
    });
    return;
  }
  if (proyecto.creador.toString() !== req.usuario.id.toString()) {
    res.status(401).json({
      ok: false,
      msg: "Accion no permitida",
    });
    return;
  }
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v"
  );
  if (!usuario) {
    res.status(404).json({
      ok: false,
      msg: "Usuario con ese correo no encontrado",
    });
    return;
  }
  if (proyecto.creador.toString() === usuario._id.toString()) {
    res.status(401).json({
      ok: false,
      msg: "No puede agregarse a si mismo como colaborador",
    });
    return;
  }
  if (proyecto.colaboradores.includes(usuario._id)) {
    res.status(401).json({
      ok: false,
      msg: "El usuario ya es colaborador del proyecto.",
    });
    return;
  }
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.status(200).json({
    ok: true,
    msg: "Colaborador agregado correctamente",
  });
};

const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);
  3;
  if (!proyecto) {
    res.status(404).json({
      ok: false,
      msg: "El proyecto seleccionado no existe",
    });
    return;
  }
  if (proyecto.creador.toString() !== req.usuario.id.toString()) {
    res.status(401).json({
      ok: false,
      msg: "Accion no permitida",
    });
    return;
  }

  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  res.status(200).json({
    ok: true,
    msg: "Colaborador eliminado correctamente",
  });
};
const obtenerTareas = async (req, res) => {};

export {
  obtenerProyectos,
  crearProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
  buscarColaborador,
};
