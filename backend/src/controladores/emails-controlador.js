import { transporter } from "../config/nodemailer.js";
import jwt from "jsonwebtoken";
import {
  mailDeBienvenida,
  mailDeRecuperacion,
} from "../utilidades/plantillas.js";
import dotenv from "dotenv";
import { obtenerUsuarioByEmail } from "../utilidades/emailing.js";
dotenv.config();

const enviarEmailBienvenida = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    await transporter.sendMail({
      from: `"HypnIA: Tu diario de sueños" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `¡Bienvenido al mundo de tus sueños, ${nombre}! 🌙`,
      html: mailDeBienvenida,
    });
    res.status(200).json({ message: "Correo enviado con exito" });
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "El email de bienvenida no pudo ser enviado.",
    };
  }
};

const enviarEmailRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await obtenerUsuarioByEmail(email);
    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });
    const resetLink = `http://127.0.0.1:5500/frontend/newpass.html?token=${token}`;
    await transporter.sendMail({
      from: `"HypnIA: Tu diario de sueños" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Restablece tu contraseña 🌙`,
      html: mailDeRecuperacion(resetLink),
    });
    res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "No se pudo enviar el correo de recuperación.",
    });
  }
};

export { enviarEmailBienvenida, enviarEmailRecuperacion };
