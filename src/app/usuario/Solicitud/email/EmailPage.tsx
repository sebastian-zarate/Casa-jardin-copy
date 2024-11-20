"use client";
import { useState, useEffect } from "react";
import { emailTest } from "@/helpers/email/email";
import { sendEmail } from "@/helpers/sendmail";
import { obtenerCodigoConfirmacion } from "@/services/redis";
import { autorizarUser, fetchUserData } from "@/helpers/cookies";
import { useRouter } from "next/navigation";
import withAuthUser from "../../../../components/alumno/userAuth";
import { send } from "process";
interface Datos {
  email: string; //Email del usuario logeado
  setCorrecto: React.Dispatch<React.SetStateAction<boolean>>;
  correcto: boolean;
  setVerifi: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmailPage: React.FC<Datos> = ({email, setCorrecto, correcto, setVerifi }) => {
  //function EmailPage({ setCorrecto, correcto }: Datos) {
  // Estados para gestionar los datos del formulario y errores
  const [codigo, setCodigo] = useState("");

  const handleEmail = async () => {
    console.log("enviando Email a: ", email);
    if (email === "") return;
    await sendEmail(email);
    console.log("Email enviado");
  }
  
 
  const handleVerificarCodigo = async () => {
    setVerifi(true)
    const codigoGuardado = await obtenerCodigoConfirmacion(email)
    if (codigoGuardado === codigo) {
      setCorrecto(true)
      console.log("Codigo correcto")
    } else {
      setCorrecto(false)
      console.log("Codigo incorrecto")
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
      <h1>Se enviará un código de verificación a: </h1>
      <h1 className="font-bold"> {email} </h1>
      <h1>Una vez enviado, el código será válido por 5 minutos.</h1>
      <button className="bg-black text-white p-2 rounded" onClick={handleEmail}>Enviar Código</button>
      <input
        type="text"
        onChange={(e) => setCodigo(e.target.value)}
        className="p-2 border rounded"
        placeholder="Ingrese el código recibido"
      />
      <button className="bg-black text-white p-2 rounded" onClick={handleVerificarCodigo }>Verificar</button>
    </div>
  );
}
export default EmailPage;