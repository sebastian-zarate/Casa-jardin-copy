"use client"
import React, { useState } from 'react';


interface Datos {
    setDatosAlumno: React.Dispatch<React.SetStateAction<{
        nombre: string;
        apellido: string;
        telefono: number;
        correoElectronico: string;
        dni: number;
        pais: string;
        provincia: string;
        localidad: string;
        calle: string;
        numero: number;
        fechaNacimiento: string;
    }>>;
    datosAlumno: {
        nombre: string;
        apellido: string;
        telefono: number;
        correoElectronico: string;
        dni: number;
        pais: string;
        provincia: string;
        localidad: string;
        calle: string;
        numero: number;
        fechaNacimiento: string;
    };
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const DatosAlumno: React.FC<Datos> = ({ setDatosAlumno, datosAlumno, setError }) => {
    // Estado para almacenar mensajes de error

    return (
        <div>
            <div className='p-4'>
                <h3 className='p-2 shadow-md w-60'>Inscripción a talleres - Mayores</h3>
            </div>

            <div className='flex flex-col'>
                <h1 className='flex  items-center justify-center  font-bold text-2xl'>Datos del Alumno</h1>
                <div className='flex  justify-center '>
                    <div className=" mx-auto  rounded-lg  px-8 py-6 grid grid-cols-2 gap-x-12 max-w-2xl">
                        <div className='flex-col p-3 flex '>
                            <label htmlFor="nombre">Nombre</label>
                            <input id='nombre'
                                type="text"
                                placeholder="Ingrese el nombre"
                                className="border rounded"
                                value={datosAlumno.nombre}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, nombre: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="apellido">Apellido</label>
                            <input id='apellido'
                                type="text"
                                placeholder="Ingrese el apellido"
                                className="border rounded"
                                value={datosAlumno.apellido}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, apellido: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="telefono">Teléfono</label>
                            <input id='telefono'
                                type="text"
                                placeholder="Ingrese el teléfono"
                                className="border rounded"
                                value={datosAlumno.telefono}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, telefono: parseInt(e.target.value) }))} />
                        </div>

                        <div className="flex-col p-3 flex">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                            <input
                                id="fechaNacimiento"
                                type="date"
                                className="border rounded"
                                value={datosAlumno.fechaNacimiento ?? ''}
                                onChange={(e) =>
                                    setDatosAlumno((prev) => ({
                                        ...prev,
                                        fechaNacimiento: e.target.value,
                                    }))
                                }
                                min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]} // Set min to 100 years ago
                                max={new Date().toISOString().split('T')[0]} // Set max to today's date
                                required
                            />
                        </div>
                        <div className='flex-col p-3 flex '>
                            <label htmlFor="correoElectronico">Correo Electrónico</label>
                            <input id='correoElectronico'
                                type="text"
                                placeholder="Ingrese el correo electrónico"
                                className="border rounded"
                                value={datosAlumno.correoElectronico}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, correoElectronico: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="dni">DNI</label>
                            <input id='dni'
                                type="text"
                                placeholder="Ingrese el DNI"
                                className="border rounded"
                                value={datosAlumno.dni}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, dni: parseInt(e.target.value) }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="pais">País</label>
                            <input id='pais'
                                type="text"
                                placeholder="Ingrese el país"
                                className="border rounded"
                                value={datosAlumno.pais}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, pais: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="provincia">Provincia</label>
                            <input id='provincia'
                                type="text"
                                placeholder="Ingrese la provincia"
                                className="border rounded"
                                value={datosAlumno.provincia}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, provincia: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="localidad">Localidad</label>
                            <input id='localidad'
                                type="text"
                                placeholder="Ingrese la localidad"
                                className="border rounded"
                                value={datosAlumno.localidad}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, localidad: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="calle">Calle</label>
                            <input id='calle'
                                type="text"
                                placeholder="Ingrese la calle"
                                className="border rounded"
                                value={datosAlumno.calle}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, calle: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="numero">Número</label>
                            <input id='numero'
                                type="text"
                                placeholder="Ingrese el número"
                                className="border rounded"
                                value={datosAlumno.numero}
                                onChange={(e) => setDatosAlumno(prev => ({ ...prev, numero: parseInt(e.target.value) }))} />
                        </div>

                    </div>
                </div>
            </div>


        </div>
    )
}
export default DatosAlumno;