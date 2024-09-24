"use client"
import React, { useRef, useState, useEffect, use } from 'react';
import Background from "../../../../public/Images/Background.jpeg";
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../components/alumno/navigate/page';
import { getAlumnoByCooki, updateAlumno } from '@/services/Alumno';
import Provincias from '@/components/ubicacion/provincia';
import Localidades from '@/components/ubicacion/localidad';
import Direcciones from '@/components/ubicacion/direccion';
import Talleres from '@/components/talleres/page';
import { getApiDireccionesEstado, getDireccionById, updateDireccionByIdUser } from '@/services/ubicacion/direccion';
import { getApiProvinciaById, getProvinciasById, updateProvinciasByIdUser } from '@/services/ubicacion/provincia';
import { getApiLocalidadByName, getLocalidadById, updateLocalidadByIdUser } from '@/services/ubicacion/localidad';

type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    telefono: number;
    email: string;
    password: string;
    direccionId: number;
};

const Cuenta: React.FC<{}> = () => {
    //region UseStates
    // Estado para almacenar el ID del usuario, inicialmente nulo
    const [openBox, setOpenBox] = useState<number | null>(null);

    // Estado para asegurar cambios, inicialmente falso
    const [asegurarCambios, setAsegurarCambios] = useState<boolean>(false);

    // Estado para almacenar mensajes de error, inicialmente vacío
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Referencia para el contenedor de desplazamiento
    const scrollRef = useRef<HTMLDivElement>(null);

    // Estado para almacenar los datos del usuario, inicialmente nulo
    const [user, setUser] = useState<Usuario | null>();

    // Estado para almacenar los detalles del curso, inicialmente vacío
    const [alumnoDetails, setAlumnoDetails] = useState<{
        nombre: string; apellido: string; dni: number;
        telefono: number; pais: string; provincia: string;
        localidad: string; calle: string; numero: number;
        email: string; password: string; direccionId?: number;
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
        email: user?.email || '',
        password: user?.password || '',
        direccionId: user?.direccionId || 0
    });

    // Estado para almacenar el ID de la provincia, inicialmente nulo
    const [provinciaId, setprovinciaId] = useState<number | null>(null);

    // Estado para almacenar el ID de la localidad, inicialmente nulo
    const [localidadId, setLocalidadId] = useState<number | null>(null);

    // Estado para almacenar la direccionID, inicialmente nulo
    const [direccionId, setDireccionId] = useState<number | null>(null);

    // Estado para almacenar la calle, inicialmente nulo
    const [calle, setcalle] = useState<string | null>(null);

    // Estado para almacenar el número de la dirección, inicialmente nulo
    const [numero, setNumero] = useState<number | null>(null);

    // Estado para almacenar los cursos elegidos, inicialmente un array vacío
    const [cursosElegido, setCursosElegido] = useState<number[]>([]);
    //endregion

    //region UseEffects
    // Función para obtener los datos del usuario
    useEffect(() => {
        if (!user && !openBox) {
            console.log("se actualiza el usuario");
            getUser();
        }
    }, [user, openBox]);

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
    //endregion

    //region Funciones
    async function getUser() {
        let user = await getAlumnoByCooki();
        console.log(user?.nombre);
        const userUpdate: Usuario = {
            id: user?.id || 0,
            nombre: user?.nombre || '',
            apellido: user?.apellido || '',
            dni: user?.dni || 0,
            telefono: user?.telefono || 0,
            email: user?.email || '',
            password: user?.password || '',
            direccionId: user?.direccionId || 0
        }
        setAlumnoDetails({
            nombre: userUpdate.nombre, apellido: userUpdate.apellido,
            dni: Number(userUpdate.dni), telefono: (userUpdate.telefono), pais: '', provincia: '', localidad: '',
            calle: '', numero: 0, email: userUpdate.email, password: userUpdate.password
        });
        setUser(userUpdate);
    }
    function validateAlumnoDetails(estado: boolean) {

        const { nombre, apellido, dni, telefono, pais, provincia, localidad, calle, numero } = alumnoDetails;

        if ( nombre.length < 2) {
            return "El nombre debe tener al menos 3 caracteres.";
        }
        if ( apellido.length === 1) {
            return "El apellido debe tener más de 0 caracteres.";
        }
        if (dni.toString().length === 8) {
            return "El DNI debe tener 8 caracteres.";
        }
        if ( telefono.toString().length === 9) {
            return "El teléfono debe ser un número válido de 9 dígitos.";
        }
        if ( (estado === false)) {
            return "El nombre de la calle o el número son incorrectos"
        }
        return null;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setAlumnoDetails(prevDetails => ({
            ...prevDetails,
            [name]: (value)
        }));
    }

    async function handleSaveChanges() {
        const estado = await getApiDireccionesEstado(String(calle), Number(numero))

        const validationError = validateAlumnoDetails(estado);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        if (openBox !== null) {
            console.log("openBoxDD", user?.id);
            // Obtener el nombre de la provincia usando el ID de la provincia
            const provinciaNombre = await getApiProvinciaById(Number(provinciaId));

            // Agregar la provincia a la base de datos y obtener el nuevo objeto de provincia
            const newProvincia = await updateProvinciasByIdUser(Number(user?.id), {
                nombre: provinciaNombre,
                nacionalidadId: 1 // ID para Argentina
            });
            console.log("newProvincia", newProvincia);
            // Obtener el nombre de la localidad usando el ID de la provincia y el ID de la localidad
            const localidadNombre = await getApiLocalidadByName(Number(provinciaId), Number(localidadId));

            // Agregar la localidad a la base de datos y obtener el nuevo objeto de localidad
/*             const newLocalidad = await updateLocalidadByIdUser(Number(user?.id), {
                nombre: localidadNombre,
                provinciaId: newProvincia?.id ?? 0 // Usar el nuevo ID de la provincia o 0 si es indefinido
            });
            console.log("newLocalidad", newLocalidad); */

            // Agregar la dirección a la base de datos y obtener el nuevo objeto de dirección
/*             const newDireccion = await updateDireccionByIdUser(Number(user?.id),{
                calle: String(calle),
                numero: Number(numero),
                localidadId: newLocalidad?.id ?? 0 // Usar el nuevo ID de la localidad o 0 si es indefinido
            });
    
            await updateAlumno(user?.id || 0, {
                nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                dni: Number(alumnoDetails.dni), telefono: Number(alumnoDetails.telefono),
                direccionId: Number(newDireccion?.id)
            }); */
            setOpenBox(null);
            setErrorMessage("");
        }
        getUser();
    }
    //endregion

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
                            <label className="block text-gray-700 font-bold mb-2">email:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.email}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">password:</label>
                            <p className="p-2 border rounded bg-gray-100">
                                <input
                                    type="password"
                                    value={user?.password}
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
                        onClick={() => setOpenBox(-1)}>
                        Editar
                    </button>
                </div>
            </div>
            <div className="fixed bottom-0 mt-20 bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
            {openBox !== null && (
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
                                value={alumnoDetails.nombre}
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
                                value={(alumnoDetails.apellido)}
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
                                value={(alumnoDetails.dni)}
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
                                value={alumnoDetails.telefono}
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
                                value={alumnoDetails.pais}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div>
                            <h1>Provincia:</h1>
                            <Provincias setprovinciaId={setprovinciaId} />
                        </div>
                        <div>
                            <h1>Localidad:</h1>
                            <Localidades provinciaId={(provinciaId)} setLocalidadId={setLocalidadId} />
                        </div>
                        <div>
                            <Direcciones setCalle={setcalle} setNumero={setNumero} />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => handleSaveChanges()}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => setOpenBox(null)}
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