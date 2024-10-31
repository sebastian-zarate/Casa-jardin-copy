import React, { useState, useEffect } from "react";
import { emailTest } from "@/helpers/email";
import { obtenerCodigoConfirmacion } from "@/services/redis";
import { autorizarUser, fetchUserData } from "@/helpers/cookies";
import { useRouter } from "next/navigation";
import { changePassword } from "@/services/Alumno";

interface Datos {
  setCorrecto: React.Dispatch<React.SetStateAction<boolean>>;
  correcto: boolean;
}

const PasswordComponent: React.FC<Datos> = ({ setCorrecto, correcto }) => {
  //function EmailPage({ setCorrecto, correcto }: Datos) {
  // Estados para gestionar los datos del formulario y errores
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");

  const[password, setPassword] = useState("")
  const[newPasword, setNewPassword] = useState("")
  const[error, setError] = useState("")

  useEffect(()=> {
    if(error !== "") {
      setTimeout(() => {
        setError("")
      }, 5000)
    }
  },[error])
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
    if (email === "") return
    emailTest(email)
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
  const changePassw = async () => {
    if(password === "" || newPasword === "") return setError("Debe completar todos los campos")
    const passw= await changePassword(password, newPasword,email)
    if(typeof passw === "string") return setError(passw)
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
      {correcto && (
        <div>
          <div>
            <label htmlFor="">Ingrese su contraseña:</label>
            <input 
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="">Ingrese la nueva contraseña:</label>
            <input 
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button onClick={()=> changePassw()}>Cambiar</button>
          {error && <p>{error}</p>}
        </div>

      )}
    </div>
  );
}
export default PasswordComponent;