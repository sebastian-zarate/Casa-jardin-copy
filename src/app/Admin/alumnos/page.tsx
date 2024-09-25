"use client";
// #region Imports
import React, { use, useEffect, useRef, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { deleteAlumno, getAlumnoByCooki, getAlumnos, updateAlumno } from "../../../services/Alumno";
import Image from "next/image";
import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import EditIcon from "../../../../public/Images/EditIcon.png";
import Background from "../../../../public/Images/Background.jpeg"
import { getImages_talleresAdmin } from "@/services/repoImage";

import Talleres from "@/components/talleres/page";
import { addDireccion, getDireccionById, updateDireccionById, updateDireccionByIdUser } from "@/services/ubicacion/direccion";
import { addLocalidad, getLocalidadById, getLocalidadByName, Localidad, updateLocalidad } from "@/services/ubicacion/localidad";
import { addProvincias, getProvinciasById, getProvinciasByName, updateProvinciaById } from "@/services/ubicacion/provincia";
import { getPaisById } from "@/services/ubicacion/pais";
import { createAlumno_Curso } from "@/services/alumno_curso";
import { Curso } from "@/services/cursos";
// #endregion

const Alumnos: React.FC = () => {
    // #region UseStates
    const [alumnos, setAlumnos] = useState<any[]>([]);
    const [selectedAlumno, setSelectedAlumno] = useState<any>(null);

    const [obAlumno, setObAlumno] = useState<any>(null);

    const [alumnoDetails, setAlumnoDetails] = useState<any>({});
    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");
    //Estado para almacenar las imagenes
    const [images, setImages] = useState<any[]>([]);

    //useState para almacenar la dirección
    //useState para almacenar la dirección
    const [nacionalidadName, setNacionalidadName] = useState<string>();
    // Estado para almacenar el ID de la provincia, inicialmente nulo
    const [provinciaName, setProvinciaName] = useState<string>();

    // Estado para almacenar el ID de la localidad, inicialmente nulo
    const [localidadName, setLocalidadName] = useState<string>();

    // Estado para almacenar la direccionID, inicialmente nulo
    const [user, setUser] = useState<any>(null);

    // Estado para almacenar la calle, inicialmente nulo
    const [calle, setcalle] = useState<string | null>(null);

    // Estado para almacenar el número de la dirección, inicialmente nulo
    const [numero, setNumero] = useState<number | null>(null);

    // Estado para almacenar los cursos elegidos, inicialmente un array vacío
    const [cursosElegido, setCursosElegido] = useState<Curso[]>([]);

    // Referencia para el contenedor de desplazamiento
    const scrollRef = useRef<HTMLDivElement>(null);
    // #endregion

    // #region UseEffects
    //useEffect para obtener los alumnos
    useEffect(() => {
        fetchAlumnos();
        fetchImages();
       // if (obAlumno.direccionId) getUbicacion(obAlumno);
    }, []);

    useEffect(() => {
        if (obAlumno && obAlumno.direccionId) {
            getUbicacion(obAlumno);
        }
    }, [obAlumno]);
    useEffect(() => {
        if ((errorMessage.length > 0) && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [errorMessage]);

    useEffect(() => {
        if (selectedAlumno !== null && selectedAlumno !== -1) {
            setAlumnoDetails({
                id: selectedAlumno.id,
                nombre: selectedAlumno.nombre,
                apellido: selectedAlumno.apellido,
                dni: selectedAlumno.dni,
                telefono: selectedAlumno.telefono,
                direccionId: selectedAlumno.direccionId,
                email: selectedAlumno.email,
                password: selectedAlumno.password
            });
        } else {
            setAlumnoDetails({});
        }
    }, [selectedAlumno, alumnos]);
    // #endregion

    // #region Métodos
    async function fetchAlumnos() {
        try {
            let user = await getAlumnoByCooki();
            setUser(user);
            const data = await getAlumnos();
            console.log(data);
            setAlumnos(data);
        } catch (error) {
            console.error("Imposible obetener Alumnos", error);
        }
    }

    // Método para obtener las imagenes
    const fetchImages = async () => {
        const result = await getImages_talleresAdmin();
        if (result.error) {
            setErrorMessage(result.error)
        } else {
            console.log(result)
            setImages(result.images);

        }
    };
    async function getUbicacion(obAlumno: any) {
        // Obtener la dirección del usuario por su ID
        console.log("SI DIRECCIONID ES FALSE:", Number(obAlumno?.direccionId));
        const direccion = await getDireccionById(Number(obAlumno?.direccionId));
        console.log("DIRECCION", direccion);

        // Obtener la localidad asociada a la dirección
        const localidad = await getLocalidadById(Number(direccion?.localidadId));
        console.log("LOCALIDAD", localidad);

        // Obtener la provincia asociada a la localidad
        const prov = await getProvinciasById(Number(localidad?.provinciaId));
        console.log("PROVINCIA", prov);

        // Obtener el país asociado a la provincia
        const nacionalidad = await getPaisById(Number(prov?.nacionalidadId));

        // Actualizar los estados con los datos obtenidos
/*         setLocalidadName(String(localidad?.nombre));
        setProvinciaName(String(prov?.nombre));
        setNacionalidadName(String(nacionalidad?.nombre));
        setNumero(Number(direccion?.numero));
        setcalle(String(direccion?.calle)); */
        console.log("TODOSSS", localidadName, provinciaName, nacionalidadName, calle, numero);
        return { direccion, localidad, prov, nacionalidad };
    }

    
    function validatealumnoDetails() {
        const { nombre, apellido, email, especialidad } = alumnoDetails;

        //validar que el nombre sea de al menos 2 caracteres
        if (nombre.length < 2) {
            return "El nombre debe tener al menos 2 caracteres";
        }
        //validar que el apellido sea de al menos 2 caracteres
        if (apellido.length < 2) {
            return "El apellido debe tener al menos 2 caracteres";
        }
    }
    // Función para manejar los cambios en los campos del formulario
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setAlumnoDetails((prevDetails: any) => ({
            ...prevDetails,
            [name]: name === 'telefono' ? parseInt(value, 10) : value // Convierte `telefono` a número entero si el campo es `telefono`
        }));
    }
    async function handleSaveChanges() {
        const validationError = validatealumnoDetails();
        console.log(obAlumno)

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        if(!obAlumno.direccionId) {
            console.log("ALUMNODETAILS", alumnoDetails);
            const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                dni: Number(alumnoDetails.dni), telefono: Number(alumnoDetails.telefono),
                
            });
            newAlumno
            setNacionalidadName("");
            setProvinciaName("");
            setLocalidadName("");
            setcalle("");
            setNumero(null);
            setObAlumno(null);
            setSelectedAlumno(null);
            fetchAlumnos();
            setErrorMessage("");
            return;
        }
        const { direccion, localidad, prov, nacionalidad } = await getUbicacion(obAlumno);

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
            const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                dni: Number(alumnoDetails.dni), telefono: Number(alumnoDetails.telefono),
                direccionId: Number(newDireccion?.id)
            });

            for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                //console.log(prof_cur)
            }
            setNacionalidadName("");
            setProvinciaName("");
            setLocalidadName("");
            setcalle("");
            setNumero(null);
            setObAlumno(null);
            setSelectedAlumno(null);
            fetchAlumnos();
            setErrorMessage("");
        } catch (error) {
            console.error("Error al actualizar el profesional", error);
        }
    }

    async function handleEliminarAlumno(alumno: any) {
        try {
            await deleteAlumno(alumno.id);
            fetchAlumnos();
        } catch (error) {
            console.error("Error al eliminar el profesional", error);
        }
    }
    async function handleCancel() {
        setNacionalidadName("");
        setProvinciaName("");
        setLocalidadName("");
        setcalle("");
        setNumero(null);
        setObAlumno(null);
    }
    // #endregion


    // #region Return
    return (
        <main className="relative min-h-screen w-screen">
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />

            <div className="fixed justify-between w-full p-4" style={{ background: "#1CABEB" }} >
                <Navigate />
            </div>
            <h1 className="absolute top-40 left-60 mb-5 text-3xl" >Alumnos</h1>
            <div className="top-60 border p-1 absolute left-40 h-90 max-h-90 w-1/2 bg-gray-400 bg-opacity-50" style={{ height: '50vh', overflow: "auto" }}>
                <div className="flex flex-col space-y-4 my-4 w-full px-4">
                    {alumnos.map((alumno, index) => (
                        <div key={index} className="border py-4 px-6 mx-2 relative w-full flex flex-col items-start bg-white rounded shadow-md">
                            <div className="flex justify-between w-full mb-2">
                                <h3 className="text-lg font-semibold text-black">{alumno.nombre} {alumno.apellido}</h3>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEliminarAlumno(alumno) } className="text-red-600 font-bold">
                                        <Image src={DeleteIcon} alt="Eliminar" width={27} height={27} />
                                    </button>
                                    <button onClick={() => {
                                        setSelectedAlumno(alumno);setObAlumno(alumno);console.log(alumno);}} className="text-blue-600 font-bold">
                                        <Image src={EditIcon} alt="Editar" width={27} height={27} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Email: {alumno.email}</p>
                                <p>Talleres: </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="fixed bottom-0 mt-20 bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
            {selectedAlumno !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div ref={scrollRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative" style={{ height: '70vh', overflow: "auto" }}>
                        <h2 className="text-2xl font-bold mb-4">
                            {"Editar Alumno"}
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
                                value={alumnoDetails.nombre}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                            <label htmlFor="apellido" className="block">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={alumnoDetails.apellido}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={alumnoDetails.email}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dni" className="block">dni:</label>
                            <input
                                type="number"
                                id="dni"
                                name="dni"
                                value={alumnoDetails.dni}
                                onChange={handleChange}
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
                            <label htmlFor="password" className="block">Contraseña:</label>
                            <input
                                type="text"
                                id="password"
                                name="password"
                                value={alumnoDetails.password}
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
                                onClick={handleSaveChanges}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800">
                                Guardar
                            </button>
                            <button
                                onClick={() => {setSelectedAlumno(null); handleCancel()}}
                                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
    // #endregion
}
export default Alumnos