"use client";
// #region Imports
import React, { useEffect, useRef, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getProfesionales, deleteProfesional, createProfesional, updateProfesional, Profesional, getProfesionalById } from "../../../services/profesional";
import Image from "next/image";
import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import EditIcon from "../../../../public/Images/EditIcon.png";
import Background from "../../../../public/Images/Background.jpeg"
import ButtonAdd from "../../../../public/Images/Button.png";
import { getImagesUser } from "@/services/repoImage";
import { addDireccion, getDireccionById, updateDireccionById } from "@/services/ubicacion/direccion";
import { addProvincias, getProvinciasById, getProvinciasByName, updateProvinciaById } from "@/services/ubicacion/provincia";
import { addLocalidad, getLocalidadById, getLocalidadByName, Localidad, updateLocalidad } from "@/services/ubicacion/localidad";
import Talleres from "@/components/talleres/page";
import { createProfesional_Curso, getCursosByIdProfesional } from "@/services/profesional_curso";
import { Curso, getCursoById } from "@/services/cursos";
import { addPais, getPaisById } from "@/services/ubicacion/pais";
import { get } from "http";
// #endregion

const Profesionales = () => {
    // #region UseStates
    const [profesionales, setProfesionales] = useState<any[]>([]);
    const [selectedProfesional, setSelectedProfesional] = useState<any>(null);

    const [obProfesional, setObProfesional] = useState<any>(null);

    const [profesionalDetails, setProfesionalDetails] = useState<any>({});

    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");

    //Estado para almacenar las imagenes
    const [images, setImages] = useState<any[]>([]);

    //useState para almacenar la dirección
    const [nacionalidadName, setNacionalidadName] = useState<string>();
    // Estado para almacenar el ID de la provincia, inicialmente nulo
    const [provinciaName, setProvinciaName] = useState<string>();

    // Estado para almacenar el ID de la localidad, inicialmente nulo
    const [localidadName, setLocalidadName] = useState<string>();

    // Estado para almacenar la calle, inicialmente nulo
    const [calle, setcalle] = useState<string | null>(null);

    // Estado para almacenar el número de la dirección, inicialmente nulo
    const [numero, setNumero] = useState<number | null>(null);

    // Estado para almacenar los cursos elegidos, inicialmente un array vacío
    const [cursosElegido, setCursosElegido] = useState<any[]>([]);

    // Referencia para el contenedor de desplazamiento
    const scrollRef = useRef<HTMLDivElement>(null);
    // #endregion

    // #region UseEffects
    //useEffect para obtener los profesionales
    useEffect(() => {
        fetchProfesionales();
        //getCursosElegidos()
        //fetchImages();
        handleCancel_init();

    }, []);
    useEffect(() => {
        if (obProfesional && obProfesional.direccionId) {
            getUbicacion(obProfesional);
        } else if(obProfesional && obProfesional.direccionId === null) {
            setNacionalidadName("");
            setProvinciaName("");
            setLocalidadName("");
            setcalle("");
            setNumero(0);
            setCursosElegido([]);
        }
    }, [obProfesional]);
    useEffect(() => {
        if ((errorMessage.length > 0) && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [errorMessage]);

    useEffect(() => {
        if (selectedProfesional !== null && selectedProfesional !== -1) {
            setProfesionalDetails({
                nombre: selectedProfesional.nombre,
                apellido: selectedProfesional.apellido,
                email: selectedProfesional.email,
                password: selectedProfesional.password,
                telefono: selectedProfesional.telefono,
                especialidad: selectedProfesional.especialidad,
                direccionId: selectedProfesional.direccionId,
            });
        } else if (selectedProfesional === -1) {
            setProfesionalDetails({
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                telefono: 0,
                especialidad: '',
            });
        }
    }, [selectedProfesional, profesionales]);
    // #endregion

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

        // Actualizar los estados con los datos obtenidos
        setLocalidadName(String(localidad?.nombre));
        setProvinciaName(String(prov?.nombre)); 
        setNacionalidadName(String(nacionalidad?.nombre));
        setNumero(Number(direccion?.numero));
        setcalle(String(direccion?.calle));
        console.log("TODOSSS", localidadName, provinciaName, nacionalidadName, calle, numero);
        return {direccion, localidad, prov, nacionalidad};
    }


       //region solo considera repetidos
       async function createUbicacion() {
        // Obtener la localidad asociada a la dirección
        console.log("Antes de crear la ubicacion", (localidadName), calle, numero, provinciaName, nacionalidadName);
        const nacionalidad = await addPais({ nombre: String(nacionalidadName) });
        const prov = await addProvincias({ nombre: String(localidadName), nacionalidadId: Number(nacionalidad?.id) });

        const localidad = await addLocalidad({ nombre: String(localidadName), provinciaId: Number(prov?.id) });
        console.log("LOCALIDAD", localidad);
        const direccion = await addDireccion({ calle: String(calle), numero: Number(numero), localidadId: Number(localidad?.id )});
        console.log("DIRECCION", direccion);
        return  direccion ;
    }
    // #region Métodos
    async function fetchProfesionales() {
        try {
            const data = await getProfesionales();
            data.map(async (profesional) => {
                const cursos = await getCursosByIdProfesional(profesional.id);
                setCursosElegido(prevCursosElegido => [...prevCursosElegido, {id: profesional.id, cursos: cursos}]);
                console.log("Fetching cursos", cursos);
            });
           // const cursos = await getCursosByIdProfesional(data);
            console.log(data);
            setProfesionales(data);
        } catch (error) {
            console.error("Imposible obetener Profesionales", error);
        }
    }
    function setVariablesState(){
        setNacionalidadName("");
        setProvinciaName("");
        setLocalidadName("");
        setcalle("");
        setNumero(0);
        setObProfesional(null);
        setSelectedProfesional(null);
        fetchProfesionales();
        setErrorMessage("");
    }
    // Función para manejar los cambios en los campos del formulario
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setProfesionalDetails((prevDetails: any) => ({
            ...prevDetails,
            [name]: name === 'telefono' ? parseInt(value, 10) : value // Convierte `telefono` a número entero si el campo es `telefono`
        }));
    }

    // Método para obtener las imagenes
    const fetchImages = async () => {
        const result = await getImagesUser();
        if (result.error) {
            setErrorMessage(result.error)
        } else {
            console.log(result)
            setImages(result.images);

        }
    };
    //region check validation!!
    function validateProfesionalDetails() {
        const { nombre, apellido, email, especialidad } = profesionalDetails;

        //validar que el nombre sea de al menos 2 caracteres
        if (nombre.length < 2) {
            return "El nombre debe tener al menos 2 caracteres";
        }
        //validar que el apellido sea de al menos 2 caracteres
        if (apellido.length < 2) {
            return "El apellido debe tener al menos 2 caracteres";
        }

    }


    async function handleSaveChanges() {

        const validationError = validateProfesionalDetails();
        console.log(obProfesional)
       
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        if(!obProfesional.direccionId) {
            const dir = await createUbicacion();
            const newProfesional = await updateProfesional(obProfesional?.id || 0, {
                nombre: profesionalDetails.nombre, apellido: profesionalDetails.apellido,
                especialidad: String(profesionalDetails.especialidad), email: String(profesionalDetails.email),
                telefono: Number(profesionalDetails.telefono), password: String(profesionalDetails.password),
                direccionId: Number(dir?.id)
            });
            newProfesional
            setVariablesState();
            return;
        }
        const { direccion, localidad, prov, nacionalidad } = await getUbicacion(obProfesional);
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


            const newProfesional = await updateProfesional(obProfesional?.id || 0, {
                nombre: profesionalDetails.nombre, apellido: profesionalDetails.apellido,
                especialidad: String(profesionalDetails.especialidad), email: String(profesionalDetails.email),
                telefono: Number(profesionalDetails.telefono), password: String(profesionalDetails.password),
                direccionId: Number(direccion?.id)
            });
            // si el resultado es un string, entonces es un mensaje de error
            if (typeof newProfesional === "string") return setErrorMessage(newProfesional);

            for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                 const prof_cur = await createProfesional_Curso({ cursoId: curso.id, profesionalId: newProfesional.id });
                 if (typeof prof_cur === "string") return setErrorMessage(prof_cur);
                //console.log(prof_cur)
            }
            setVariablesState();
        } catch (error) {
            console.error("Error al actualizar el profesional", error);
        }
    }

    async function handleEliminarProfesional(profesional: any) {
        try {
            await deleteProfesional(profesional.id);
            fetchProfesionales();
        } catch (error) {
            console.error("Error al eliminar el profesional", error);
        }
    }



    async function handleCreateProfesional() {
        const validationError = validateProfesionalDetails();
        const direccion = await createUbicacion();
        console.log("newDireccion", direccion);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        try {
            //acualizo los datos de la direccion del alumno
            const newProfesional = await createProfesional({
                nombre: profesionalDetails.nombre, apellido: profesionalDetails.apellido,
                especialidad: String(profesionalDetails.especialidad), email: String(profesionalDetails.email),
                telefono: BigInt(profesionalDetails.telefono), password: String(profesionalDetails.password),
                direccionId: Number(direccion?.id)
            });
            for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                await createProfesional_Curso({ cursoId: curso.id, profesionalId: newProfesional.id });
                //console.log(prof_cur)
            }
            console.log("newProfesional", newProfesional)
            console.log("ProfesionalDetails", profesionalDetails)
            console.log(cursosElegido)
            setProfesionales([...profesionales, newProfesional]);
            setVariablesState();


        } catch (error) {
            console.error("Error al crear el profesional", error);
        }
    }
    async function handleCancel_init() {
        setNacionalidadName("");
        setProvinciaName("");
        setLocalidadName("");
        setcalle("");
        setCursosElegido([]);
        setNumero(null);
        setObProfesional(null);
    }
    function getCursosElegidos(profesionalId:number) {
        const cursos = cursosElegido.find((curso) => curso.id === profesionalId);
       // console.log("Cursos", cursos);
        return cursos?.cursos;

    }    
    
    // #endregion


    // #region Return
    return (
        <main className="relative min-h-screen w-screen" >
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" priority={true} />

            <div className="fixed  justify-between w-full p-4" style={{ background: "#1CABEB" }} >
                <Navigate />
            </div>
            <h1 className="absolute top-40 left-60 mb-5 text-3xl" onClick={()=>console.log(cursosElegido)} >Profesionales</h1>

            <div className="top-60 border p-1 absolute left-40 h-90 max-h-90 w-1/2 bg-gray-400 bg-opacity-50" style={{ height: '50vh', overflow: "auto" }}>
                <div className="flex flex-col space-y-4 my-4 w-full px-4">
                    {profesionales.map((profesional, index) => (
                        <div key={index} className="border p-4 mx-2 relative bg-white w-47 h-47 justify-center items-center" >
                            <div className="relative w-30 h-70" >
                                {<Image
                                    src={images[0]}
                                    alt="Background Image"
                                    objectFit="cover"
                                    className="w-full h-full"
                                    layout="fill"
                                />}
                                <button onClick={() => handleEliminarProfesional(profesional)} className="absolute top-0 right-0 text-red-600 font-bold">
                                    <Image src={DeleteIcon} alt="Eliminar" width={27} height={27} />
                                </button>

                                <button onClick={() => {setSelectedProfesional(profesional); setObProfesional(profesional); console.log(profesional)}} className="absolute top-0 right-8 text-red-600 font-bold">
                                    <Image src={EditIcon} alt="Editar" width={27} height={27} />
                                </button>
                            </div>
                            <h3 className="flex  bottom-0 text-black z-1">{profesional.nombre} {profesional.apellido}</h3>
                            <div className="text-sm text-gray-600">
                                <p>Email: {profesional.email}</p>

                                {cursosElegido.length === 0 && <p className="p-2 border rounded bg-gray-100">{"Talleres no cargados"}</p>}
                                {cursosElegido.length > 0 && (
                                    <p className="p-2 border rounded bg-gray-100">
                                        {getCursosElegidos(profesional.id).map((curso:any, index:number, array:any) => (
                                            <span key={index}>
                                                {curso.nombre}{index < array.length - 1 ? ' - ' : ''}
                                            </span>
                                        ))}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setSelectedProfesional(-1)} className="mt-6 mx-4">
                    <Image src={ButtonAdd}
                        className="mx-3"
                        alt="Image Alt Text"
                        width={70}
                        height={70} />
                </button>
            </div>
            <div className="fixed bottom-0 py-5 bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
            {selectedProfesional !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div ref={scrollRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative" style={{ height: '70vh', overflow: "auto" }}>
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedProfesional === -1 ? "Nuevo Profesional" : "Editar Profesional"}
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
                                value={profesionalDetails.nombre}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                            <label htmlFor="apellido" className="block">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={profesionalDetails.apellido}
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
                                value={profesionalDetails.email}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="especialidad" className="block">Especialidad:</label>
                            <input
                                type="text"
                                id="especialidad"
                                name="especialidad"
                                value={profesionalDetails.especialidad}
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
                                value={profesionalDetails.telefono}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>

{/*                         <div className="mb-4">
                            <label htmlFor="password" className="block">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={profesionalDetails.password}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div> */}

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
                        <div>
                            <Talleres cursosElegido={cursosElegido} setCursosElegido={setCursosElegido} />
                        </div>
                        <div>
                            <button
                                className="py-2  text-black rounded hover:underline">
                                Cambiar contraseña
                            </button>
                        </div>


                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={((selectedProfesional === -1 ? handleCreateProfesional : handleSaveChanges))}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800">
                                Guardar
                            </button>
                            <button
                                onClick={() =>{ setSelectedProfesional(null); handleCancel_init()}}
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
export default Profesionales