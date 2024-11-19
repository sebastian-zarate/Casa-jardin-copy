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
        //router.push("/start/login");
        window.location.href = "/start/login";
      } else {
        console.error('Error al cerrar sesión:', await response.json());
      }
    } catch (error) {
      console.error('Error en la solicitud de cierre de sesión:', error);
    }
  };

  const styles = {
    inactiveTextColor: "text-white",
    hoverTextColor: "hover:text-gray-800",
    underline: "border-b-2 border-transparent hover:border-white",
};

function NavLink({ href, children, onClick }: { href?: string, children: React.ReactNode, onClick?: () => void }) {
    return (
        <a
            className={`${styles.inactiveTextColor} cursor-pointer px-4 py-2 font-medium ${styles.hoverTextColor} ${styles.underline} duration-300`}
            href={href}
            onClick={onClick}
        >
            {children}
        </a>
    );
}




  return (
    <nav className="flex justify-between w-full p-3 bg-sky-600" style={{ fontFamily: "Cursive" }}>
      <div className="flex items-center">
        <Image src={Logo} alt="Logo Casa Jardin" width={50} height={50} />
        <h1 className="ml-2 text-white">Casa Jardín</h1>
      </div>
      <div className="ml-auto flex space-x-4 py-2 text-white">
        <NavLink href="/Admin/cursos">Talleres</NavLink>
        <NavLink href="/Admin/aulaSelector">Cronogramas</NavLink>
        <NavLink  href="/Admin/Solicitudes">Solicitudes</NavLink>
        <NavLink  onClick={() => setUserLink(userLink ? "" : "open")}>
          Usuario
        </NavLink>
        <NavLink  onClick={logout}>Salir</NavLink>
        {userLink && (
          <div className="absolute mt-10 w-38 right-20 bg-white border rounded shadow-lg z-50">
            <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200" href="/Admin/alumnos">Alumnos</a>
            <a className="block px-4 py-2 text-gray-800 hover:bg-gray-200" href="/Admin/profesionales">Profesionales</a>
          </div>
        )}
        
      </div>
    </nav>
  );
}