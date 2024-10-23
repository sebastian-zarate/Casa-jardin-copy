"use client"
import React, { useState } from 'react';


interface Datos {
    setDatosMayor: React.Dispatch<React.SetStateAction<{
        nombre: string;
        apellido: string;
        telefono: string;
        correoElectronico: string;
        dni: string;
        pais: string;
        provincia: string;
        localidad: string;
        calle: string;
    }>>;
}

const DatosMayor: React.FC<Datos> = ({ setDatosMayor }) => {
    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");
    return (
        <div>
            <div className='p-4'>
                <h3 className='p-2 shadow-md w-60'>Inscripción a talleres - Menores</h3>
            </div>

            <div className='flex flex-col'>
                <h1 className='flex  items-center justify-center  font-bold text-2xl'>Datos del Mayor</h1>
                <div className='flex  justify-center '>
                    <div className=" mx-auto  rounded-lg  px-8 py-6 grid grid-cols-2 gap-x-12 max-w-2xl">
                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="nombre">Nombre</label>
                            <input id='nombre' type="text" placeholder="Nombre" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, nombre: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="apellido">Apellido</label>
                            <input id='apellido' type="text" placeholder="Apellido" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, apellido: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="telefono">Teléfono</label>
                            <input id='telefono' type="text" placeholder="Teléfono" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, telefono: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="correoElectronico">Correo Electrónico</label>
                            <input id='correoElectronico' type="email" placeholder="Correo Electrónico" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, correoElectronico: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="dni">DNI</label>
                            <input id='dni' type="text" placeholder="DNI" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, dni: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="pais">País</label>
                            <input id='pais' type="text" placeholder="País" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, pais: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="provincia">Provincia</label>
                            <input id='provincia' type="text" placeholder="Provincia" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, provincia: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="localidad">Localidad</label>
                            <input id='localidad' type="text" placeholder="Localidad" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, localidad: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex bg-red-200'>
                            <label htmlFor="calle">Calle</label>
                            <input id='calle' type="text" placeholder="Calle" className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, calle: e.target.value }))} />
                        </div>


                    </div>
                </div>
            </div>


        </div>
    )
}
export default DatosMayor;