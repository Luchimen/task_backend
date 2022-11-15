import jwt from "jsonwebtoken";
const checkAuth = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token",
    });
  }
  try {
    let usuario = jwt.verify(token, process.env.JWT_SECRET);
    delete usuario.iat;
    delete usuario.exp;
    req.usuario = usuario;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }
  next();
};
export default checkAuth;
