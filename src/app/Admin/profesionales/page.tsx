"use client";
// #region Imports
import React, { useEffect, useRef, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getProfesionales, deleteProfesional, createProfesional, updateProfesional, Profesional, getProfesionalById } from "../../../services/profesional";
import Image from "next/image";
import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import EditIcon from "../../../../public/Images/EditIcon.png";
//import Background from "../../../../public/Images/Background.jpeg"
import ButtonAdd from "../../../../public/Images/Button.png";
//imagen default si el curso no tiene imagen
import NoImage from "../../../../public/Images/default-no-image.png";
import { getImagesUser } from "@/services/repoImage";

import { addDireccion, getDireccionById, getDireccionCompleta, updateDireccionById } from "@/services/ubicacion/direccion";
import { addProvincias, getProvinciasById, getProvinciasByName, updateProvinciaById } from "@/services/ubicacion/provincia";
import { addLocalidad, getLocalidadById, getLocalidadByName, Localidad, updateLocalidad } from "@/services/ubicacion/localidad";
import Talleres from "@/components/talleres/page";
import { createProfesional_Curso, getCursosByIdProfesional } from "@/services/profesional_curso";
import { Curso, getCursoById } from "@/services/cursos";
import { addPais, getPaisById } from "@/services/ubicacion/pais";
import withAuth from "../../../components/Admin/adminAuth";
import PasswordComponent from "@/components/Password/page";
import { hashPassword } from "@/helpers/hashPassword";
//para subir imagenes:
import { handleUploadProfesionalImage, handleDeleteProfesionalImage, mapearImagenes } from "@/helpers/repoImages";

import { validateApellido, validateDireccion, validateDni, validateEmail, validateNombre, validatePasswordComplexity, validatePhoneNumber } from "@/helpers/validaciones";
import { dniExists, emailExists } from "@/services/Alumno";
import Background from "../../../../public/Images/Background.jpeg"
import Loader from "@/components/Loaders/loadingSave/page";
import { Trash2, UserRoundPlus, UserRoundX } from "lucide-react";
// #endregion

const Profesionales = () => {
    // #region UseStates
    const [profesionales, setProfesionales] = useState<any[]>([]);
    const [profesionalesBuscados, setProfesionalesBuscados] = useState<any[]>([])
    const [profesionalAbuscar, setProfesionalAbuscar] = useState<string>("")
    const [selectedProfesional, setSelectedProfesional] = useState<any>(null);
    const [profesionalesListaCompleta, setProfesionalesListaCompleta] = useState<any[]>([]);
    const [habilitarProfesionalesBuscados, setHabilitarProfesionalesBuscados] = useState<boolean>(true);

    const [obProfesional, setObProfesional] = useState<any>(null);

    const [profesionalDetails, setProfesionalDetails] = useState<any>({});
    const [profesionalDetailsCopia, setProfesionalDetailsCopia] = useState<any>({});

    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");

    //Estado para almacenar las imagenes
    const [images, setImages] = useState<any[]>([]);
    // Estado para almacenar los cursos elegidos, inicialmente un array vacío
    const [cursosElegido, setCursosElegido] = useState<any[]>([]);

    // Referencia para el contenedor de desplazamiento
    const scrollRef = useRef<HTMLDivElement>(null);

    //habilitar sección de cambio de contraseña
    const [habilitarCambioContraseña, setHabilitarCambioContraseña] = useState<boolean>(false);
    //estado para responder a la confirmación de cambio de contraseña
    const [correcto, setCorrecto] = useState(false);

    //para subir una imagen y asignarla al curso
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    //booleano para saber si las imagenes ya se cargaron
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [imageUrls, setImageUrls] = useState<any>({});

    const [ProfesionalAEliminar, setProfesionalAEliminar] = useState<any[]>([]);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const [allProfesionalesChecked, setAllProfesionalesChecked] = useState<boolean>(false);
    const [allProfesionalesSelected, setAllProfesionalesSelected] = useState<any[]>([]);
    // #endregion

    // #region UseEffects
    //useEffect para obtener los profesionales
    useEffect(() => {
        if (profesionales.length === 0) {
            fetchProfesionales();
            //getCursosElegidos()
            //fetchImages();
            handleCancel_init();
        }

    }, []);

    useEffect(() => {
        // Llamar a fetchImages después de que los cursos se hayan cargado
        if (profesionales.length > 0 && !imagesLoaded) {
            fetchImages();
        }
    }, [profesionales]);

    useEffect(() => {
        if (errorMessage !== "") {
            setInterval(() => {
                setErrorMessage("")
            }, 5000);
        }
    }, [errorMessage])
    /*     useEffect(() => {
            if (obProfesional && obProfesional.direccionId) {
                getUbicacion(obProfesional);
            } else if (obProfesional && obProfesional.direccionId === null) {
                setNacionalidadName("");
                setProvinciaName("");
                setLocalidadName("");
                setcalle("");
                setNumero(0);
                setCursosElegido([]);
            }
        }, [obProfesional]); */
    useEffect(() => {
        if ((errorMessage.length > 0) && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [errorMessage]);

    useEffect(() => {
        if (selectedProfesional !== null && selectedProfesional !== -1) {
            setProfesionalDetails({
                id: selectedProfesional.id,
                nombre: selectedProfesional.nombre || '',
                apellido: selectedProfesional.apellido || '',
                email: selectedProfesional.email || '',
                password: '',
                telefono: selectedProfesional.telefono ? selectedProfesional.telefono : '',
                especialidad: selectedProfesional.especialidad || '',
            });
            setProfesionalDetailsCopia({
                id: selectedProfesional.id,
                nombre: selectedProfesional.nombre || '',
                apellido: selectedProfesional.apellido || '',
                email: selectedProfesional.email || '',
                password: '',
                telefono: selectedProfesional.telefono ? selectedProfesional.telefono : '',
                especialidad: selectedProfesional.especialidad || '',

            });
        } else if (selectedProfesional === -1) {
            setProfesionalDetails({
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                telefono: '',
                especialidad: '',
            });
            setProfesionalDetailsCopia({
                nombre: '',
                apellido: '',
                email: '',
                password: '',
                telefono: '',
                especialidad: '',
            });
        }
    }, [selectedProfesional, profesionales]);
    // #endregion
    async function fetchProfesionales() {
        try {
            const data = await getProfesionales();
            /*             data.map(async (profesional) => {
                            const cursos = await getCursosByIdProfesional(profesional.id);
                            setCursosElegido(prevCursosElegido => [...prevCursosElegido, { id: profesional.id, cursos: cursos }]);
                            console.log("Fetching cursos", cursos);
                        }); */
            //console.log(data);
            setProfesionales(data);
            setProfesionalesListaCompleta(data);
        } catch (error) {
            console.error("Imposible obetener Profesionales", error);
        }
    }
    /*     async function getUbicacion(userUpdate: any) {
            // Obtener la dirección del usuario por su ID
            //console.log("SI DIRECCIONID ES FALSE:", Number(userUpdate?.direccionId));
            const direccion = await getDireccionCompleta(userUpdate?.direccionId);
    
            setLocalidadName(String(direccion?.localidad?.nombre));
            setProvinciaName(String(direccion?.localidad?.provincia?.nombre));
            setNacionalidadName(String(direccion?.localidad?.provincia?.nacionalidad?.nombre));
            setNumero(Number(direccion?.numero));
            setcalle(String(direccion?.calle));
            return direccion
        } */


    //region solo considera repetidos
    /*     async function createUbicacion() {
            // Obtener la localidad asociada a la dirección
            console.log("Antes de crear la ubicacion", (localidadName), calle, numero, provinciaName, nacionalidadName);
            const nacionalidad = await addPais({ nombre: String(nacionalidadName) });
            const prov = await addProvincias({ nombre: String(provinciaName), nacionalidadId: Number(nacionalidad?.id) });
    
            const localidad = await addLocalidad({ nombre: String(localidadName), provinciaId: Number(prov?.id) });
            console.log("LOCALIDAD", localidad);
            const direccion = await addDireccion({ calle: String(calle), numero: Number(numero), localidadId: Number(localidad?.id) });
            console.log("DIRECCION", direccion);
            return direccion;
        } */
    // #region Métodos

    function setVariablesState() {
        /*         setNacionalidadName("");
                setProvinciaName("");
                setLocalidadName("");
                setcalle("");
                setNumero(0); */
        setCursosElegido([]);
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
            [name]: /* name === 'password' ? (() => hashPassword(value)) :  */value
        }));
    }
    //Para manejar el cambio en el input de imagen
    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        // Agrego el nombre de la imagen a cursoDetails
        if (file) {
            const fileName = file.name;
            const lastDotIndex = fileName.lastIndexOf(".");
            const fileExtension =
                lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : ""; // Obtener la extensión del archivo
            // Concatenar id, nombre y apellido del profesional con la extensión // Concatenar nombre del profesional con la extensión
            console.log("ProfesionalDetails inside onFileChange: ", profesionalDetails);
            const fileNameWithExtension = `${profesionalDetails.email}_${profesionalDetails.nombre}_${profesionalDetails.apellido}.${fileExtension}`;
            console.log("FileNameWithExtension: ", fileNameWithExtension);
            setProfesionalDetails({ ...profesionalDetails, imagen: fileNameWithExtension });
            console.log("Imagen seleccionada:", fileNameWithExtension);
        }
    };

    // Método para obtener las imagenes
    const fetchImages = async () => {
        const result = await getImagesUser();
        console.log(result.images, "LAS IMAGENESSSSS");
        console.log(result.downloadurls, "LOS DOWNLOADURLS");
        if (result.error) {
            setErrorMessage(result.error);
        } else {
            console.log(result);
            setImages(result.images);

            // Mapear las imágenes y crear un diccionario de imageUrls
            const updatedProfesionales = mapearImagenes(profesionales, {
                images: result.images,
                downloadurls: result.downloadurls,
            });
            const newImageUrls: any = {};
            updatedProfesionales.forEach((profesional) => {
                if (profesional.imageUrl) {
                    newImageUrls[profesional.id] = profesional.imageUrl;
                }
            });

            // Actualiza el estado con el diccionario de imageUrls y los profesionales actualizados
            setImageUrls(newImageUrls);
            setProfesionales(updatedProfesionales);

            // Marcar las imágenes como cargadas
            setImagesLoaded(true);

            // Hacer un console.log de las imageUrl después de actualizar el estado
            updatedProfesionales.forEach((profesional) => {
                if (profesional.imageUrl) {
                    console.log(
                        `Profesional: ${profesional.id}, Image URL: ${profesional.imageUrl}`
                    );
                }
            });
        }
    };
    //region check validation!!
    async function validateProfesional() {
        const { nombre, apellido, password, email, telefono, dni } = profesionalDetails || {};

        //validar que el nombre sea de al menos 2 caracteres y no contenga números
        let resultValidate;
        if (profesionalDetails) {
            resultValidate = validateNombre(nombre);
            if (resultValidate) return resultValidate;

            resultValidate = validateApellido(apellido);
            if (resultValidate) return resultValidate;

            resultValidate = validateEmail(email);
            if (resultValidate) return resultValidate;
            if (email !== profesionalDetailsCopia.email) {
                const estado = await emailExists(email)
                if (estado) {
                    return "El email ya está registrado.";
                }
                if (resultValidate) return resultValidate;
            }

            if (telefono && typeof (telefono) === "number") {
                resultValidate = validatePhoneNumber(String(telefono));
                if (resultValidate) return resultValidate;
            }
            if ((selectedProfesional === null && password.length > 0) || selectedProfesional === -1) {
                resultValidate = validatePasswordComplexity(password);
                if (resultValidate) return resultValidate;
            }

        }
        return null;
    }

    //para ver las imagenes agregadas sin refresh de pagina
    const handleUploadAndFetchImages = async (selectedFile: File | null) => {
        const result = await handleUploadProfesionalImage(
            selectedFile,
            profesionalDetails.imagen || ""
        );
        if (result.error) {
            setUploadError(result.error);
        } else {
            console.log("Image uploaded successfully:", result.result);
            setImagesLoaded(false); // Establecer en falso para que se vuelvan a cargar las imágenes
        }
    };

    async function handleSaveChanges() {

        const validationError = await validateProfesional();
        console.log(obProfesional)

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        try {
            setIsSaving(true);
            const newProfesional = await updateProfesional(obProfesional?.id || 0, {
                nombre: profesionalDetails.nombre, apellido: profesionalDetails.apellido,
                especialidad: String(profesionalDetails.especialidad), email: String(profesionalDetails.email),
                telefono: String(profesionalDetails.telefono), password: String(profesionalDetails.password),
                imagen: profesionalDetails.imagen
            });
            // si el resultado es un string, entonces es un mensaje de error
            if (typeof newProfesional === "string") return setErrorMessage(newProfesional);

            if (selectedFile) {
                await handleUploadAndFetchImages(selectedFile);
            }
            for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                await createProfesional_Curso({ cursoId: curso.id, profesionalId: newProfesional.id });
                //if (typeof prof_cur === "string") return setErrorMessage(prof_cur);
                //console.log(prof_cur)
            }
            setVariablesState();
            setIsSaving(false);
        } catch (error) {
            console.error("Error al actualizar el profesional", error);
        }
    }

    async function handleEliminarProfesional(profesional: any[]) {
        try {
            setIsDeleting(true);
            //borrar profesional del repo
            for (const prof of profesional) {
                await deleteProfesional(prof.id);
                // Borrar imagen del repo
                if (prof.imagen) await handleDeleteProfesionalImage(prof.imagen);
            }
            fetchProfesionales();
            setIsDeleting(false);
            setProfesionalAEliminar([]);
            setAllProfesionalesSelected([]);
        } catch (error) {
            console.error("Error al eliminar el profesional", error);
        }
    }

    async function handleCreateProfesional() {
        const validationError = await validateProfesional();
        /*         const direccion = await createUbicacion();
                console.log("newDireccion", direccion); */
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        try {
            setIsSaving(true);
            //acualizo los datos de la direccion del alumno, el hash de la contra se hace en el servicio
            const newProfesional = await createProfesional({
                nombre: profesionalDetails.nombre, apellido: profesionalDetails.apellido,
                especialidad: String(profesionalDetails.especialidad), email: String(profesionalDetails.email),
                telefono: String(profesionalDetails.telefono), password: String(profesionalDetails.password),
                imagen: profesionalDetails.imagen
            });
            if (typeof newProfesional === "string") return setErrorMessage(newProfesional);

            // Subir la imagen al repositorio y actualizar las imágenes
            if (selectedFile) {
                await handleUploadAndFetchImages(selectedFile);
            } else {
                await fetchImages(); // Refresca la lista de imágenes si no hay imagen seleccionada
            }

            for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                await createProfesional_Curso({ cursoId: curso.id, profesionalId: newProfesional.id });
                //if (typeof prof_cur === "string") return setErrorMessage(prof_cur);
                //console.log(prof_cur)
            }
            console.log("newProfesional", newProfesional)
            console.log("ProfesionalDetails", profesionalDetails)
            console.log(cursosElegido)
            setProfesionales([...profesionales, newProfesional]);
            setVariablesState();
            setIsSaving(false);


        } catch (error) {
            setErrorMessage("Error al crear el profesional:");
        }
    }
    async function handleCancel_init() {
        setCursosElegido([]);
        setObProfesional(null);
        // profesionalDetails({ nombre: '', apellido: '', email: '', password: '', telefono: "", especialidad: '' });
        setProfesionalDetails({ nombre: '', apellido: '', email: '', password: '', telefono: "", especialidad: '' });
        setSelectedProfesional(null);
        fetchProfesionales();
        setErrorMessage("");

    }

    // Function to handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHabilitarProfesionalesBuscados(true);
        const searchTerm = e.target.value.toLowerCase();
        let filteredProf = profesionalesListaCompleta.filter(prof =>
            prof.nombre.toLowerCase().includes(searchTerm) ||
            prof.apellido.toLowerCase().includes(searchTerm)
        );

        setProfesionalesBuscados(filteredProf);
        setProfesionalAbuscar(e.target.value);
        setProfesionales(filteredProf);
    };
    // #endregion


    // #region Return
    return (
        <main className="relative  bg-cover bg-center"
            style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Navigate />
            <div className="relative  w-full">
                {/* Background */}
                <div className="fixed inset-0 z-[-1]">
                    <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
                </div>


                {ProfesionalAEliminar.length > 0 && (
                    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

                            <h2 className="text-lg mb-4">Confirmar Eliminación</h2>
                            <p>
                                ¿Estás seguro de que deseas eliminar a
                                {ProfesionalAEliminar.length !== profesionales.length ? <strong>&nbsp;
                                    {ProfesionalAEliminar.map((profesional) => {
                                        return (profesional.nombre + " " + profesional.apellido)
                                    }).join(", ")}?
                                </strong> : <strong>&nbsp; todos los profesionales?</strong>
                                }
                            </p>
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    onClick={() => {
                                        handleEliminarProfesional(ProfesionalAEliminar);
                                    }}
                                    disabled={isDeleting}
                                    className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                                >
                                    {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                                </button>
                                <button
                                    onClick={() => setProfesionalAEliminar([])}
                                    disabled={isDeleting}
                                    className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Contenedor Principal */}
                <div className="relative mt-8 flex justify-center z-10">
                    <div className="border p-4 max-w-[96vh] w-11/12 sm:w-2/3 md:w-4/5 lg:w-2/3 h-[62vh] bg-slate-50  overflow-y-auto rounded-lg">
                        {/* Encabezado */}
                        <div className=" flex flex-col items-center z-10 p-2">
                            <h1 className="text-2xl sm:text-2xl bg-slate-50   uppercase">profesionales</h1>
                        </div>
                        <div className="flex flex-col space-y-4 bg-white">

                            <div className="relative overflow-x-auto  shadow-lg sm:rounded-lg">
                                <div className=" flex justify-around px-auto bg-white p-2">
                                    <div className="flex justify-around ">
                                        <button onClick={() => { setSelectedProfesional(-1); setObProfesional(null) }} className="px-2 w-10 h-10">
                                            <UserRoundPlus />
                                        </button>
                                        <button onClick={() => {allProfesionalesSelected.length > 0 ? setProfesionalAEliminar(allProfesionalesSelected) :""}} className=" w-10 px-2 h-10">
                                            <Trash2 />
                                        </button>
                                    </div>
                                    {/* Barra de búsqueda */}
                                    <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 ">
                                        <label htmlFor="table-search" className="sr-only">Buscar</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                </svg>
                                            </div>
                                            <input type="text"
                                                placeholder="Buscar..."
                                                value={profesionalAbuscar}
                                                onChange={handleSearchChange}
                                                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 "
                                            />
                                        </div>
                                    </div>

                                </div>
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100  ">
                                        <tr>
                                            <th scope="col" className="p-4">
                                                <div className="flex items-center">
                                                    <input
                                                        id="checkbox-all-search"
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setAllProfesionalesChecked(true);
                                                                setAllProfesionalesSelected(profesionales);

                                                            }
                                                            else {
                                                                setAllProfesionalesChecked(false);
                                                                setAllProfesionalesSelected([])
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Nombre
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Especialidad
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            profesionales.map((profesional, index) => (
                                                <tr className="bg-white border-b   hover:bg-gray-50 ">
                                                    <td className="w-4 p-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                id="checkbox-table-search-1"
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setAllProfesionalesSelected([...allProfesionalesSelected, profesional]);
                                                                    }
                                                                    else {
                                                                        setAllProfesionalesSelected(allProfesionalesSelected.filter((prof) => prof.id !== profesional.id));
                                                                    }
                                                                }}
                                                                checked={allProfesionalesSelected.some((prof) => prof.id === profesional.id) || allProfesionalesChecked}
                                                                type="checkbox"
                                                                className="w-4 h-4 text-blue-600  border-gray-300 rounded focus:ring-blue-500"
                                                            />

                                                        </div>
                                                    </td>
                                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                                                        <Image
                                                            src={imageUrls[profesional.id] || NoImage}
                                                            alt={`${profesional.nombre} ${profesional.apellido}`}
                                                            width={70}
                                                            height={90}
                                                            objectFit="cover"
                                                            className="w-20 h-25 rounded-full pointer-events-none"

                                                        />
                                                        <div className="ps-3 min-w-64 max-w-96">
                                                            <div className="text-base font-semibold">{profesional.nombre + " " + profesional.apellido}</div>
                                                            <div className="font-normal text-gray-500 ">{profesional.email}</div>
                                                        </div>
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {profesional.especialidad}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProfesional(profesional);
                                                                setObProfesional(profesional);
                                                            }}
                                                            className="font-medium text-blue-600 hover:underline"
                                                        >
                                                            Editar profesional
                                                        </button>

                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Modal */}
            </div>
            {selectedProfesional !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
                    <div ref={scrollRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative" style={{ height: '70vh', overflow: "auto" }}>
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedProfesional === -1 ? "Nuevo Profesional" : "Editar Profesional"}
                        </h2>
                        {errorMessage && (
                            <div className="mb-4 text-red-600">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="nombre" className="block">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                pattern="^[a-zA-Z\s]+$" // Solo permite letras y espacios
                                placeholder="Ingrese el nombre del profesional."
                                required
                                value={profesionalDetails.nombre}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                            <label htmlFor="apellido" className="block">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                pattern="^[a-zA-Z\s]+$" // Solo permite letras y espacios
                                placeholder="Ingrese el apellido del profesional."
                                required
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
                                placeholder="Ingrese el email del profesional."
                                required
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
                                placeholder="Ingrese la especialidad del profesional."
                                value={profesionalDetails.especialidad}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="telefono" className="block">Teléfono:</label>
                            <div className="flex">
                            <span className="p-2 bg-gray-200 rounded-l">+54</span>


                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                placeholder="Ingrese el teléfono del profesional."
                                pattern="^\d{8,12}$" // Solo permite números, entre 8 y 15 dígitos
                                title="El teléfono debe tener entre 8 y 12 números."
                                maxLength={12} // Limitar la longitud a 15 caracteres
                                value={profesionalDetails.telefono}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Filtra solo los números
                                    if (/^\d*$/.test(value)) {
                                        handleChange(e); // Actualiza el estado solo si es válido
                                    }
                                }}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                             
                                placeholder={(selectedProfesional === -1 || selectedProfesional === -2) ? "Ingrese una contaseña" : "Si desea cambiar la contraseña, ingresela aquí"}
                                value={profesionalDetails.password}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="imagen" className="block">
                                Imagen:
                            </label>
                            <input
                                type="file"
                                id="imagen"
                                name="imagen"
                                accept=".png, .jpg, .jpeg .avif"
                                onChange={onFileChange}
                                className="p-2 w-full border rounded"
                            />
                            {uploadError && <div style={{ color: "red" }}>{uploadError}</div>}
                        </div>
                        <div>
                            <Talleres crearEstado={selectedProfesional} user={obProfesional} cursosElegido={cursosElegido} setCursosElegido={setCursosElegido} />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={selectedProfesional === -1 ? handleCreateProfesional : handleSaveChanges}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader /> : "Guardar"}
                            </button>
                            <button
                                onClick={() => { setSelectedProfesional(null); handleCancel_init() }}
                                disabled={isSaving}
                                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );


    // #endregion
}
export default withAuth(Profesionales);