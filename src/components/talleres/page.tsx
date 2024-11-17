
import { Curso, getCursoById, getCursos } from '@/services/cursos';
import { getCursosByIdProfesional } from '@/services/profesional_curso';
import React, { useState, useEffect } from 'react';
import withAuth from '../Admin/adminAuth';
import { getCursosByIdAlumno } from '@/services/alumno_curso';

interface cursosProps {
    cursosElegido: any[]
    setCursosElegido: React.Dispatch<React.SetStateAction<any[]>>;
    user?: any;
    crearEstado?: number;
}
const Talleres: React.FC<cursosProps> = ({ cursosElegido, setCursosElegido, user, crearEstado }) => {
    const [cursos, setCursos] = useState<any[]>([]);
    const [cursosElegidosNombre, setCursosElegidosNombre] = useState<string[]>([]);
    const [cursosIns, setCursosIns] = useState<any[]>([]);
    useEffect(() => {
        const handleCursos = async () => {
            try {
                const cur = await getCursos();
                setCursos(cur);
                let cursosInscritos;
                if (crearEstado !== -1 && crearEstado !== -2) {
                    if (user.rolId === 2) {
                        cursosInscritos = await getCursosByIdAlumno(user.id);
                        console.log(cursosInscritos);
                        setCursosIns(cursosInscritos);

                    }
                    if (user.rolId === 3) {
                        cursosInscritos = await getCursosByIdProfesional(user.id);
                        setCursosIns(cursosInscritos);
                    }
                }

            } catch (error) {
                console.error('Error al obtener los curos:', error);
            }
        };
        if (cursos.length === 0) {
            handleCursos();
        }

    }, [cursos]);

    //función para agregar los cursos elegidos
    async function addCursosElegidos(cursoId: number) {
        const curso = await getCursoById(cursoId);
        if (!curso) {
            return;
        }
        if (!cursosElegido.includes(curso)) {
            setCursosElegido([...cursosElegido, curso]);
            getCursoById(cursoId).then((curso) => {
                if (curso && curso.nombre) {
                    if (!cursosElegidosNombre.includes(String(curso.nombre))) {
                        setCursosElegidosNombre([...cursosElegidosNombre, String(curso.nombre)]);
                    }
                }
            });
        }
        setCursos([])
    }

    // Función para eliminar los cursos elegidos
    /* function removeCursoElegido(cursoId: number) {
        console.log(cursosElegido);
        const updatedCursosElegido = cursosElegido.filter(curso => curso.id !== cursoId);
        setCursosElegido(updatedCursosElegido);
    
        const curso = cursosElegido.find(curso => curso.id === cursoId);
        const updatedCursosElegidosNombre = cursosElegidosNombre.filter(nombre => nombre !== curso.nombre);
        setCursosElegidosNombre(updatedCursosElegidosNombre);
    } */

    return (
        <div >
            {(crearEstado !== -1 && crearEstado !== -2) && <h1>Talleres inscriptos:</h1>}
            <div className='border' style={{ height: '80px', overflow: 'auto' }}>

                {(crearEstado !== -1 && crearEstado !== -2) && cursosIns.map((curso: { nombre: string, id: number }, index: number) => (
                    <React.Fragment key={index}>
                        <div className='flex py-2 px-5 m-1 bg-slate-400 text-black  rounded' key={index} >
                            <h1  className='text-black'>{curso.nombre}</h1>
                            <button className='absolute right-12 mr-5'>X</button>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            <select onChange={(e) => { addCursosElegidos(Number(e.target.value)) }}>
                <option value="">Seleccione un taller:</option>
                {cursos.map((curso: { nombre: string, id: number }, index: number) => (
                    <option key={index} value={curso.id}>
                        {curso.nombre}
                    </option>
                ))}
            </select>
            {cursosElegidosNombre && cursosElegidosNombre.length > 0 && cursosElegidosNombre.map((curso, index: number) => (
                <div key={index} className='flex items-center'>
                    <h1>{curso}</h1>
                </div>
            ))}
            <button onClick={() => { setCursosElegido([]); setCursosElegidosNombre([]) }} className='ml-2 text-red-600'>Eliminar</button>
        </div>
    );
};

export default (Talleres);
