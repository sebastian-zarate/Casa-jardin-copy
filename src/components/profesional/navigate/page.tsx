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

  const styles = {
    inactiveTextColor: "text-white",
    hoverTextColor: "hover:text-gray-800",
    underline: "border-b-2 border-transparent hover:border-white",
};

function NavLink({ href, children, onClick, className }: { href?: string, children: React.ReactNode, onClick?: () => void, className?: string }) {
    return (
        <a
            className={`${styles.inactiveTextColor} px-4 py-2 font-medium ${styles.hoverTextColor} ${styles.underline} duration-300 ${className}`}
            href={href}
            onClick={onClick}
        >
            {children}
        </a>
    );
}




    return (

        <nav className="bg-red-500 flex justify-between w-full p-5">
            <div className="flex items-center">
                <Image src={Logo} alt="Logo Casa Jardin" width={50} height={50}/>
                <h1 className="ml-2 text-white">Casa Jardín</h1>
            </div>
            <div className="ml-auto flex space-x-4 py-2 text-white hover:">
                <NavLink href="/profesional/cronogramap/listar" className="p-2">Calendario</NavLink>
                <NavLink className="p-2" href="/profesional/principal">Principal</NavLink>  
                <NavLink className="p-2" onClick={logout}>Salir</NavLink>          
                
            </div>
        </nav>
    )
}