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
    useEffect(() => {
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
    }, [obProfesional]);
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
                direccionId: selectedProfesional.direccionId || '',
            });
            setProfesionalDetailsCopia({
                id: selectedProfesional.id,
                nombre: selectedProfesional.nombre || '',
                apellido: selectedProfesional.apellido || '',
                email: selectedProfesional.email || '',
                password: '',
                telefono: selectedProfesional.telefono ? selectedProfesional.telefono : '',
                especialidad: selectedProfesional.especialidad || '',
                direccionId: selectedProfesional.direccionId || '',
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
        return direccion
    }


    //region solo considera repetidos
    async function createUbicacion() {
        // Obtener la localidad asociada a la dirección
        console.log("Antes de crear la ubicacion", (localidadName), calle, numero, provinciaName, nacionalidadName);
        const nacionalidad = await addPais({ nombre: String(nacionalidadName) });
        const prov = await addProvincias({ nombre: String(provinciaName), nacionalidadId: Number(nacionalidad?.id) });

        const localidad = await addLocalidad({ nombre: String(localidadName), provinciaId: Number(prov?.id) });
        console.log("LOCALIDAD", localidad);
        const direccion = await addDireccion({ calle: String(calle), numero: Number(numero), localidadId: Number(localidad?.id) });
        console.log("DIRECCION", direccion);
        return direccion;
    }
    // #region Métodos

    function setVariablesState() {
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
            if (password && password.length > 0) {
                resultValidate = validatePasswordComplexity(password);
                if (resultValidate) return resultValidate;
            }

        }
        resultValidate = validateDireccion(nacionalidadName, provinciaName, localidadName, String(calle), Number(numero));
        if (resultValidate) return resultValidate

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
        if (!obProfesional.direccionId) {
            const dir = await createUbicacion();
            const newProfesional = await updateProfesional(obProfesional?.id || 0, {
                nombre: profesionalDetails.nombre, apellido: profesionalDetails.apellido,
                especialidad: String(profesionalDetails.especialidad), email: String(profesionalDetails.email),
                telefono: (profesionalDetails.telefono), password: String(profesionalDetails.password),
                direccionId: Number(dir?.id)
            });
            if (typeof newProfesional === "string") return setErrorMessage(newProfesional);

            for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                await createProfesional_Curso({ cursoId: curso.id, profesionalId: newProfesional.id });
                //if (typeof prof_cur === "string") return setErrorMessage(prof_cur);
                //console.log(prof_cur)
            }
            setVariablesState();
            return;
        }
        const direcciProf = await getUbicacion(obProfesional);
        try {
            const newDireccion = await updateDireccionById(Number(direcciProf?.id), {
                calle: String(calle),
                numero: Number(numero),
                localidadId: Number(direcciProf?.localidad.id)
            });
            console.log("newDireccion", newDireccion);
            const newLocalidad = await updateLocalidad(Number(direcciProf?.localidad?.id), {
                nombre: String(localidadName),
                provinciaId: Number(direcciProf?.localidad.provincia.id)
            });
            console.log("newLocalidad", newLocalidad);
            await updateProvinciaById(Number(direcciProf?.localidad.provincia?.id), {
                nombre: String(provinciaName),
                nacionalidadId: Number(direcciProf?.localidad.provincia.nacionalidad.id)
            });


            const newProfesional = await updateProfesional(obProfesional?.id || 0, {
                nombre: profesionalDetails.nombre, apellido: profesionalDetails.apellido,
                especialidad: String(profesionalDetails.especialidad), email: String(profesionalDetails.email),
                telefono: String(profesionalDetails.telefono), password: String(profesionalDetails.password),
                direccionId: Number(direcciProf?.id), imagen: profesionalDetails.imagen
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
        } catch (error) {
            console.error("Error al actualizar el profesional", error);
        }
    }

    async function handleEliminarProfesional(profesional: any) {
        try {
            //borrar profesional del repo
            await deleteProfesional(profesional.id);
            //borarr imagen del repo
            if (profesional.imagen) await handleDeleteProfesionalImage(profesional.imagen);
            fetchProfesionales();
        } catch (error) {
            console.error("Error al eliminar el profesional", error);
        }
    }

    async function handleCreateProfesional() {
        const validationError = await validateProfesional();
        const direccion = await createUbicacion();
        console.log("newDireccion", direccion);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        try {

            //acualizo los datos de la direccion del alumno, el hash de la contra se hace en el servicio
            const newProfesional = await createProfesional({
                nombre: profesionalDetails.nombre, apellido: profesionalDetails.apellido,
                especialidad: String(profesionalDetails.especialidad), email: String(profesionalDetails.email),
                telefono: String(profesionalDetails.telefono), password: String(profesionalDetails.password),
                direccionId: Number(direccion?.id), imagen: profesionalDetails.imagen
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


        } catch (error) {
            setErrorMessage("Error al crear el profesional:");
        }
    }
    async function handleCancel_init() {
        setNacionalidadName("");
        setProvinciaName("");
        setLocalidadName("");
        setcalle("");
        setCursosElegido([]);
        setNumero(0);
        setObProfesional(null);
    }
    function getCursosElegidos(profesionalId: number) {
        const cursos = cursosElegido.find((curso) => curso.id === profesionalId);
        // console.log("Cursos", cursos);
        return cursos?.cursos;

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
        <main className="relative min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Navigate />
            <div className="relative min-h-screen w-full">
                {/* Background */}
                <div className="fixed inset-0 z-[-1]">
                    <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
                </div>

                {/* Encabezado */}
                <div className="relative mt-4 pt-8 flex flex-col items-center z-10">
                    <h1 className="text-2xl sm:text-3xl bg-white rounded-lg p-2 shadow-lg">PROFESIONALES</h1>
                </div>

                {/* Barra de búsqueda */}
                <div className="relative mt-4 flex justify-center z-10">
                    <div className="relative w-11/12 sm:w-1/4">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="p-2 border rounded w-full"
                            value={profesionalAbuscar}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {/* Contenedor Principal */}
                <div className="relative mt-8 flex justify-center z-10">
                    <div className="border p-4 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 h-[60vh] bg-gray-400 bg-opacity-50 overflow-y-auto rounded-lg">
                        <div className="flex flex-col space-y-4">
                            {profesionales.map((profesional, index) => (
                                <div
                                    key={index}
                                    className="border p-4 relative bg-white w-full flex flex-col justify-center items-center rounded shadow-md"
                                >
                                    <div className="relative w-full h-40">
                                        <Image
                                            src={imageUrls[profesional.id] || NoImage}
                                            alt={`${profesional.nombre} ${profesional.apellido}`}
                                            objectFit="cover"
                                            layout="fill"
                                            className="pointer-events-none"
                                        />
                                        <button
                                            onClick={() => handleEliminarProfesional(profesional)}
                                            className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                                        >
                                            <Image src={DeleteIcon} alt="Eliminar" width={20} height={20} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedProfesional(profesional);
                                                setObProfesional(profesional);
                                            }}
                                            className="absolute top-2 right-10 bg-yellow-400 rounded-full p-1"
                                        >
                                            <Image src={EditIcon} alt="Editar" width={20} height={20} />
                                        </button>
                                    </div>
                                    <h3 className="mt-2 text-black">{profesional.nombre} {profesional.apellido}</h3>
                                    <p className="text-sm text-gray-600">Email: {profesional.email}</p>
                                </div>
                            ))}
                            <button onClick={() => { setSelectedProfesional(-1); setObProfesional(null) }} className="mt-6 mx-4">
                                <Image
                                    src={ButtonAdd}
                                    className="mx-3"
                                    alt="Image Alt Text"
                                    width={70}
                                    height={70}
                                />
                            </button>
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
                            <div className="flex">
                                <h3 className="p-2">+54</h3>
                                <input
                                    type="number"
                                    id="telefono"
                                    name="telefono"
                                    placeholder="Ingrese su código de área y los dígitos de su teléfono"
                                    value={profesionalDetails.telefono ? profesionalDetails.telefono : null}
                                    onChange={handleChange}
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
                                placeholder={(selectedProfesional === -1 || selectedProfesional === -2) ? "" : "Si desea cambiar la contraseña, ingresela aquí"}
                                value={profesionalDetails.password}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        {((!nacionalidadName && !provinciaName && !localidadName && !calle && !numero && selectedProfesional !== -1) && obProfesional.direccionID) && <p className=" text-red-600">Cargando su ubicación...</p>}
                        <>
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
                        </>
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
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => { setSelectedProfesional(null); handleCancel_init() }}
                                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                            >
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