"use client"
import Image from "next/image"
import Logo from "../../../public/Images/LogoCasaJardin.png";
export default function Navigate () {
    return (
        
        <nav className="bg-blue-400 flex justify-between w-full py-2 px-8">
        <div className="flex items-center">
            <Image src={Logo} alt="Logo Casa Jardin" width={50} height={50}/>
            <h1 className="ml-2">Casa Jardín</h1>
        </div>
        <div className="ml-auto flex space-x-4 py-2">
            <a className="mx-2" href="">Inicio</a>
            <a className="mx-2" href="">Espacio</a>
            <a className="mx-2" href="">Talleres</a>
            <a className="mx-2" href="">Profesionales</a>
            <a className="mx-2" href="">Pagos</a>
            <a className="mx-2" href="http://localhost:3000/start/login">Salir</a>
        </div>
        </nav>
    )
}