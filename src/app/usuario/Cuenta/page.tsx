"use client"
import React, { useRef, useState, useEffect, use } from 'react';
import Background from "../../../../public/Images/Background.jpeg";
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../components/alumno/navigate/page';
import { getAlumnoByCooki, updateAlumno } from '@/services/Alumno';
import { addDireccion, getDireccionById, updateDireccionById, updateDireccionByIdUser } from '@/services/ubicacion/direccion';
import {  addProvincias, getProvinciasById, updateProvinciaById } from '@/services/ubicacion/provincia';
import {  addLocalidad, getLocalidadById, getLocalidadesByProvinciaId, updateLocalidad } from '@/services/ubicacion/localidad';
import { addPais, getPaisById } from '@/services/ubicacion/pais';
import { createAlumno_Curso, getalumnos_cursoByIdAlumno } from '@/services/alumno_curso';
import { Curso, getCursoById } from '@/services/cursos';

type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    telefono: number;
    email: string;
/*     password: string; */
    direccionId: number;
    rolId: number;
};

const Cuenta: React.FC<{}> = () => {
    //region UseStates
    // Estado para asegurar cambios, inicialmente 0
    const [openBox, setOpenBox] = useState<number>(0);

    // Estado para almacenar mensajes de error, inicialmente vacío
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Referencia para el contenedor de desplazamiento
    const scrollRef = useRef<HTMLDivElement>(null);

    // Estado para almacenar los datos del usuario, inicialmente nulo
    const [user, setUser] = useState<Usuario | null>();

    // Estado para almacenar los detalles del curso, inicialmente vacío
    const [alumnoDetails, setAlumnoDetails] = useState<{
        id:Number; nombre: string; apellido: string; dni: number;
        telefono: number;  email: string; /* password: string; */ direccionId?: number; rolId?: number;
    }>({
        id: user?.id || 0,
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        dni: user?.dni || 0,
        telefono: user?.telefono || 0,
        email: user?.email || '',
/*         password: user?.password || '', */
        direccionId: user?.direccionId || 0,
        rolId: user?.rolId || 0
    });

    const [nacionalidadName, setNacionalidadName] = useState<string >();
    // Estado para almacenar el ID de la provincia, inicialmente nulo
    const [provinciaName, setProvinciaName] = useState<string >();

    // Estado para almacenar el ID de la localidad, inicialmente nulo
    const [localidadName, setLocalidadName] = useState<string >();

    // Estado para almacenar la calle, inicialmente nulo
    const [calle, setcalle] = useState<string | null>();

    // Estado para almacenar el número de la dirección, inicialmente nulo
    const [numero, setNumero] = useState<number | null>();

    // Estado para almacenar los cursos elegidos, inicialmente un array vacío
    const [cursosElegido, setCursosElegido] = useState<Curso[]>([]);

    //endregion

    //region UseEffects
    // Función para obtener los datos del usuario
    useEffect(() => {
        if (!user && openBox === 0) {
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
    async function getCursosElegidos(id:number) {
        const cursos = await getalumnos_cursoByIdAlumno(id);
        console.log("CURSOS1", cursos);
        let array: Curso[] = [];
        cursos.forEach(async (curso) => {
            const curs = await getCursoById(curso.id);

            if (curs) array.push(curs);
            console.log("CURSOS2", curs);

        });
        setCursosElegido(array); 
        console.log("CURSOS3", cursosElegido);
    }


       async function createUbicacion() {
        // Obtener la localidad asociada a la dirección
        console.log("Antes de crear la ubicacion", (localidadName), calle, numero, provinciaName, nacionalidadName);
        const nacionalidad = await addPais({ nombre: String(nacionalidadName) });
        const prov = await addProvincias({ nombre: String(localidadName), nacionalidadId: Number(nacionalidad?.id) });

        const localidad = await addLocalidad({ nombre: String(localidadName), provinciaId: Number(prov?.id) });
        console.log("LOCALIDAD", localidad);
        const direccion = await addDireccion({ calle: String(calle), numero: Number(numero), localidadId: Number(localidad?.id )});
        console.log("DIRECCION", direccion);
        return  {direccion, nacionalidad} ;
    }
    async function getUbicacion(userUpdate: any) {
        // Obtener la dirección del usuario por su ID
        console.log("SI DIRECCIONID ES FALSE:", Number(userUpdate?.direccionId));
        const direccion = await getDireccionById(Number(userUpdate?.direccionId));
        console.log("DIRECCION", direccion);

        // Obtener la localidad asociada a la dirección
        const localidad = await getLocalidadById(Number(direccion?.localidadId));
        console.log("LOCALIDAD", localidad);

        // Obtener la provincia asociada a la localidad
        const prov = await getProvinciasById(Number(localidad?.provinciaId));
        console.log("PROVINCIA", prov);

        // Obtener el país asociado a la provincia
        const nacionalidad = await getPaisById(Number(prov?.nacionalidadId));
        console.log("NACIONALIDAD", nacionalidad);
        // Actualizar los estados con los datos obtenidos
        setLocalidadName(String(localidad?.nombre));
        setProvinciaName(String(prov?.nombre)); 
        setNacionalidadName(String(nacionalidad?.nombre));
        setNumero(direccion?.numero);
        setcalle(direccion?.calle);
        return {direccion, localidad, prov, nacionalidad};
    }
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
/*             password: user?.password || '', */
            direccionId: user?.direccionId || 0,
            rolId: user?.rolId || 0
        }
        if(!userUpdate.direccionId) {
            setNacionalidadName("")
            setProvinciaName("")
            setLocalidadName("")
            setcalle("")
            setNumero(0)
        } else if(userUpdate.direccionId) getUbicacion(userUpdate);
        getCursosElegidos(userUpdate.id);

        setAlumnoDetails({
            id: userUpdate.id,
            nombre: userUpdate.nombre, apellido: userUpdate.apellido,
            dni: Number(userUpdate.dni), telefono: (userUpdate.telefono),
            email: userUpdate.email, /* password: userUpdate.password,  */direccionId: userUpdate.direccionId, rolId: userUpdate.rolId
        });
        setUser(userUpdate);
        //setOpenBox(!openBox)
    }
    function validateAlumnoDetails() {

        const { nombre, apellido, dni, telefono } = alumnoDetails;
        if ( nombre.length < 2) {
            return "El nombre debe tener al menos 3 caracteres.";
        }
        if ( apellido.length === 1) {
            return "El apellido debe tener más de 0 caracteres.";
        }
        if (dni.toString().length !== 8) {
            return "El DNI debe tener 8 caracteres.";
        }
        if ( telefono.toString().length !== 9) {
            return "El teléfono debe ser un número válido de 9 dígitos.";
        }
        if ( !nacionalidadName) {
            return "El país no puede estar vacío.";
        }
        if ( !provinciaName) {
            return "La provincia no puede estar vacía.";
        }
        if ( !localidadName) {
            return "La localidad no puede estar vacía.";
        }
        if ( !calle) {
            return "La calle no puede estar vacía.";
        }
        if ( !numero) {
            return "El número no puede estar vacío.";
        }
        // no puede contener caracteres especiales solo letras y numeros y comas y puntos y acentos
        const regex = /^[a-zA-Z0-9_ ,.;áéíóúÁÉÍÓÚñÑüÜ]*$/;
        if(!regex.test(nombre) || !regex.test(apellido)){
            return "El nombre no puede contener caracteres especiales";
        }
        if(!regex.test(calle)){
            return "La calle no puede contener caracteres especiales";
        }
        return false;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setAlumnoDetails(prevDetails => ({
            ...prevDetails,
            [name]: (value)
        }));
    }

    async function handleSaveChanges() {

        const validationError = validateAlumnoDetails();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        if(!alumnoDetails.direccionId) {
            const {direccion} = await createUbicacion();
            console.log("ALUMNODETAILS", alumnoDetails);
             const newAlumno = await updateAlumno(Number(alumnoDetails?.id ), {
                nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                dni: Number(alumnoDetails.dni), email: alumnoDetails.email,telefono: Number(alumnoDetails.telefono),
                direccionId: Number(direccion?.id)
            });
            newAlumno.direccionId = direccion?.id;
            console.log("newAlumno", newAlumno);
            setOpenBox(0);
            getUser();
            return;
        }
        const { direccion, localidad, prov, nacionalidad } = await getUbicacion(alumnoDetails);

        try {

            const newDireccion = await updateDireccionById(Number(direccion?.id), {
                calle: String(calle),
                numero: Number(numero),
                localidadId: Number(localidad?.id)
            });
            console.log("newDireccion", newDireccion);
            const newLocalidad = await updateLocalidad(Number(localidad?.id), {
                nombre: String(localidadName),
                provinciaId: Number(prov?.id)
            });
            console.log("newLocalidad", newLocalidad);
            await updateProvinciaById(Number(prov?.id), {
                nombre: String(provinciaName),
                nacionalidadId: Number(nacionalidad?.id)
            });

            console.log("ALUMNODETAILS", alumnoDetails);
            const newAlumno = await updateAlumno(Number(alumnoDetails?.id), {
                nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                dni: Number(alumnoDetails.dni), telefono: Number(alumnoDetails.telefono),
                direccionId: Number(newDireccion?.id), email: alumnoDetails.email
            });
            console.log("newAlumno", newAlumno);
        } catch (error) {
            setErrorMessage("Ha ocurrido un error al guardar los cambios.");
        }
        setNacionalidadName(String(nacionalidad?.nombre))
        //setOpenBox(0);
        getUser();
        console.log(openBox)

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
                    <div className=" mx-auto bg-gray-100 rounded-lg shadow-md px-8 py-6 grid grid-cols-2 gap-x-12 max-w-2xl">
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
                            {cursosElegido.length !== 0 ? (
                                <p className="p-2 border rounded bg-gray-100">
                                    {cursosElegido.map((curso) => curso.nombre).join(', ')} 
                                </p>
                            ) : <p className="p-2 border rounded bg-gray-100">Talleres no cargados</p> }
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Domicilio:</label>
                            <p className="p-2 border rounded bg-gray-100">{nacionalidadName ? nacionalidadName : "-"}, {provinciaName ? provinciaName : "-"}, {localidadName ? localidadName : "-"}, { calle ? calle : "-"} {numero ? numero : "-"}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Teléfono:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.telefono ? user?.telefono : "Teléfono no cargado"}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">email:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.email}</p>
                        </div>
{/* 
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
                        </div> */}
                    </div>
                </div>
                <div className="flex items-center justify-center mt-5">
                    <button
                        className='bg-red-500 py-2 px-10 text-white rounded hover:bg-red-700'
                        onClick={() => {setOpenBox(1); console.log(openBox)}}>
                        Editar
                    </button>
                </div>
            </div>
            <div className="fixed bottom-0 mt-20 bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
            {openBox === 1  && (
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
                                value={String(nacionalidadName)}
                                onChange={(e) => setNacionalidadName(e.target.value)}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="provincia" className="block">Provincia:</label>
                            <input
                                type="text"
                                id="provincia"
                                name="provincia"
                                value={String(provinciaName)}
                                onChange={(e) => setProvinciaName(e.target.value)}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="localidad" className="block">Localidad:</label>
                            <input
                                type="text"
                                id="localidad"
                                name="localidad"
                                value={String(localidadName)}
                                onChange={(e) => setLocalidadName(e.target.value)}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="calle" className="block">Calle:</label>
                            <input
                                type="text"
                                id="calle"
                                name="calle"
                                value={String(calle)}
                                onChange={(e) => setcalle(e.target.value)}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="numero" className="block">Número:</label>
                            <input
                                type="text"
                                id="numero"
                                name="numero"
                                value={Number(numero)}
                                onChange={(e) => setNumero(Number(e.target.value))}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => {handleSaveChanges();setOpenBox(0); console.log("openBox", openBox)}}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => {setOpenBox(0);console.log(openBox)}}
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