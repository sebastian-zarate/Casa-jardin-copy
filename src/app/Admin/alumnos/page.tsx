"use client";
// #region Imports
import React, { use, useEffect, useRef, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { Alumno, createAlumno, createAlumnoAdmin, deleteAlumno, getAlumnos, updateAlumno } from "../../../services/Alumno";
import { getAlumnoByCookie } from "../../../services/Alumno";
import Image from "next/image";
import ButtonAdd from "../../../../public/Images/Button.png";
import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import EditIcon from "../../../../public/Images/EditIcon.png";
import Background from "../../../../public/Images/Background.jpeg"
import { getImages_talleresAdmin } from "@/services/repoImage";

import Talleres from "@/components/talleres/page";
import { addDireccion, getDireccionById, getDireccionCompleta, updateDireccionById } from "@/services/ubicacion/direccion";
import { addLocalidad, getLocalidadById, getLocalidadByName, Localidad, updateLocalidad } from "@/services/ubicacion/localidad";
import { addProvincias, getProvinciasById, getProvinciasByName, updateProvinciaById } from "@/services/ubicacion/provincia";
import { addPais, getPaisById } from "@/services/ubicacion/pais";
import { createAlumno_Curso } from "@/services/alumno_curso";
import { Curso } from "@/services/cursos";
import withAuth from "../../../components/Admin/adminAuth";
import PasswordComponent from "@/components/Password/page";
import { hashPassword } from "@/helpers/hashPassword";
import { createResponsable, deleteResponsable, getAllResponsables, updateResponsable } from "@/services/responsable";
// #endregion

const Alumnos: React.FC = () => {
    // #region UseStates
    const [alumnos, setAlumnos] = useState<any[]>([]);
    const [alumnosBuscados, setAlumnosBuscados] = useState<Alumno[]>([]);
    const [alumnosMostrados, setAlumnosMostrados] = useState<any[]>([]);
    const [alumnoAbuscar, setAlumnoAbuscar] = useState<string>("");
    const [habilitarAlumnosBuscados, setHabilitarAlumnosBuscados] = useState<boolean>(true);
    const [selectedAlumno, setSelectedAlumno] = useState<any>(null);

    const [obAlumno, setObAlumno] = useState<any>(null);

    const [alumnoDetails, setAlumnoDetails] = useState<any>({
        id: 0,
        nombre: "",
        apellido: "",
        dni: 0,
        telefono: 0,
        email: "",
        password: "",
        fechaNacimiento: new Date(),
        direccionId: 0
    });
    const [responsableDetails, setResponsableDetails] = useState<any>({
        id: 0,
        nombre: "",
        apellido: "",
        dni: 0,
        telefono: 0,
        email: "",
        alumnoId: 0,
        direccionId: 0
    });

    const [responsables, setResponsables] = useState<any[]>([]);
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

    const [habilitarCambioContraseña, setHabilitarCambioContraseña] = useState<boolean>(false)
    const [correcto, setCorrecto] = useState(false);
    //decidir si el alumno elegido es mayor o menor
    const [mayor, setMayor] = useState<boolean>(false);
    // #endregion

    // #region UseEffects
    //useEffect para obtener los alumnos
    useEffect(() => {
        fetchAlumnos();
        fetchImages();
        handleCancel_init();
    }, []);

    useEffect(()=> {
        if(errorMessage !== ""){
            setInterval(() => {
                setErrorMessage("")
            }, 5000);
        }
    }, [errorMessage])

    useEffect(() => {
        if (obAlumno && obAlumno.direccionId) {
            getUbicacion(obAlumno);
        } else if (obAlumno && obAlumno.direccionId === null) {
            setNacionalidadName("");
            setProvinciaName("");
            setLocalidadName("");
            setcalle("");
            setNumero(0);
        }
    }, [obAlumno]);
    useEffect(() => {
        if ((errorMessage.length > 0) && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [errorMessage]);

    useEffect(() => {
        if (selectedAlumno !== null) {
            setAlumnoDetails({
                id: selectedAlumno.id,
                nombre: selectedAlumno.nombre,
                apellido: selectedAlumno.apellido,
                dni: selectedAlumno.dni,
                telefono: selectedAlumno.telefono,
                direccionId: selectedAlumno.direccionId,
                email: selectedAlumno.email,
                password: selectedAlumno.password,
                fechaNacimiento: selectedAlumno.fechaNacimiento && new Date(selectedAlumno.fechaNacimiento).toISOString().split('T')[0]
            });
            if (selectedAlumno.fechaNacimiento) {
                const edad = new Date().getFullYear() - new Date(selectedAlumno.fechaNacimiento).getFullYear();
                if (edad < 18) {
                    setMayor(false);
                    const responsableALum = responsables.filter(responsable => responsable.alumnoId === selectedAlumno.id)
                    setResponsableDetails({
                        nombre: responsableALum[0]?.nombre || "",
                        apellido: responsableALum[0]?.apellido || "",
                        dni: responsableALum[0]?.dni || 0,
                        telefono: responsableALum[0]?.telefono || 0,
                        email: responsableALum[0]?.email || "",
                        alumnoId: selectedAlumno.id,
                        direccionId: responsableALum[0]?.direccionId || 0
                    });
                } else setMayor(true);
            }
        } else {
            setAlumnoDetails({
                nombre: "",
                apellido: "",
                dni: 0,
                telefono: 0,
                email: "",
                password: "",
                fechaNacimiento: new Date()
            });
        }
    }, [selectedAlumno, alumnos]);
    // #endregion

    // #region Métodos
    async function fetchAlumnos() {
        try {
            const data = await getAlumnos();
            console.log(data);
            setAlumnos(data);
            setAlumnosMostrados(data);
            const responsables = await getAllResponsables();
            setResponsables(responsables);
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
    //region solo considera repetidos
    async function createUbicacion() {
        // Obtener la localidad asociada a la dirección
        //console.log("Antes de crear la ubicacion", (localidadName), calle, numero, provinciaName, nacionalidadName);
        const nacionalidad = await addPais({ nombre: String(nacionalidadName) });
        const prov = await addProvincias({ nombre: String(localidadName), nacionalidadId: Number(nacionalidad?.id) });

        const localidad = await addLocalidad({ nombre: String(localidadName), provinciaId: Number(prov?.id) });
        //console.log("LOCALIDAD", localidad);
        const direccion = await addDireccion({ calle: String(calle), numero: Number(numero), localidadId: Number(localidad?.id) });
        //console.log("DIRECCION", direccion);
        return direccion;
    }

    async function getUbicacion(userUpdate: any) {
        // Obtener la dirección del usuario por su ID
        //console.log("SI DIRECCIONID ES FALSE:", Number(userUpdate?.direccionId));
        const direccion = await getDireccionCompleta(userUpdate?.direccionId);
        /* console.log("DIRECCION", direccion);
        console.log("LOCALIDAD", direccion?.localidad);
        console.log("PROVINCIA", direccion?.localidad?.provincia);
        console.log("PAIS", direccion?.localidad?.provincia?.nacionalidad); */
        //console.log("NACIONALIDAD", nacionalidad);
        // Actualizar los estados con los datos obtenidos
        setLocalidadName(String(direccion?.localidad?.nombre));
        setProvinciaName(String(direccion?.localidad?.provincia?.nombre));
        setNacionalidadName(String(direccion?.localidad?.provincia?.nacionalidad?.nombre));
        setNumero(Number(direccion?.numero));
        setcalle(String(direccion?.calle));
        return { direccion };
    }


    function validatealumnoDetails() {
        const { nombre, apellido, email, especialidad, fechaNacimiento } = alumnoDetails;

        //validar que el nombre sea de al menos 2 caracteres
        if (nombre.length < 2) {
            return "El nombre debe tener al menos 2 caracteres";
        }
        //validar que el apellido sea de al menos 2 caracteres
        if (apellido.length < 2) {
            return "El apellido debe tener al menos 2 caracteres";
        }
        // if (!/\d/.test(fechaNacimiento)) return ("La fecha de nacimiento es obligatoria");
    }
    // Función para manejar los cambios en los campos del formulario
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setAlumnoDetails((prevDetails: any) => ({
            ...prevDetails,
            [name]: name === 'telefono' ? parseInt(value, 10) : value // Convierte `telefono` a número entero si el campo es `telefono` y maneja `fechaNacimiento`

        }));
        // console.log("FECHA", name, value);
    }
    function handleChangeResponsable(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setResponsableDetails((prevDetails: any) => ({
            ...prevDetails,
            [name]: name === 'telefono' ? parseInt(value, 10) : value // Convierte `telefono` a número entero si el campo es `telefono`
        }));
    }
    function setVariablesState() {
        setNacionalidadName("");
        setProvinciaName("");
        setLocalidadName("");
        setcalle("");
        setNumero(0);
        setObAlumno(null);
        setSelectedAlumno(null);
        setCursosElegido([]);
        fetchAlumnos();
        setErrorMessage("");
    }
    async function handleSaveChanges() {
        const validationError = validatealumnoDetails();
        console.log(obAlumno)

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        //SI NO TIENIA DIRECCIÓN CARGADA 
        if (!obAlumno.direccionId) {
            const dir = await createUbicacion();
            //si es menor
            if (mayor === false) {
                console.log("fecha 1", new Date(alumnoDetails.fechaNacimiento));
                console.log("fecha 2", (alumnoDetails.fechaNacimiento));

                const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                    nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                    dni: Number(alumnoDetails.dni), email: alumnoDetails.email,
                    direccionId: Number(dir?.id), fechaNacimiento: new Date(alumnoDetails.fechaNacimiento)
                });
                await updateResponsable(alumnoDetails?.id || 0, {
                    nombre: responsableDetails.nombre, apellido: responsableDetails.apellido,
                    dni: Number(responsableDetails.dni), email: responsableDetails.email, telefono: Number(responsableDetails.telefono),
                    alumnoId: newAlumno.id, direccionId: Number(dir?.id)
                });
                if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                     await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                }


                setVariablesState();
                return;
            }
            //SI ES MAYOR
            //console.log("ALUMNODETAILS", alumnoDetails);
            const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                dni: Number(alumnoDetails.dni), email: alumnoDetails.email, telefono: Number(alumnoDetails.telefono),
                direccionId: Number(dir?.id), fechaNacimiento: new Date(alumnoDetails.fechaNacimiento)
            });
            if (typeof newAlumno === "string") return setErrorMessage(newAlumno);

            for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
           }

            setVariablesState();
            return;
        }
        //---------------SI YA TIENE DIRECCIÓN CARGADA
        const { direccion } = await getUbicacion(obAlumno);
        const localidad = direccion?.localidad;
        const prov = localidad?.provincia;
        const nacionalidad = prov?.nacionalidad;
        try {
            const newDireccion = await updateDireccionById(Number(direccion?.id), {
                calle: String(calle),
                numero: Number(numero),
                localidadId: Number(localidad?.id)
            });
            //console.log("newDireccion", newDireccion);
            await updateLocalidad(Number(localidad?.id), {
                nombre: String(localidadName),
                provinciaId: Number(prov?.id)
            });
            //console.log("newLocalidad", newLocalidad);
            await updateProvinciaById(Number(prov?.id), {
                nombre: String(provinciaName),
                nacionalidadId: Number(nacionalidad?.id)
            });
            //--------SI ES MENOR
            if (mayor === false) {
                console.log("fecha 1", new Date(alumnoDetails.fechaNacimiento));
                console.log("fecha 2", (alumnoDetails.fechaNacimiento));
                const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                    nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                    dni: Number(alumnoDetails.dni), email: alumnoDetails.email,
                    direccionId: Number(direccion?.id), fechaNacimiento: new Date(alumnoDetails.fechaNacimiento)
                });
                await updateResponsable(alumnoDetails?.id || 0, {
                    nombre: responsableDetails.nombre, apellido: responsableDetails.apellido,
                    dni: Number(responsableDetails.dni), email: responsableDetails.email, telefono: Number(responsableDetails.telefono),
                    alumnoId: newAlumno.id, direccionId: Number(direccion?.id)
                });
                if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                    await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
               }
                setVariablesState();
                return;
            }
            //console.log("ALUMNODETAILS", alumnoDetails);

            //-------------SI ES MAYOR
            const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                dni: Number(alumnoDetails.dni), telefono: Number(alumnoDetails.telefono),
                direccionId: Number(newDireccion?.id), email: alumnoDetails.email, fechaNacimiento: new Date(alumnoDetails.fechaNacimiento)
            });
            if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
            for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
           }

            setVariablesState();
        } catch (error) {
            console.error("Error al actualizar el profesional", error);
        }
    }
    async function handleCreateAlumno() {
        const validationError = validatealumnoDetails();
        const dir = await createUbicacion();
        // console.log("newDireccion", direccion);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        try {
            //alumno Mayor
            if (selectedAlumno == -1) {
                //region hashPassword
                const hash = await hashPassword(alumnoDetails.password);


                //console.log("ALUMNODETAILS", (alumnoDetails))

                //se crea el alumno, si ya existe se lo actualiza pero sin cambiar la contraseña y el email.
                const newAlumno = await createAlumnoAdmin({
                    nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                    dni: Number(alumnoDetails.dni), email: alumnoDetails.email, telefono: Number(alumnoDetails.telefono),
                    direccionId: Number(dir?.id), password: hash, rolId: 2,     //rol 2 es alumno
                    fechaNacimiento: new Date(alumnoDetails.fechaNacimiento)
                });
                if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                    await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                    //console.log(prof_cur)
                }

                setVariablesState();
            }
            //alumno Menor
            if (selectedAlumno === -2) {
                const hash = await hashPassword(alumnoDetails.password);

                const newAlumno = await createAlumnoAdmin({
                    nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                    dni: Number(alumnoDetails.dni), email: alumnoDetails.email,
                    direccionId: Number(dir?.id), password: hash, rolId: 2,     //rol 2 es alumno
                    fechaNacimiento: new Date(alumnoDetails.fechaNacimiento)
                });

                if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                    await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                    //console.log(prof_cur)
                }
                //responsable
                await createResponsable({
                    nombre: responsableDetails.nombre, apellido: responsableDetails.apellido,
                    dni: Number(responsableDetails.dni), email: responsableDetails.email, telefono: Number(responsableDetails.telefono),
                    alumnoId: newAlumno.id, direccionId: Number(dir?.id)
                });
                setVariablesState();
            }

        } catch (error) {
            console.error("Error al crear el profesional", error);
        }
    }
    async function handleEliminarAlumno(alumno: any) {
        try {
            //elimino el responsable si el alumno es menor
            if (mayor === false) {
                const responsable = responsables.filter(responsable => responsable.alumnoId === alumno.id);
                await deleteResponsable(responsable[0].id);
            }
            await deleteAlumno(alumno.id);
            fetchAlumnos();
        } catch (error) {
            console.error("Error al eliminar el profesional", error);
        }
    }
    async function handleCancel_init() {
        setNacionalidadName("");
        setProvinciaName("");
        setLocalidadName("");
        setcalle("");
        setNumero(null);
        setObAlumno(null);
        setCursosElegido([]);
        setResponsableDetails({
            nombre: "",
            apellido: "",
            dni: 0,
            telefono: 0,
            email: "",
            alumnoId: 0,
            direccionId: 0
        })
    }
    // #endregion
    // Function to handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHabilitarAlumnosBuscados(true);
        const searchTerm = e.target.value.toLowerCase();
        let filteredAlumnos = alumnosMostrados.filter(alumno =>
            alumno.nombre.toLowerCase().includes(searchTerm) ||
            alumno.apellido.toLowerCase().includes(searchTerm)/*  ||
            alumno.email.toLowerCase().includes(searchTerm) */
        );

        setAlumnosBuscados([]);
        console.log(e.target.value);
        if (e.target.value.length > 0) setAlumnosBuscados(filteredAlumnos);
        setAlumnoAbuscar(e.target.value);
    };


    // #region Return
    return (
        <main className="relative min-h-screen w-screen">
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />

            <div className="fixed justify-between w-full p-4" style={{ background: "#1CABEB" }} >
                <Navigate />
            </div>
            <h1 className="absolute bg-slate-100 top-40 left-60 mb-5 text-3xl" >Alumnos</h1>
            <div className="absolute top-40 right-20 mb-5">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="p-2 border rounded"
                        value={alumnoAbuscar}
                        onChange={handleSearchChange}
                    />
                    <div
                        onClick={() => { alumnosBuscados.length > 0 && setAlumnos(alumnosBuscados) }}
                        className="absolute cursor-pointer p-3 bg-slate-500 inset-y-0 right-0 flex items-center pr-3">
                        <Image src="/Images/SearchIcon.png" alt="Buscar" width={20} height={20} />
                    </div>
                </div>
                <button onClick={() => setAlumnos(alumnosMostrados)}>Cargar Todos</button>
                {alumnosBuscados.length > 0 && habilitarAlumnosBuscados && <div className="absolute top-10 right-0 mt-2 w-full max-w-md bg-white border rounded shadow-lg">
                    {alumnosBuscados.map((alumno, index) => (
                        <div key={index} onClick={() => { setAlumnoAbuscar(alumno.nombre + " " + alumno.apellido); setHabilitarAlumnosBuscados(false) }} className="p-2 border-b hover:bg-gray-100 cursor-pointer">
                            <p className="text-black">{alumno.nombre} {alumno.apellido}</p>
                        </div>
                    ))}
                </div>}
            </div>
            <div className="top-60 border p-1 absolute left-40 h-90 max-h-90 w-1/2 bg-gray-400 bg-opacity-50" style={{ height: '50vh', overflow: "auto" }}>
                <div className="flex flex-col space-y-4 my-4 w-full px-4">
                    {alumnos.map((alumno, index) => (
                        <div key={index} className="border py-4 px-6 mx-2 relative w-full flex flex-col items-start bg-white rounded shadow-md">
                            <div className="flex justify-between w-full mb-2">
                                <h3 className="text-lg font-semibold text-black">{alumno.nombre} {alumno.apellido}</h3>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEliminarAlumno(alumno)} className="text-red-600 font-bold">
                                        <Image src={DeleteIcon} alt="Eliminar" width={27} height={27} />
                                    </button>
                                    <button onClick={() => {
                                        setSelectedAlumno(alumno); setObAlumno(alumno); console.log("mayor??", mayor);
                                    }} className="text-blue-600 font-bold">
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
                <button onClick={() => { setSelectedAlumno(-1); setObAlumno(null); setMayor(true) }} className="mt-6 mx-4">
                    {/* <Image src={ButtonAdd}
                        className="mx-3"
                        alt="Image Alt Text"
                        width={70}
                        height={70} /> */}
                    agregar mayor
                </button>
                <button onClick={() => { setSelectedAlumno(-2); setObAlumno(null); setMayor(false) }} className="mt-6 mx-4">
                    agregar menor
                </button>
            </div>
            <div className="fixed bottom-0 py-5 bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
            {selectedAlumno !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div ref={scrollRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative" style={{ height: '70vh', overflow: "auto" }}>
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedAlumno === -1 ? "Nuevo Alumno" : "Editar Alumno"}
                        </h2>
                        {errorMessage && (
                            <div className="mb-4 text-red-600">
                                {errorMessage} {/* Muestra el mensaje de error */}
                            </div>
                        )}
                        <h1 className=" w-full mt-8 mb-3 font-semibold underline">Datos del alumno</h1>
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
                                placeholder={selectedAlumno === -2 ? "Si no tiene email, el mismo debe ser del responsable" : ""}
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
                        {selectedAlumno !== -2 && <div className="mb-4">
                            <label htmlFor="telefono" className="block">Teléfono:</label>
                            <input
                                type="number"
                                id="telefono"
                                name="telefono"
                                value={alumnoDetails.telefono}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>}
                        <div className="flex-col flex mb-4">
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                            <input
                                id="fechaNacimiento"
                                type="date"
                                name="fechaNacimiento"
                                className="border rounded"
                                value={(alumnoDetails.fechaNacimiento)}
                                onChange={handleChange}
                                min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]} // Set min to 100 years ago
                                max={new Date().toISOString().split('T')[0]} // Set max to today's date
                            />
                        </div>
                        {(selectedAlumno === -1 || selectedAlumno === -2) && <div className="mb-4">
                            <label htmlFor="password" className="block">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={alumnoDetails.password}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>}
                        {((!nacionalidadName && !provinciaName && !localidadName && !calle && !numero && selectedAlumno !== -1 && selectedAlumno !== -2) && obAlumno.direccionId) && <p className=" text-red-600">Cargando su ubicación...</p>}
                        {((selectedAlumno === -1 || selectedAlumno === -2) || (selectedAlumno !== -1 && selectedAlumno !== -2 && !obAlumno.direccionId) || (selectedAlumno !== -1 && selectedAlumno !== -2 && obAlumno.direccionId && nacionalidadName)) && <div className="mb-4">
                            <label htmlFor="pais" className="block">País:</label>
                            <input
                                type="text"
                                id="pais"
                                name="pais"
                                value={String(nacionalidadName)}
                                onChange={(e) => setNacionalidadName(e.target.value)}
                                className="p-2 w-full border rounded"
                            />
                        </div>}
                        {((selectedAlumno === -1 || selectedAlumno === -2) || (selectedAlumno !== -1 && selectedAlumno !== -2 && !obAlumno.direccionId) || (selectedAlumno !== -1 && selectedAlumno !== -2 && obAlumno.direccionId && provinciaName)) && <div className="mb-4">
                            <label htmlFor="provincia" className="block">Provincia:</label>
                            <input
                                type="text"
                                id="provincia"
                                name="provincia"
                                value={String(provinciaName)}
                                onChange={(e) => setProvinciaName(e.target.value)}
                                className="p-2 w-full border rounded"
                            />
                        </div>}
                        {((selectedAlumno === -1 || selectedAlumno === -2) || (selectedAlumno !== -1 && selectedAlumno !== -2 && !obAlumno.direccionId) || (selectedAlumno !== -1 && selectedAlumno !== -2 && obAlumno.direccionId && localidadName)) && <div className="mb-4">
                            <label htmlFor="localidad" className="block">Localidad:</label>
                            <input
                                type="text"
                                id="localidad"
                                name="localidad"
                                value={String(localidadName)}
                                onChange={(e) => setLocalidadName(e.target.value)}
                                className="p-2 w-full border rounded"
                            />
                        </div>}
                        {((selectedAlumno === -1 || selectedAlumno === -2) || (selectedAlumno !== -1 && selectedAlumno !== -2 && !obAlumno.direccionId) || (selectedAlumno !== -1 && selectedAlumno !== -2 && obAlumno.direccionId && calle && numero)) && <div>
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
                                    type="number"
                                    id="numero"
                                    name="numero"
                                    value={Number(numero)}
                                    onChange={(e) => setNumero(Number(e.target.value))}
                                    className="p-2 w-full border rounded"
                                />
                            </div>
                        </div>
                        }
                        {
                            mayor !== true && <div>
                                <h1 className=" w-full mt-8 mb-3 font-semibold underline">Datos del responsable</h1>
                                <div className="mb-4">
                                    <label htmlFor="ResponsableNombre" className="block">Nombre :</label>
                                    <input
                                        type="text"
                                        id="ResponsableNombre"
                                        name="nombre"
                                        value={responsableDetails.nombre}
                                        onChange={handleChangeResponsable}
                                        className="p-2 w-full border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="ResponsableApellido" className="block">Apellido:</label>
                                    <input
                                        type="text"
                                        id="ResponsableApellido"
                                        name="apellido"
                                        value={responsableDetails.apellido}
                                        onChange={handleChangeResponsable}
                                        className="p-2 w-full border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="dniR" className="block">DNI:</label>
                                    <input
                                        type="number"
                                        id="dniR"
                                        name="dni"
                                        value={responsableDetails.dni}
                                        onChange={handleChangeResponsable}
                                        className="p-2 w-full border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="telefonoR" className="block">Teléfono:</label>
                                    <input
                                        type="number"
                                        id="telefonoR"
                                        name="telefono"
                                        value={responsableDetails.telefono}
                                        onChange={handleChangeResponsable}
                                        className="p-2 w-full border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="emailR" className="block">Email:</label>
                                    <input
                                        type="text"
                                        id="emailR"
                                        name="email"
                                        value={responsableDetails.email}
                                        onChange={handleChangeResponsable}
                                        className="p-2 w-full border rounded"
                                    />
                                </div>

                            </div>
                        }
                        <div>
                            <Talleres crearEstado={selectedAlumno} user={obAlumno} cursosElegido={cursosElegido} setCursosElegido={setCursosElegido} />
                        </div>
                        {selectedAlumno !== -1 && selectedAlumno !== -2 && <div>
                            <button
                                className="py-2  text-black font-bold rounded hover:underline"
                                onClick={() => setHabilitarCambioContraseña(!habilitarCambioContraseña)}
                            >
                                Cambiar contraseña
                            </button>
                            {habilitarCambioContraseña && <div className=' absolute bg-slate-100 rounded-md shadow-md px-2 left-1/2 top-1/2 tranform -translate-x-1/2 -translate-y-1/2'>
                                <button className='absolute top-2 right-2' onClick={() => setHabilitarCambioContraseña(false)}>X</button>
                                <PasswordComponent setCorrecto={setCorrecto} correcto={correcto} />
                            </div>}
                        </div>}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={(((selectedAlumno === -1 || selectedAlumno === -2) ? handleCreateAlumno : handleSaveChanges))}


                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => { setSelectedAlumno(null); handleCancel_init() }}
                                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </main >
    )
    // #endregion
}
//export default Alumnos;
export default withAuth(Alumnos);
