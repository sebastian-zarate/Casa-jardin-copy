"use client";

import React, { useEffect, useState } from "react";
import Navigate from "../../helpers/navigate/page";
import But_aside from "../../helpers/but_aside/page";
import { updateCurso, getCursos } from "../../services/cursos";

const Cursos: React.FC = () => {
    // Estado para almacenar la lista de cursos
    const [cursos, setCursos] = useState<{ id: number; nombre: string; year: number; descripcion: string}[]>([]);
    // Estado para almacenar el ID del curso seleccionado
    const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
    // Estado para almacenar los detalles del curso seleccionado
    const [cursoDetails, setCursoDetails] = useState<{ nombre: string; year: number; descripcion: string; }>({
        nombre: '',
        year: 0,
        descripcion: ''
    });
    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Efecto para obtener la lista de cursos al montar el componente
    useEffect(() => {
        fetchCursos(); // Llama a la función para obtener cursos
    }, []);

    // Efecto para actualizar los detalles del curso seleccionado cuando cambia el curso o el ID del curso
    useEffect(() => {
        if (selectedCursoId !== null) {
            const selectedCurso = cursos.find(curso => curso.id === selectedCursoId); // Busca el curso seleccionado
            if (selectedCurso) {
                setCursoDetails({
                    nombre: selectedCurso.nombre,
                    year: selectedCurso.year,
                    descripcion: selectedCurso.descripcion
                }); // Actualiza los detalles del curso
            }
        }
    }, [selectedCursoId, cursos]);

    // Función para obtener la lista de cursos
    async function fetchCursos() {
        try {
            let curs = await getCursos(); // Obtén la lista de cursos
            setCursos(curs); // Actualiza el estado con la lista de cursos
        } catch (error) {
            console.error("Imposible obtener cursos", error); // Manejo de errores
        }
    }

    // Función para manejar los cambios en los campos del formulario
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setCursoDetails(prevDetails => ({
            ...prevDetails,
            [name]: name === 'year' ? parseInt(value, 10) : value // Convierte `year` a número entero
        }));
    }

    // Función para validar los detalles del curso
    function validateCursoDetails() {
        const { nombre, year, descripcion } = cursoDetails;
    
        // Validar que el nombre tenga al menos 4 caracteres
        if (nombre.length < 4) {
            return "El nombre debe tener al menos 4 caracteres.";
        }
        // Validar que el año sea mayor o igual a 2024 y que tenga hasta 4 dígitos
        if (year < 2024 || year > 9999) {
            return "El año debe ser mayor o igual a 2024 y tener hasta 4 dígitos.";
        }
        // Validar que la descripción tenga al menos 10 palabras
        const descripcionWords = descripcion.trim().split(/\s+/).length;
        if (descripcionWords < 10) {
            return "La descripción debe tener al menos 10 palabras.";
        }
        // Validar que la descripción no tenga más de 300 palabras
        if (descripcionWords > 300) {
            return "La descripción no puede exceder las 300 palabras.";
        }
        return null; // Retorna null si no hay errores
    }
    

    // Función para manejar el guardado de cambios en el curso
    async function handleSaveChanges() {
        const validationError = validateCursoDetails(); // Llama a la función de validación
        if (validationError) {
            setErrorMessage(validationError); // Muestra el mensaje de error si hay un error
            return;
        }

        if (selectedCursoId !== null) {
            try {
                await updateCurso(selectedCursoId, cursoDetails); // Actualiza el curso
                setSelectedCursoId(null); // Resetea el curso seleccionado
                fetchCursos(); // Refresca la lista de cursos
                setErrorMessage(""); // Limpiar mensaje de error si todo fue bien
            } catch (error) {
                console.error("Imposible actualizar curso", error); // Manejo de errores
            }
        }
    }

    return (
        <main className="relative min-h-screen">
            <Navigate />
            <h1 className="flex mt-10 ml-20 text-3xl">Modificar talleres</h1>
            <div className="mt-5 border bg-slate-400 p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {cursos.map(curso => (
                        <button
                            key={curso.id}
                            onClick={() => setSelectedCursoId(curso.id)}
                            className="border p-4 bg-blue-500 text-white font-bold text-lg rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            {curso.nombre}
                        </button>
                    ))}
                </div>

                {selectedCursoId !== null && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                            <h2 className="text-2xl font-bold mb-4">Editar Taller</h2>
                            {errorMessage && (
                                <div className="mb-4 text-red-600">
                                    {errorMessage} {/* Muestra el mensaje de error */}
                                </div>
                            )}
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={cursoDetails.nombre}
                                    onChange={handleChange}
                                    className="p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="year" className="block">Año:</label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={cursoDetails.year}
                                    onChange={handleChange}
                                    className="p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="descripcion" className="block">Descripción:</label>
                                <input
                                    type="text"
                                    id="descripcion"
                                    name="descripcion"
                                    value={cursoDetails.descripcion}
                                    onChange={handleChange}
                                    className="p-2 w-full border rounded"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button onClick={handleSaveChanges} className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800">Guardar</button>
                                <button onClick={() => setSelectedCursoId(null)} className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800">Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Cursos;
