"use client"
import React, { useState, useEffect } from 'react';
import SeleccionTaller from './componentes/seleccionTaller';
import But_aside from "../../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../../components/alumno/navigate/page';
import DatosMenor from './componentes/datosMenor';

const Menores: React.FC = () => {
    // Estado para almacenar la pantalla actual
    const [selectedScreen, setSelectedScreen] = useState<number>(0);
    // Estado para almacenar los cursos seleccionados
    const [selectedCursosId, setSelectedCursosId] = useState<number[]>([]);

    return (
        <main>
            <div className="relative bg-red-500  justify-between w-full p-4" >
                <Navigate />
            </div>

            <div>
                {selectedScreen === 0 && (<SeleccionTaller
                 setSelectedCursosId={setSelectedCursosId} 
                 selectedCursosId = {selectedCursosId} 
                 />)}
                {selectedScreen === 1 && <DatosMenor  />}
            {/* {selectedScreen === 2 && <SeleccionTaller />}
            {selectedScreen === 3 && <SeleccionTaller />}
            {selectedScreen === 4 && <SeleccionTaller />}
            {selectedScreen === 5 && <SeleccionTaller />}
            {selectedScreen === 6 && <SeleccionTaller />}
            {selectedScreen === 7 && <SeleccionTaller />} */}
            </div>
            <div className='absolute p-5  bottom-40 w-full '>
                <div className='flex mb-5 justify-center space-x-80 '>
                    <button
                        className='mx-2 p-2 bg-gray-300 rounded'
                        onClick={() => setSelectedScreen(selectedScreen - 1)}
                    >Volver</button>
                    <button
                        className='mx-2 p-2 bg-gray-300 rounded'
                        onClick={() => setSelectedScreen(selectedScreen + 1)}
                    >Continuar</button>
                </div>

            </div>
            <div className="fixed bottom-0 py-5 border-t bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
        </main>
    )
}
export default Menores;