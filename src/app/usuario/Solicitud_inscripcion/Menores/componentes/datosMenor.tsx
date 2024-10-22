"use client"
import React, { useState } from 'react';


/* interface Datos {
    setSelectedCursosId: React.Dispatch<React.SetStateAction<number[]>>;
    selectedCursosId: number[];
} */

const DatosMenor: React.FC/* <Datos>  */= (/* {setSelectedCursosId, selectedCursosId} */) => {
    // Estado para almacenar la lista de cursos
    const [cursos, setCursos] = useState<{ id: number; nombre: string; year: number; descripcion: string }[]>([]);

       // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");

/* 
    const handleButtonClick = (id: number) => {
        setSelectedCursosId(prevSelectedCursoId => {
            //si el id ya está en el array, lo elimina
            if (prevSelectedCursoId.includes(id)) {
                return prevSelectedCursoId.filter(prevId => prevId !== id);
            } else {
                //si el id no está en el array, lo agrega
                return [...prevSelectedCursoId, id];
            }
        });
    }; */

    return (
        <div>
            <div className='p-4'>
                <h3 className='p-2 shadow-md w-60'>Inscripción a talleres - Menores</h3>
            </div>
            <div className='flex justify-center mt-20'>
                <h1 className='font-bold text-xg'>Elija los talleres de interés</h1>
            </div>
            

        </div>
    )
}
export default DatosMenor;