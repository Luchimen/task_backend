import { emailRegistro, renewPassword } from "../helpers/email.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js";

const crearUsuario = async (req, res) => {
  //Evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario)
    return res.status(400).json({
      msg: "El correo ya fue registrado en la bd",
    });
  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();
    //Enviar el email de confirmacion
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    });
    res.status(200).json({
      ok: true,
      msg: "Usuario creado con exito, revise su correo para verificar el usuario",
    });
  } catch (error) {
    res.status(400).json({
      msg: "Ocurrio un error consulte al administrador",
    });
  }
};

const autenticarUsuario = async (req, res) => {
  const { email, password } = req.body;

  //Comprobar si el usuario existe
  const usuarioExiste = await Usuario.findOne({ email });
  if (!usuarioExiste) {
    return res.status(404).json({
      ok: false,
      msg: "El email no existe",
    });
  }

  //Comprobar si el usuario está confirmado
  if (!usuarioExiste.confirmado) {
    return res.status(403).json({
      ok: false,
      msg: "El usuario no está confirmado",
    });
  }

  //Comprobar su password
  if (!(await usuarioExiste.comprobarPassword(password))) {
    return res.status(403).json({
      ok: false,
      msg: "El password es incorrecto",
    });
  }
  //Todo salio ok!
  return res.status(200).json({
    ok: true,
    msg: "Usuario logueado",
    _id: usuarioExiste._id,
    nombre: usuarioExiste.nombre,
    email: usuarioExiste.email,
    token: generarJWT(
      usuarioExiste._id,
      usuarioExiste.nombre,
      usuarioExiste.email
    ),
  });
};

const confirmarUsuario = async (req, res) => {
  const { token } = req.params;
  console.log(req.params.token);
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    return res.status(404).json({
      ok: false,
      msg: "Token no valido",
    });
  }
  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.status(200).json({
      ok: true,
      msg: "Usuario confirmado con exito",
    });
  } catch (error) {
    console.log(error);
  }
};

const generarToken = async (req, res) => {
  const { email } = req.body;
  //Comprobar si el usuario existe
  const usuarioExiste = await Usuario.findOne({ email });
  if (!usuarioExiste) {
    return res.status(404).json({
      ok: false,
      msg: "El email no existe",
    });
  }
  try {
    usuarioExiste.token = generarId();
    await usuarioExiste.save();
    renewPassword({
      email: usuarioExiste.email,
      nombre: usuarioExiste.nombre,
      token: usuarioExiste.token,
    });
    res.status(200).json({
      ok: true,
      msg: "Se envió un email con las instrucciones para cambiar la contraseña",
      token: usuarioExiste.token,
    });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });
  if (!tokenValido) {
    return res.status(404).json({
      ok: false,
      msg: "Token no valido",
    });
  }
  res.status(200).json({
    ok: true,
    msg: "Usario existe y token valido",
  });
};
const generarNuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const usuario = await Usuario.findOne({ token });
  if (!usuario) {
    return res.status(404).json({
      ok: false,
      msg: "Token no valido",
    });
  }
  usuario.password = password;
  usuario.token = "";
  try {
    await usuario.save();
    res.status(200).json({
      ok: true,
      msg: "Contraseña cambiada correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const obtenerPerfiles = (req, res) => {
  const { usuario } = req;
  res.status(200).json({
    ok: true,
    usuario,
  });
};

export {
  crearUsuario,
  autenticarUsuario,
  confirmarUsuario,
  generarToken,
  comprobarToken,
  generarNuevoPassword,
  obtenerPerfiles,
};
