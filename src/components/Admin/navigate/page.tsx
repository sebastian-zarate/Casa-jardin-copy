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
    <nav className="flex justify-between w-full p-3" style={{ background: "#1CABEB" }}>
      <div className="flex items-center">
        <Image src={Logo} alt="Logo Casa Jardin" width={50} height={50} />
        <h1 className="ml-2">Casa Jardín</h1>
      </div>
      <div className="ml-auto flex space-x-4 py-2">
        <a className="mx-2" href="/Admin/Inicio">Inicio</a>
        <a className="mx-2" href="/Admin/cursos">Talleres</a>
        <a className="mx-2" href="/Admin/aulaSelector">Cronogramas</a>
        <a className="mx-2" href="/Admin/aulas">Aulas</a>
        <label className="mx-2 cursor-pointer" onClick={() => setUserLink(userLink ? "" : "open")}>
          Usuario
        </label>
        {userLink && (
          <div className="absolute mt-10 w-38 right-20 bg-white border rounded shadow-lg">
            <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200" href="/Admin/alumnos">Alumnos</a>
            <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200" href="/Admin/profesionales">Profesionales</a>
          </div>
        )}
        <a className="mx-2" onClick={logout}  href="">Salir</a>
      </div>
    </nav>
  );
}
