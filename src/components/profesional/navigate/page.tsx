"use client";
import Image from "next/image";
import Logo from "../../../../public/Images/LogoCasaJardin.png";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Navigate() {
  const [userLink, setUserLink] = useState<string>("");
  const router = useRouter(); 

  const logout = async () => {
    try {
      const response = await fetch('/api/deleteCookie', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push("/start/login");
      } else {
        console.error('Error al cerrar sesión:', await response.json());
      }
    } catch (error) {
      console.error('Error en la solicitud de cierre de sesión:', error);
    }
  };
    return (

        <nav className="bg-red-500 flex justify-between w-full p-5">
            <div className="flex items-center">
                <Image src={Logo} alt="Logo Casa Jardin" width={50} height={50}/>
                <h1 className="ml-2">Casa Jardín</h1>
            </div>
            <div className="ml-auto flex space-x-4 py-2">
                <a className="p-2" href="/profesional/cronogramap/listar">Calendario</a>
                <a className="p-2" href="/profesional/principal">Principal</a>  
                <button className="p-2" onClick={logout}>Salir</button>          
                
            </div>
        </nav>
    )
}