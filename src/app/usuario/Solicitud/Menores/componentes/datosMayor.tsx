"use client"
import React, { useState } from 'react';


interface Datos {
    setDatosMayor: React.Dispatch<React.SetStateAction<{
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
    }>>;
    datosMayor: {
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
    };
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const DatosMayor: React.FC<Datos> = ({ setDatosMayor, datosMayor, setError}) => {
    // Estado para almacenar mensajes de error

   
    return (
        <div>

            <div className='flex flex-col'>
                <h1 className='flex  items-center justify-center  font-bold text-2xl'>Datos del Mayor</h1>
                <div className='flex  justify-center '>
                    <div className=" mx-auto  rounded-lg  px-8 py-6 grid grid-cols-2 gap-x-12 max-w-2xl">
                        <div className='flex-col p-3 flex '>
                            <label htmlFor="nombre">Nombre</label>
                            <input id='nombre' type="text" placeholder="Ingrese el nombre"  value = {datosMayor.nombre} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, nombre: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="apellido">Apellido</label>
                            <input id='apellido' type="text" placeholder="Ingrese el apellido" value = {datosMayor.apellido} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, apellido: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="telefono">Teléfono</label>
                            <input id='telefono' type="Number" placeholder="Ingrese el teléfono" value = {datosMayor.telefono} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, telefono: parseInt(e.target.value) }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="correoElectronico">Correo Electrónico</label>
                            <input id='correoElectronico' type="Ingrese el email" placeholder="Correo Electrónico" value = {datosMayor.correoElectronico} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, correoElectronico: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="dni">DNI</label>
                            <input id='dni' type="Number" placeholder="Ingrese el DNI" value = {datosMayor.dni} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, dni: parseInt(e.target.value) }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="pais">País</label>
                            <input id='pais' type="Text" placeholder="Ingrese el país" value = {datosMayor.pais} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, pais: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="provincia">Provincia</label>
                            <input id='provincia' type="text" placeholder="Ingrese la provincia" value = {datosMayor.provincia} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, provincia: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="localidad">Localidad</label>
                            <input id='localidad' type="text" placeholder="Ingrese la localidad" value = {datosMayor.localidad} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, localidad: e.target.value }))} />
                        </div>

                        <div className='flex-col p-3 flex '>
                            <label htmlFor="calle">Calle</label>
                            <input id='calle' type="text" placeholder="Ingrese la calle"  value = {datosMayor.calle} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, calle: e.target.value }))} />
                        </div>
                        
                        <div className='flex-col p-3 flex '>
                            <label htmlFor="numero">Número</label>
                            <input id='numero' type="Number" placeholder="Ingrese el número"  value = {datosMayor.numero} className="border rounded" onChange={(e) => setDatosMayor(prev => ({ ...prev, numero: parseInt(e.target.value) }))} />
                        </div>

                    </div>
                </div>
            </div>


        </div>
    )
}
export default DatosMayor;