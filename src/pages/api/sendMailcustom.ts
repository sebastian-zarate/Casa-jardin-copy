import nodemailer from "nodemailer";
import path from "path";
import { guardarCodigoConfirmacion } from "@/services/redis";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { receptor, titulo, texto} = req.body;

  // Generate a 6-digit confirmation code
  const randomCode = Math.floor(100000 + Math.random() * 900000);

  // Path to the logo image
  const logoPath = path.join(process.cwd(), 'public', 'Images', 'LogoCasaJardin.png');

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "maldonado12net@gmail.com",
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 60000,
    socketTimeout: 60000,
  });

  //verificar connection
  await new Promise((resolve, reject) => {
    // Verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  const mailData = {
    from: "maldonado12net@gmail.com",
    to: receptor,
    subject: titulo,
    text: texto,
  };

  //enviar email
  await new Promise((resolve, reject) => {
    // Send mail
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });

  // Save the confirmation code in Redis
  await guardarCodigoConfirmacion(receptor, randomCode.toString());

  res.status(200).json({ status: "OK" });
};