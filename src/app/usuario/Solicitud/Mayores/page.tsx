"use client"
import React, { useState, useEffect } from 'react';
import But_aside from "../../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../../components/alumno/navigate/page';
import AutorizacionImg from './componentes/autorizacionImagen';
import Reglamentacion from './componentes/reglamentacion';
import SeleccionTaller from './componentes/seleccionTaller';
import DatosMayor from './componentes/datosMayor';

const Mayores: React.FC = () => {
    // Estado para almacenar la pantalla actual
    const [selectedScreen, setSelectedScreen] = useState<number>(0);
    // Estado para almacenar los cursos seleccionados
    const [selectedCursosId, setSelectedCursosId] = useState<number[]>([]);

    const [datosMayor, setDatosMayor] = useState({
        nombre: "",
        apellido: "",
        telefono: 0,
        correoElectronico: "",
        dni: 0,
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
        numero: 0,
    });
    const [datosAutorizacionImage, setDatosAutorizacionImage] = useState({
        firma: "",
        observaciones: "",
    });
    const [datosReglamentacion, setDatosReglamentacion] = useState({
        firma: "",
    });

    const [error, setError] = useState<string>('');
    //datos mayor: nombre, apellido, telefono, correo electronico, dni, pais, localidad, calle
    //datos autorizacionImage: firmo el mayor a cargo?, observaciones? puede ser nulo
    //datos reglamentacion: firmo?
    function validateDatos() {
        // carrateres especiales en el nombre y la descripción
        const regex = /^[a-zA-Z0-9_ ,.;áéíóúÁÉÍÓÚñÑüÜ@]*$/; // no quiero que tenga caracteres especiales que las comas y puntos afecten 


        if(selectedScreen === 0 && selectedCursosId.length === 0) return "Debe seleccionar al menos un taller";
        if (selectedScreen === 1) {
            // Validar que el nombre tenga al menos 2 caracteres
            if (datosMayor.nombre.length < 1 && regex.test(datosMayor.nombre)) {
                return ("El nombre debe tener al menos 2 caracteres.");
            }
            if (datosMayor.apellido.length < 1  && regex.test(datosMayor.apellido)) {
                return ("El apellido debe tener al menos 2 caracteres.");
            }
            if ((datosMayor.telefono).toString().length != 9) {
                return ("El telefono debe tener al menos 9 números.");
            }
            if (datosMayor.correoElectronico.length < 11 || !datosMayor.correoElectronico.includes('@')) {
                return ("El correo electrónico debe tener al menos 11 caracteres y contener '@'.");
            }
            if ((datosMayor.dni).toString().length != 8) {
                return ("El DNI debe tener al menos 8 números.");
            }
            if (datosMayor.pais.length < 1  && regex.test(datosMayor.pais)) {
                return ("El país debe tener al menos 2 caracteres.");
            }
            if (datosMayor.provincia.length < 1  && regex.test(datosMayor.provincia)) {
                return ("La provincia debe tener al menos 2 caracteres.");
            }
            if (datosMayor.localidad.length < 1  && regex.test(datosMayor.localidad)) {
                return ("La localidad debe tener al menos 2 caracteres.");
            }
            if (datosMayor.calle.length < 1  && regex.test(datosMayor.calle)) {
                return ("La calle debe tener al menos 2 caracteres.");
            }
            if (!datosMayor.numero) {
                return ("El número debe tener al menos 1 número.");
            }          
        }

        if (datosAutorizacionImage.firma.length < 1 && selectedScreen === 2) return "Debe firmar la autorización de imagen";
        if (datosReglamentacion.firma.length < 1 && selectedScreen === 3) return "Debe firmar la reglamentación";

        return ""
    }

    function continuar() {

        if (selectedScreen === 0 && selectedCursosId.length === 0) return setError("Debe seleccionar al menos un taller");
        const err = validateDatos();
        if (err != "") return setError(err);
        setSelectedScreen(selectedScreen + 1)
    }
    return (

        <main>
            <div className="relative bg-red-500 justify-between w-full p-4">
                <Navigate />
            </div>

            <div id='miDiv' style={{ height: (selectedScreen < 3 ? '60vh' : 'auto') }}>
                {selectedScreen === 0 && (
                    <SeleccionTaller
                        setSelectedCursosId={setSelectedCursosId}
                        selectedCursosId={selectedCursosId}
                    />
                )}

                {selectedScreen === 1 && (
                    <DatosMayor
                        setDatosMayor={setDatosMayor}
                        datosMayor={datosMayor}
                        setError={setError}
                    />
                )}
                {selectedScreen === 2 && (
                    <AutorizacionImg
                        setDatosAutorizacionImage={setDatosAutorizacionImage}
                    />
                )}
                {selectedScreen === 3 && (
                    <Reglamentacion
                        setDatosReglamentacion={setDatosReglamentacion}
                    />
                )}
            </div>

            {selectedScreen < 3 && (
                <div className='p-5 w-full'>
                    <div className='flex mb-5 justify-center space-x-80'>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-6'
                            onClick={() => {
                                selectedScreen - 1 < 0
                                    ? window.location.href = "http://localhost:3000/usuario/Solicitud/Inscripcion"
                                    : setSelectedScreen(selectedScreen - 1);
                            }}
                        >
                            Volver
                        </button>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-4'
                            onClick={() => continuar()}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            {selectedScreen === 3 && (
                <div className='p-5 w-full'>
                    <div className='flex mb-5 justify-center space-x-80'>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-5'
                            onClick={() => setSelectedScreen(selectedScreen - 1)}
                        >
                            Volver
                        </button>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-5'
                  /*           onClick={() => validarEnvio()} */
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}

          { error != '' &&  <div className="absolute top-1/2 right-1/3 transform -translate-x-1/3 -translate-y-1/4 bg-white border p-4 rounded-md shadow-md w-96">
                <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <div className="flex justify-end space-x-2">
                    <button 
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        onClick={() => setError('')}
                        >
                        Cerrar
                    </button>
                </div>
            </div>}
            <div className="py-5 border-t bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
        </main>
    )
}
export default Mayores;