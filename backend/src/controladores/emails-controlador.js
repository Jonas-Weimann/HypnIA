import { transporter } from "../config/nodemailer.js";
import { mailDeBienvenida } from "../utilidades/plantillas.js";
import dotenv from "dotenv";
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

export { enviarEmailBienvenida };
