"use client"

export default function Navigate () {
    return (
        <nav className="bg-blue-400 flex justify-between w-full p-4">
            <div>
                <img src="" alt="" />  
                <h1>Casa Jardín</h1>
            </div>
            <div className="flex">
                <a className="mx-4" href="">Inicio</a>
                <a className="mx-4" href="">Talleres</a>
                <a className="mx-4" href="">Profesionales</a>
                <a className="mx-4" href="">Pagos</a>
                <a className="mx-4" href="http://localhost:3000/login">Salir</a>
            </div>
        </nav>
    )
}