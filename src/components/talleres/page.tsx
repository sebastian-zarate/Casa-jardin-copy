// components/LocalitiesSearch.tsx
import { getCursoById, getCursos } from '@/services/cursos';
import React, { useState, useEffect } from 'react';

interface cursosProps {
    cursosElegido: number[]
    setCursosElegido: React.Dispatch<React.SetStateAction<number[]>>;
}
const Talleres: React.FC<cursosProps> = ({cursosElegido, setCursosElegido}) => {
    const [cursos, setCursos] = useState<any>([]);
    const [cursosElegidosNombre, setCursosElegidosNombre] = useState<string[]>([]);
    useEffect(() => {
        const handleCursos = async () => {
            try {
                const cur = await getCursos();               
                setCursos(cur);

            } catch (error) {
                console.error('Error al obtener los curos:', error);
            }
        };
        if (cursos.length === 0) {
            handleCursos();
        }

    }, [cursos]);

//función para agregar los cursos elegidos
function addCursosElegidos(cursoId: number){
    if (!cursosElegido.includes(cursoId)) {
        setCursosElegido([...cursosElegido, cursoId]);
        getCursoById(cursoId).then((curso) => {
            if (curso && curso.nombre) {
                setCursosElegidosNombre([...cursosElegidosNombre, String(curso.nombre)]);
            }
        });
    }
    setCursos([])
}

    return (
        <div>
            <select onChange={(e) => {addCursosElegidos(Number(e.target.value))}}>
                <option value="">Selecciona un taller:</option>
                {cursos.map((curso: { nombre: string, id: number }) => (
                    <option key={curso.id} value={curso.id}>
                        {curso.nombre}
                    </option>
                ))}
            </select>
            {cursosElegidosNombre && cursosElegidosNombre.length > 0 && cursosElegidosNombre.map((curso: string, index: number) => (
            <div key={index}>
                <h1>{curso}</h1>
            </div>
            ))}
        </div>
    );
};

export default Talleres;
