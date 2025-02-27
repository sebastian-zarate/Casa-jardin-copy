"use client"
import React, { useState } from 'react';


interface Datos {
    setDatosAutorizacionImage: React.Dispatch<React.SetStateAction<{
        firma: string;
        observaciones: string;
    }>>;
}

const AutorizacionImg: React.FC<Datos> = ({ setDatosAutorizacionImage }) => {

    return (
        <div>

            <div className='flex flex-col '>
                <h1 className='flex justify-center  font-bold text-2xl'>Autorización para uso de Imagen</h1>
                <div className='flex  justify-center lg:w-1/2 md:1/2 sm:w-2/3 mx-auto mt-5 max-h-[45vh] overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-sm'>
                    <p className='mx-auto w-full md:'>Por medio de la presente, en mi carácter de Padre/Madre/ Tutor/Curador,
                        autorizo al Centro Educativo y Terapéutico “Casa Jardín”,
                        a utilizar de manera amplia, irrestricta y gratuita las imágenes
                        CUIDADAS del/la menor, que sean tomadas en las Actividades del mismo,
                        con la promoción, difusión y conocimiento de sus actividades.
                        <br />Renuncio expresa e irrevocablemente a todo y cualquier tipo de
                        reclamo contra el CET, sus directores, autoridades y miembros en relación
                        a los derechos autorizados por medio de la presente sobre las Imágenes y/o
                        a percibir cualquier suma en concepto de indemnización o remuneración por
                        los usos autorizados precedentemente indicados, relevando al CET de cualquier
                        responsabilidad al respecto.</p>
                </div>
                <div className='flex justify-center mt-4'>
                    <label className='flex items-center'>
                        <input type="checkbox" className='mr-2' onChange={(e) => {
                            if (e.target.checked) {
                                setDatosAutorizacionImage(prev => ({ ...prev, firma: "Autorizado" }));
                            } else {
                                setDatosAutorizacionImage(prev => ({ ...prev, firma: "" }));
                            }
                        }} />
                        Si está de acuerdo, marque la casilla
                    </label>
                </div>
                <div className='flex flex-col p-2  items-center'>
                    <label htmlFor="observaciones">Observaciones (opcional)</label>
                    <input className="w-[50vh] border rounded-md" type="text" name="observaciones" id="observaciones" onChange={(e) => setDatosAutorizacionImage(prev => ({ ...prev, observaciones: e.target.value }))} />
                </div>
            </div>
        </div>
    )
}
export default AutorizacionImg;