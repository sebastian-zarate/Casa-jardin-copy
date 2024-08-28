"use client"
import React, { useEffect, useState } from 'react';
import Background from "../../../../public/Images/Background.jpg";
import But_aside from "../../../helpers/but_aside/page";
import Image from "next/image";
import Navigate from '../../../helpers/alumno/navigate/page';
import { updateAlumno } from '@/services/Alumno';

const Cuenta: React.FC = () => {

    const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");
    // Estado para almacenar los datos del curso seleccion
    const [cursoDetails, setCursoDetails] = useState<{ nombre: string; apellido: string; dni: string;
                                                     telefono: number; pais:string; provincia: string; 
                                                     localidad: string; calle: string; numero: number }>({
        nombre: '',
        apellido: '',
        dni: '',
        telefono: 0,
        pais: '',
        provincia: '',
        localidad: '',
        calle: '',
        numero: 0

    });

        // Función para validar los detalles del curso
        function validateCursoDetails() {
            const { nombre, apellido, dni, telefono, pais, provincia, localidad, calle, numero } = cursoDetails;

            // Validar que el nombre tenga al menos 4 caracteres
            if (nombre.length < 2) {
            return "El nombre debe tener al menos 3 caracteres.";
            }
            // Validar que el apellido sea un número válido
            if (apellido || apellido.length <= 0) {
                return "El apellido debe tener más de 0 caracteres.";
            }
            // Validar que el DNI tenga 8 caracteres
            if (dni.length !== 8) {
            return "El DNI debe tener 8 caracteres.";
            }
            // Validar que el teléfono sea un número válido
            if (isNaN(telefono) || telefono.toString().length !== 9) {
            return "El teléfono debe ser un número válido de 9 dígitos.";
            }
            // Validar que el país no esté vacío
            if (pais.trim() === "") {
            return "El país no puede estar vacío.";
            }
            // Validar que la provincia no esté vacía
            if (provincia.trim() === "") {
            return "La provincia no puede estar vacía.";
            }
            // Validar que la localidad no esté vacía
            if (localidad.trim() === "") {
            return "La localidad no puede estar vacía.";
            }
            // Validar que la calle no esté vacía
            if (calle.trim() === "") {
            return "La calle no puede estar vacía.";
            }
            // Validar que el número sea un número válido
            if (isNaN(numero) || numero <= 0) {
            return "El número debe ser un número válido mayor a 0.";
            }
            return null; // Retorna null si no hay errores
        }
        
        // Función para manejar los cambios en los campos del formulario
        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
            const { name, value } = e.target;
            setCursoDetails(prevDetails => ({
                ...prevDetails,
                [name]: value
            }));
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
                    await updateAlumno(selectedCursoId, cursoDetails); // Actualiza el curso
                    setSelectedCursoId(null); // Resetea el curso seleccionado
                    setErrorMessage(""); // Limpiar mensaje de error si todo fue bien
                } catch (error) {
                    console.error("Imposible actualizar curso", error); // Manejo de errores
                }
            }
        }

    return (
        <main className=''>
        
        <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={20} priority={true}/>
        <div className="fixed bg-red-500  justify-between w-full p-4" >
            <Navigate />
        </div>  

        <div className='absolute mt-20 top-10 '>
            <h1 className='absolute m-20 left-40'>Datos del Estudiante</h1>

            <img className='absolute bg-red-600 left-1/2 mt-40 ' src="" alt="Imagen user" />
            <div className='flex justify-center w-screen mt-40'>
                
                <div className='mt-10 grid grid-cols-2 bg-slate-500 justify-center items-start p-10 gap-x-10'>
                    <div className='flex flex-col space-y-4'>
                        <h1>Nombre:</h1>
                        <p>ACA VA EL NOMBRE</p>

                        <label>DNI</label>
                        <p>ACA VA EL DNI</p>

                        <label>Talleres</label>
                        <p>ACA VAN LOS TALLERES</p>

                        <label>Domicilio</label>
                        <p>Pais, Provincia, Localidad, Calle nº</p>
                    </div>

                    <div className='flex flex-col space-y-4'>
                        <h1>Telefono:</h1>
                        <p>ACA VA EL TELEFONO</p>

                        <label>Correo:</label>
                        <p>ACA VA EL CORREO</p>

                        <label>Contraseña:</label>
                        <p>ACA VA LA CONTRASEÑA</p>
                    </div>
                </div>
            </div>
            <button 
                className='absolute left-1/2 bg-red-700 px-8 py-3'
                onClick={() => setSelectedCursoId(-1)}>
                Editar                
            </button>

        </div>
        <div className="fixed bottom-0 mt-20 bg-white w-full" style={{opacity: 0.66}}>
            <But_aside />
        </div>

        {selectedCursoId !== null && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                    <h2 className="text-2xl font-bold mb-4">
                        Datos del Estudiante
                    </h2>
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
                        <label htmlFor="year" className="block">Apellido:</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            value={cursoDetails.apellido}
                            onChange={handleChange}
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dni" className="block">DNI:</label>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={cursoDetails.dni}
                            onChange={handleChange}
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imagen" className="block">Imagen:</label>
                        <input
                            type="file"
                            id="imagen"
                            name="imagen"
                            /* onChange={handleFileChange} */
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="telefono" className="block">Teléfono:</label>
                        <input
                            type="text"
                            id="telefono"
                            name="telefono"
                            value={cursoDetails.telefono}
                            onChange={handleChange}
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pais" className="block">País:</label>
                        <input
                            type="text"
                            id="pais"
                            name="pais"
                            value={cursoDetails.pais}
                            onChange={handleChange}
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="provincia" className="block">Provincia:</label>
                        <input
                            type="text"
                            id="provincia"
                            name="provincia"
                            value={cursoDetails.provincia}
                            onChange={handleChange}
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="localidad" className="block">Localidad:</label>
                        <input
                            type="text"
                            id="localidad"
                            name="localidad"
                            value={cursoDetails.localidad}
                            onChange={handleChange}
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="calle" className="block">Calle:</label>
                        <input
                            type="text"
                            id="calle"
                            name="calle"
                            value={cursoDetails.calle}
                            onChange={handleChange}
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="numero" className="block">Número:</label>
                        <input
                            type="text"
                            id="numero"
                            name="numero"
                            value={cursoDetails.numero}
                            onChange={handleChange}
                            className="p-2 w-full border rounded"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={() => handleSaveChanges()} 
                            className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                        >
                            Guardar
                        </button>
                        <button 
                            onClick={() => setSelectedCursoId(null)} 
                            className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}

        </main>
    )
}
export default Cuenta;