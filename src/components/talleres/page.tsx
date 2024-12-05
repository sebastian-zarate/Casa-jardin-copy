
import { Curso, getCursoById, getCursos } from '@/services/cursos';
import { getCursosByIdProfesional } from '@/services/profesional_curso';
import React, { useState, useEffect } from 'react';
import withAuth from '../Admin/adminAuth';
import { deleteAlumno_Curso, getCursosByIdAlumno } from '@/services/alumno_curso';
import Loader from '../Loaders/loadingTalleres/page';
import { Delete, OctagonX, Square, SquareDashed, SquareX, X } from 'lucide-react';

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
    const [loadinCursos, setLoadinCursos] = useState<boolean>(true);
    const [cursoAEliminar, setCursoAEliminar] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
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
                        setLoadinCursos(false);

                    }
                    if (user.rolId === 3) {
                        cursosInscritos = await getCursosByIdProfesional(user.id);
                        setCursosIns(cursosInscritos);
                        setLoadinCursos(false);
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
    function removeCursoElegido(cursoId: number) {
        console.log(cursosElegido);
        const updatedCursosElegido = cursosElegido.filter(curso => curso.id !== cursoId);
        setCursosElegido(updatedCursosElegido);

        const curso = cursosElegido.find(curso => curso.id === cursoId);
        const updatedCursosElegidosNombre = cursosElegidosNombre.filter(nombre => nombre !== curso.nombre);
        setCursosElegidosNombre(updatedCursosElegidosNombre);
    }

    const handleDelete = async (cursoId: number) => {
        setIsDeleting(true);
        const alumnCursDelet = await deleteAlumno_Curso(user.id, cursoId);
        console.log("alumnoCurso borrado", alumnCursDelet);
        const updatedCursosIns = cursosIns.filter((curso: { id: number }) => curso.id !== cursoId);
        setCursosIns(updatedCursosIns);
        setIsDeleting(false);
        setCursoAEliminar(null);
    }

    return (
        <div >
            {(crearEstado !== -1 && crearEstado !== -2) && <h1>Talleres inscriptos:</h1>}
            <div className='border' style={{ height: '20vh', overflow: 'auto' }}>
                {loadinCursos && (crearEstado !== -1 && crearEstado !== -2) &&
                    <>
                        <div className='absolute w-full left-1/2 -translate-x-5'>
                            <Loader />
                        </div>

                    </>
                }
                {!loadinCursos && (crearEstado !== -1 && crearEstado !== -2) && cursosIns.map((curso: { nombre: string, id: number }, index: number) => (
                    <React.Fragment key={index}>
                        <div className='flex justify-between py-2 px-5 m-1 bg-slate-400 text-black  rounded' key={index} >
                            <h1 className='text-black'>{curso.nombre}</h1>
                            <button onClick={() => setCursoAEliminar(curso)}>
                                <SquareX className='w-5 h-5  hover:text-red-500' />
                            </button>
                        </div>
                    </React.Fragment>
                ))}
            </div>
            {cursoAEliminar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <h2 className="text-lg mb-4">Confirmar Eliminación</h2>
                        <p>
                            ¿Estás seguro de que deseas eliminar el taller:{" "}
                            <strong>{cursoAEliminar.nombre}</strong>?
                        </p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => {
                                    handleDelete(cursoAEliminar.id);
                                }}
                                disabled={isDeleting}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                            >
                                {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                            </button>
                            <button
                                onClick={() => setCursoAEliminar(null)}
                                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <select onChange={(e) => { addCursosElegidos(Number(e.target.value)) }}>
                <option value="">Seleccione un taller:</option>
                {cursos.map((curso: { nombre: string, id: number }, index: number) => (
                    <option key={index} value={curso.id}>
                        {curso.nombre}
                    </option>
                ))}
            </select>
            {cursosElegidosNombre && cursosElegidosNombre.length > 0 && cursosElegidosNombre.map((curso, index: number) => (
                <div key={index} className='flex items-center border rounded-md shadow-md'>
                    <h1 className='p-2 w-full underline text-md '>{curso}</h1>
                </div>
            ))}
            <button 
            onClick={() => { setCursosElegido([]); setCursosElegidosNombre([]) }} 
            className='ml-2 text-red-600'
            >
                Eliminar
            </button>
        </div>
    );
};

export default (Talleres);
