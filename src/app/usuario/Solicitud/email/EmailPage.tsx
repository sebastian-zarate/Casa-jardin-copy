"use client";
import { useState, useEffect } from "react";
import { emailTest } from "@/helpers/email";
import { obtenerCodigoConfirmacion } from "@/services/redis";
import {autorizarUser, fetchUserData } from "@/helpers/cookies";
import { useRouter } from "next/navigation";
import withAuthUser from "../../../../components/alumno/userAuth";
interface Datos {
  setCorrecto: React.Dispatch<React.SetStateAction<boolean>>;
  correcto: boolean;
}

 const EmailPage: React.FC<Datos> = ({ setCorrecto, correcto }) => {
 //function EmailPage({ setCorrecto, correcto }: Datos) {
  // Estados para gestionar los datos del formulario y errores
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  //  const [correcto, setCorrecto] = useState(false);
/*   const router = useRouter();

  // Para cambiar al usuario de página si no está logeado
  useEffect(() => {
    const authorizeAndFetchData = async () => {
      console.time("authorizeAndFetchData");
      // Primero verifico que el user esté logeado
      await autorizarUser(router);
      // Una vez autorizado obtengo los datos del user y seteo el email
      const user = await fetchUserData();
      setEmail(user.email);
      console.timeEnd("authorizeAndFetchData");
    };

    authorizeAndFetchData();
  }, [router]); */
  const handleEmail = async () => {
    if (email === "") return;
    else emailTest(email)
  }

  const handleVerificarCodigo = async () => {
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
      <h1>Escriba mail para recibir el código: </h1>
      <input
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
        placeholder="Ingrese su correo"
      />
      <button className="bg-black text-white p-2 rounded" onClick={handleEmail}>Enviar Código</button>
      <h1>Verificar código:</h1>
      <input
        type="text"
        onChange={(e) => setCodigo(e.target.value)}
        className="p-2 border rounded"
        placeholder="Ingrese el código"
      />
      <button className="bg-black text-white p-2 rounded" onClick={handleVerificarCodigo}>Verificar</button>
      {correcto ? (
        <h1 style={{ color: "green" }}>Código correcto!</h1>
      ) : (
        <h1 style={{ color: "red" }}></h1>
      )}
    </div>
  );
}
export default EmailPage;