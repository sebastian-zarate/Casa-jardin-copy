"use client"
import React, { useRef, useState, useEffect, use } from 'react';
import Background from "../../../../public/Images/Background.jpg";
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../components/alumno/navigate/page';
import { getAlumnoByCooki, updateAlumno } from '@/services/Alumno';

type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    telefono: number;
    correo: string;
    contraseña: string;
};

const Cuenta: React.FC<{}> = () => {

    const [userId, setuserId] = useState<number | null>(null);const [asegurarCambios, setAsegurarCambios] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<Usuario | null>(null);

    async function getUser() {
        let user = await getAlumnoByCooki();
        console.log(user?.nombre);
        const userUpdate: Usuario = {
            id: user?.id || 0,
            nombre: user?.nombre || '',
            apellido: user?.apellido || '',
            dni: user?.dni || 0,
            telefono: user?.telefono || 0,
            correo: user?.email || '',
            contraseña: user?.password || ''
        }
        setCursoDetails({nombre: userUpdate.nombre, apellido: userUpdate.apellido, 
            dni: Number(userUpdate.dni), telefono: (userUpdate.telefono), pais: '', provincia: '', localidad: '',
             calle: '', numero: 0, correo: userUpdate.correo, contraseña: userUpdate.contraseña});
        setUser(userUpdate);
    }

    useEffect(() => {
        if (user === null || userId === null) {
            console.log("se actualiza el usuario");
            getUser();
        }
    }, [user, userId]);

    useEffect(() => {
        if ((errorMessage.length > 0) && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [errorMessage]);

    useEffect(() => {
        if (errorMessage != null) {
            setInterval(() => {
                setErrorMessage("")
            }, 10000);
        }
    }, [errorMessage]);

    const [cursoDetails, setCursoDetails] = useState<{
        nombre: string; apellido: string; dni: number;
        telefono: number; pais: string; provincia: string;
        localidad: string; calle: string; numero: number;
        correo: string; contraseña: string;
    }>({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        dni: user?.dni || 0,
        telefono: user?.telefono || 0,
        pais: '',
        provincia: '',
        localidad: '',
        calle: '',
        numero: 0,
        correo: user?.correo || '',
        contraseña: user?.contraseña || ''
    });

    function validateAlumnoDetails() {
  
        const { nombre, apellido, dni, telefono, pais, provincia, localidad, calle, numero } = cursoDetails;

        if (nombre.length < 2) {
            return "El nombre debe tener al menos 3 caracteres.";
        }
        if (!apellido) {
            return "El apellido debe tener más de 0 caracteres.";
        }
        if (dni.toString().length !== 8) {
            return "El DNI debe tener 8 caracteres.";
        }
        if (isNaN(telefono) || telefono.toString().length !== 9) {
            return "El teléfono debe ser un número válido de 9 dígitos.";
        }
        if (pais.trim() === "") {
            return "El país no puede estar vacío.";
        }
        if (provincia.trim() === "") {
            return "La provincia no puede estar vacía.";
        }
        if (localidad.trim() === "") {
            return "La localidad no puede estar vacía.";
        }
        if (calle.trim() === "") {
            return "La calle no puede estar vacía.";
        }
        if (isNaN(numero) || numero <= 0) {
            return "El número debe ser un número válido mayor a 0.";
        }
        return null;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setCursoDetails(prevDetails => ({
            ...prevDetails,
           /*  [name]: typeof value === 'string' ?  value : parseInt(value) */
            [name]: (value)
        }));
    }

    async function handleSaveChanges() {
        const validationError = validateAlumnoDetails();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        if (userId !== null) {
            await updateAlumno(user?.id || 0, {
                nombre: cursoDetails.nombre, apellido: cursoDetails.apellido, dni: Number(cursoDetails.dni), telefono: Number(cursoDetails.telefono)});
            setuserId(null);
            setErrorMessage("");
        }
        getUser();
    }

    return (
        <main className=''>
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={20} priority={true} />
            <div className="fixed bg-red-500  justify-between w-full p-4" >
                <Navigate />
            </div>

            <div className='absolute mt-20 top-10 '>
                <h1 className='flex my-20 items-center justify-center  font-bold text-3xl'>Datos del Estudiante</h1>
                <div className='flex  justify-center w-screen'>
                    <div className=" mx-auto bg-gray-100 rounded-lg shadow-md px-8 py-6 grid grid-cols-2 gap-x-12 ">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.nombre} {user?.apellido}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">DNI:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.dni ? user?.dni : "DNI no cargado"}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Talleres:</label>
                            <p className="p-2 border rounded bg-gray-100">No hay talleres cargados</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Domicilio:</label>
                            <p className="p-2 border rounded bg-gray-100">Domicilio no cargado{/* {}, {.provincia}, {.localidad}, {cusoDetails.calle} {.numero} */}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Teléfono:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.telefono ? user?.telefono : "Teléfono no cargado"}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Correo:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.correo}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Contraseña:</label>
                            <p className="p-2 border rounded bg-gray-100">
                                <input
                                    type="password"
                                    value={user?.contraseña}
                                    className="w-full bg-transparent border-none"
                                    readOnly
                                />
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-5">
                    <button
                        className='bg-red-500 py-2 px-10 text-white rounded hover:bg-red-700'
                        onClick={() => setuserId(-1)}>
                        Editar
                    </button>
                </div>
            </div>
            <div className="fixed bottom-0 mt-20 bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
            {userId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div ref={scrollRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative" style={{ height: '70vh', overflow: "auto" }}>
                        <h2 className="text-2xl font-bold mb-4">
                            Datos del Estudiante
                        </h2>
                        {errorMessage && (
                            <div className="mb-4 text-red-600">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="nombre" >Nombre:</label>
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
                            <label htmlFor="apellido" className="block">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={(cursoDetails.apellido)}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dni" className="block">DNI:</label>
                            <input
                                type="number"
                                id="dni"
                                name="dni"
                                value={(cursoDetails.dni)}
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
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="telefono" className="block">Teléfono:</label>
                            <input
                                type="number"
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
                                type="number"
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
                                onClick={() => setuserId(null)}
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