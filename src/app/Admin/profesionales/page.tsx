"use client";
// #region Imports
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getProfesionales, deleteProfesional, createProfesional, updateProfesional } from "../../../services/profesional";
import Image from "next/image";
import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import EditIcon from "../../../../public/Images/EditIcon.png";
import Background from "../../../../public/Images/Background.jpeg"
import ButtonAdd from "../../../../public/Images/Button.png";
import { getImages_talleresAdmin } from "@/services/repoImage";
import { addDireccion, getApiDireccionesEstado, getDireccionById } from "@/services/ubicacion/direccion";
import { addProvincias, getApiProvinciaById } from "@/services/ubicacion/provincia";
import Localidades from "@/components/ubicacion/localidad";
import Provincias from "@/components/ubicacion/provincia";
import Direcciones from "@/components/ubicacion/direccion";
import { addLocalidad, getApiLocalidadByName } from "@/services/ubicacion/localidad";
import Talleres from "@/components/talleres/page";
import { createProfesional_Curso } from "@/services/profesional_curso";
// #endregion

const Profesionales = () => {
    // #region UseStates
    const [profesionales, setProfesionales] = useState<any[]>([]);
    const [selectedProfesional, setSelectedProfesional] = useState<any>(null);
    const [profesionalDetails, setProfesionalDetails] = useState<any>({});
    
    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");

    //Estado para almacenar las imagenes
    const [images, setImages] = useState<any[]>([]);

    //useState para almacenar la dirección
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
    // #endregion

    // #region UseEffects
    //useEffect para obtener los profesionales
    useEffect(() => {
        fetchProfesionales();
        fetchImages();
    }, []);

    useEffect(() => {
        if (selectedProfesional !== null && selectedProfesional !== -1) {
            setProfesionalDetails({
                nombre: selectedProfesional.nombre,
                apellido: selectedProfesional.apellido,
                email: selectedProfesional.email,
                especialidad: selectedProfesional.especialidad,
                direccionId: selectedProfesional.direccionId,
            });
        } else if (selectedProfesional === -1) {
            setProfesionalDetails({});
        }
    }, [selectedProfesional, profesionales]);
    // #endregion

    // #region Métodos
    async function fetchProfesionales() {
        try {
            const data = await getProfesionales();
            console.log(data);
            setProfesionales(data);
        } catch (error) {
            console.error("Imposible obetener Profesionales", error);
        }
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
        const result = await getImages_talleresAdmin();
        if (result.error) {
            setErrorMessage(result.error)
        } else {
            console.log(result)
            setImages(result.images);

        }
    };
    //region check validation!!
    function validateProfesionalDetails(estado: boolean) {
        const { nombre, apellido, email, especialidad } = profesionalDetails;

        //validar que el nombre sea de al menos 2 caracteres
        if (nombre.length < 2) {
            return "El nombre debe tener al menos 2 caracteres";
        }
        //validar que el apellido sea de al menos 2 caracteres
        if (apellido.length <2) {
            return "El apellido debe tener al menos 2 caracteres";
        }

        if(estado === false){
            return "El nombre de la calle o el número son incorrectos"
        }
    }


    async function handleSaveChanges() {
        const estado = await getApiDireccionesEstado(String(calle), Number(numero))

        const validationError = validateProfesionalDetails(estado);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        if (selectedProfesional === null) {
            try {
                await updateProfesional(selectedProfesional.id, profesionalDetails); //actualizar el profesional
                setSelectedProfesional(null);
                fetchProfesionales();
                setErrorMessage("");
            } catch (error) {
                console.error("Error al actualizar el profesional", error);
            }
        };
    }

    async function handleEliminarProfesional(profesional: any) {
        try {
            await deleteProfesional(profesional.id);
            fetchProfesionales();
        } catch (error) {
            console.error("Error al eliminar el profesional", error);
        }
    }


// en esta funcion se guardan las direcciones en la base de datos
 async function createNewUbicacion(provinciaId:number, localidadId:number,calle:string,numero:number){
    // Imprimir datos
    console.log(provinciaId);
    console.log(localidadId);
    console.log(calle, numero);
  
    // Obtener el nombre de la provincia usando el ID de la provincia
    const provinciaNombre = await getApiProvinciaById(Number(provinciaId));
  
    // Agregar la provincia a la base de datos y obtener el nuevo objeto de provincia
    const newProvincia = await addProvincias({
        nombre: provinciaNombre,
        nacionalidadId: 1 // ID para Argentina
    });
  
    // Obtener el nombre de la localidad usando el ID de la provincia y el ID de la localidad
    const localidadNombre = await getApiLocalidadByName(Number(provinciaId), Number(localidadId));
  
    // Agregar la localidad a la base de datos y obtener el nuevo objeto de localidad
    const newLocalidad = await addLocalidad({
        nombre: localidadNombre,
        provinciaId: newProvincia?.id ?? 0 // Usar el nuevo ID de la provincia o 0 si es indefinido
    });
  
    // Agregar la dirección a la base de datos y obtener el nuevo objeto de dirección
    const newDireccion = await addDireccion({
        calle: String(calle),
        numero: Number(numero),
        localidadId: newLocalidad?.id ?? 0 // Usar el nuevo ID de la localidad o 0 si es indefinido
    });
  
    // Imprimir los datos obtenidos y creados para fines de depuración
    console.log(`DATOS: ${provinciaNombre}`);
    console.log(localidadNombre);
    console.log("newDireccion", newDireccion);
    console.log(newLocalidad);
    console.log(newProvincia);
    return newDireccion;
  }

    async function handleCreateProfesional() {
        const estado = await getApiDireccionesEstado(String(calle), Number(numero))
        console.log("ESTADOOOOO",estado)
        const validationError = validateProfesionalDetails(estado);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        try {
            const newDireccion= await createNewUbicacion(Number(provinciaId), Number(localidadId), String(calle), Number(numero));
            // Actualizar los detalles del profesional con el nuevo ID de dirección
            setProfesionalDetails({ 
                ...profesionalDetails, 
                direccionId: newDireccion?.id,
            });
            const newProfesional = await createProfesional(profesionalDetails);
            for (const cursoId of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                const prof_cur= await createProfesional_Curso({ cursoId, profesionalId: newProfesional.id });
                //console.log(prof_cur)
            }
            console.log("newProfesional",newProfesional)
            console.log("ProfesionalDetails",profesionalDetails)
            console.log(cursosElegido)
            setProfesionales([...profesionales, newProfesional]);
            setSelectedProfesional(newProfesional.id);
            fetchProfesionales();
            setErrorMessage("");


        } catch (error) {
            console.error("Error al crear el profesional", error);
        }
    }
    // #endregion


    // #region Return
    return (
        <main className="relative min-h-screen w-screen" >
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" priority={true} />

            <div className="fixed  justify-between w-full p-4" style={{background: "#1CABEB"}} >
                <Navigate />
            </div>
            <h1 className="absolute top-40 left-60 mb-5 text-3xl" >Profesionales</h1>
            
            <div className="top-60 border p-1 absolute left-40 h-90 max-h-90 w-1/2 bg-gray-400 bg-opacity-50" style={{ height: '50vh', overflow: "auto" }}>
                <div className="flex flex-col space-y-4 my-4 w-full px-4">
                    {profesionales.map((profesional, index) => (
                        <div key={index}  className="border p-4 mx-2 relative bg-white w-47 h-47 justify-center items-center" >
                            <div className="relative w-30 h-70">
                                {<Image
                                    src={images[0]}
                                    alt="Background Image"
                                    objectFit="cover"
                                    className="w-full h-full"
                                    layout="fill"
                                />}
                                <button onClick={() => handleEliminarProfesional(profesional)} className="absolute top-0 right-0 text-red-600 font-bold"></button>
                                <Image src={DeleteIcon} alt="Eliminar" width={27} height={27} />
                                <button onClick={() => setSelectedProfesional(profesional)} className="absolute top-0 right-8 text-red-600 font-bold">
                                    <Image src={EditIcon} alt="Editar" width={27} height={27} />
                                </button>
                            </div>
                            <h3 className="flex  bottom-0 text-black z-1">{profesional.nombre} {profesional.apellido}</h3>
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
            <div className="fixed bottom-0 mt-20 bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
            {selectedProfesional !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
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
                                type="text"
                                id="telefono"
                                name="telefono"
                                value={profesionalDetails.telefono}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={profesionalDetails.password}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>

                        <div>
                            <h1>Provincia:</h1>
                            <Provincias setprovinciaId={setprovinciaId}/>
                        </div>
                        <div>
                            <h1>Localidad:</h1>
                            <Localidades provinciaId= {(provinciaId)} setLocalidadId = {setLocalidadId}/>
                        </div>
                        <div>
                            <Direcciones setCalle={setcalle} setNumero={setNumero}/>
                        </div>
                        <div>
                            <Talleres cursosElegido={cursosElegido} setCursosElegido={setCursosElegido}/>
                        </div>


                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={((selectedProfesional === -1 ? handleCreateProfesional : handleSaveChanges))}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800">
                                Guardar
                            </button>
                            <button
                                onClick={() => setSelectedProfesional(null)}
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