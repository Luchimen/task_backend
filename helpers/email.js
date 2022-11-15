import nodemailer from "nodemailer";
export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  //Informacion del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Comprueba tu cuenta",
    text: "COmprueba tu cuenta en Uptask",
    html: `
        <p>Hola: ${nombre}, comprueba tu cuenta en UpTask</p>
        <p>Tucuenta ya está casi lista, solo debes comprobarlar en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
    `,
  });
};

export const renewPassword = async (datos) => {
  const { email, nombre, token } = datos;
  let transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Recupera tu contraseña",
    text: "Recupera tu contraseña con Uptask",
    html: `
        <p>Hola: ${nombre}, se está generando una nueva contraseña en UpTask</p>
        <p>Para continuar con el proceso de nueva contraseña debes hacer click en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Generar nueva contraseña</a>
    `,
  });
};
