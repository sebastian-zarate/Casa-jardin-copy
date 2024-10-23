"use client"
import React, { useState, useEffect } from 'react';
import SeleccionTaller from './componentes/seleccionTaller';
import But_aside from "../../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../../components/alumno/navigate/page';
import DatosMenor from './componentes/datosMenor';
import CondicionSalud from './componentes/condicionSalud';
import AutorizacionImg from './componentes/autorizacionImagen';
import AutorizacionSalidas from './componentes/autorizacionSalidas';
import Reglamentacion from './componentes/reglamentacion';
import DatosMayor from './componentes/datosMayor';

const Menores: React.FC = () => {
    // Estado para almacenar la pantalla actual
    const [selectedScreen, setSelectedScreen] = useState<number>(0);
    // Estado para almacenar los cursos seleccionados
    const [selectedCursosId, setSelectedCursosId] = useState<number[]>([]);
    const [datosMenor, setDatosMenor] = useState({
        nombre: "",
        apellido: "",
        edad: 0,
        fechaNacimiento: "",
        dni: "",
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
    });
    const [datosMayor, setDatosMayor] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        correoElectronico: "",
        dni: "",
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
    });
    const [datosSalud, setDatosSalud] = useState({
        enfermedad: "",
        alergia: "",
        tratamiento: "",
        terapia: "",
        consultasEspecialistas: "",
        motivoInscripcion: ""
    });
    const [datosAutorizacionImage, setDatosAutorizacionImage] = useState({
        firma: "",
        observaciones: "",
    });
    const [datosAutorizacionSalidas, setDatosAutorizacionSalidas] = useState({
        firma: "",
        observaciones: "",
    });
    const [datosReglamentacion, setDatosReglamentacion] = useState({
        firma: "",
    });
    //datos menor: nombre, apellido, edad, fecha de nacimiento, dni,pais, localidad,calle
    //datos mayor: nombre, apellido, telefono, correo electronico, dni, pais, localidad, calle
    //datos salud: enfermedad ?, alergia?, tratamiento o medicacion?, terapia?, consultas a especialistas (neurologo, cardiologo, fisioterapeutas, etc.)
    //datos autorizacionImage: firmo el mayor a cargo?, observaciones? puede ser nulo
    //datos autorizacionSalidas: firmo el mayor a cargo?, observaciones? puede ser nulo
    //datos reglamentacion: firmo?
    return (
        <main>
            <div className="relative bg-red-500  justify-between w-full p-4" >
                <Navigate />
            </div>

            <div style={{ height: (selectedScreen < 6  ? '65vh' : '100vh') }}>
                {selectedScreen === 0 && (<SeleccionTaller
                    setSelectedCursosId={setSelectedCursosId}
                    selectedCursosId={selectedCursosId}
                />)}
                {selectedScreen === 1 && (<DatosMenor
                    setDatosMenor={setDatosMenor}
                />)}
                {selectedScreen === 2 && (<DatosMayor
                    setDatosMayor={setDatosMayor}
                />)}
                {selectedScreen === 3 && (<CondicionSalud
                    setDatosSalud={setDatosSalud}
                />)}
                {selectedScreen === 4 && (<AutorizacionImg
                    setDatosAutorizacionImage={setDatosAutorizacionImage}
                />)}
                {selectedScreen === 5 && (<AutorizacionSalidas
                    setDatosAutorizacionSalidas={setDatosAutorizacionSalidas}
                />)}
                {selectedScreen === 6 && (<Reglamentacion
                    setDatosReglamentacion={setDatosReglamentacion}
                />)}

            </div>
            {selectedScreen < 6 && <div className=' p-5 w-full '>
                <div className='flex mb-5 justify-center space-x-80 '>
                    <button
                        className='mx-2 py-2 bg-gray-300 rounded px-6'
                        onClick={() => { selectedScreen - 1 < 0 ? window.location.href = "http://localhost:3000/usuario/Solicitud/Inscripcion" : setSelectedScreen(selectedScreen - 1); }}
                    >Volver</button>
                    <button
                        className='mx-2 py-2 bg-gray-300 rounded px-4 '
                        onClick={() => setSelectedScreen(selectedScreen + 1)}
                    >Continuar</button>
                </div>
            </div>}
            {selectedScreen === 6 && <div className='p-5 w-full '>
                <div className='flex mb-5 justify-center space-x-80 '>
                    <button
                        className='mx-2 py-2 bg-gray-300 rounded px-5'
                        onClick={() => setSelectedScreen(selectedScreen - 1)}
                    >Volver</button>
                    <button
                        className='mx-2 py-2 bg-gray-300 rounded px-5 '
                    /* onClick={() => setSelectedScreen(selectedScreen + 1)} */
                    >Enviar</button>
                </div>
            </div>}

            <div className="py-5 border-t bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
        </main>
    )
}
export default Menores;