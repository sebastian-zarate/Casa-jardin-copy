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

;
import Talleres from "@/components/talleres/page";
import { createProfesional_Curso, deleteProfesional_Curso } from "@/services/profesional_curso";

import withAuth from "../../../components/Admin/adminAuth";

//para subir imagenes:
import { handleUploadProfesionalImage, handleDeleteProfesionalImage, mapearImagenes } from "@/helpers/repoImages";

import { validateApellido, validateDireccion, validateDni, validateEmail, validateNombre, validatePasswordComplexity, validatePhoneNumber } from "@/helpers/validaciones";
import { dniExists, emailExists } from "@/services/Alumno";
import Background from "../../../../public/Images/Background.jpeg"
import Loader from "@/components/Loaders/loadingSave/page";
import { Briefcase, Mail, Pencil, Phone, Plus, Search, Trash2,  } from "lucide-react";
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
          
            setProfesionales(data);
            setProfesionalesListaCompleta(data);
        } catch (error) {
            console.error("Imposible obetener Profesionales", error);
        }
    }
   

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
          
            const fileNameWithExtension = `${profesionalDetails.email}_${profesionalDetails.nombre}_${profesionalDetails.apellido}.${fileExtension}`;
        
            setProfesionalDetails({ ...profesionalDetails, imagen: fileNameWithExtension });
         
        }
    };

    // Método para obtener las imagenes
    const fetchImages = async () => {
        const result = await getImagesUser();
      
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
                else {
                    console.log("error");
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
    // elimiar un curso de la lista del profesional en la tabla intermedia
    async function handleDeleteCurso(profesional: any, curso: any) {
        try {
            await deleteProfesional_Curso(profesional.id, curso.id);
            fetchProfesionales();
        } catch (error) {
            console.error("Error al eliminar el curso", error);
        }
    }

    // #region Return
    return (
        <main className="relative bg-cover bg-center min-h-screen"
            style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <Navigate />

            {ProfesionalAEliminar.length === 1 && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

            <h2 className="text-lg mb-4">Confirmar Eliminación</h2>
            <p>
                ¿Estás seguro de que deseas eliminar al profesional {ProfesionalAEliminar[0]?.nombre + " " + ProfesionalAEliminar[0]?.apellido}?
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
                onClick={() => {
                setProfesionalAEliminar([]);
                setErrorMessage("");
                }}
                disabled={isDeleting}
                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                >
                Cancelar
                </button>
            </div>
            </div>
            </div>
            )}

            {/* Contenido Principal */}
            <div className="relative z-10">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">PROFESIONALES</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Gestiona los profesionales del sistema
                        </p>
                    </div>
                    <button 
                        onClick={() => { setSelectedProfesional(-1); setObProfesional(null) }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Nuevo Profesional</span>
                    </button>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={profesionalAbuscar}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-50 py-4 px-6 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="col-span-2">CÓDIGO</div>
                        <div className="col-span-3">NOMBRE</div>
                        <div className="col-span-5">CONTACTO</div>
                        <div className="col-span-2 text-center">ACCIÓN</div>
                    </div>

                    {profesionales.length === 0 ? (
                        <div className="py-12 px-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                                <Briefcase className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">No hay profesionales registrados</h3>
                            <p className="text-sm text-gray-500">
                                Comienza agregando un profesional
                            </p>
                        </div>
                    ) : (
                        profesionales
                            .sort((a, b) => a.id - b.id)
                            .map((profesional) => (
                                <div 
                                    key={profesional.id} 
                                    className="grid grid-cols-12 items-center py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="col-span-12 sm:col-span-2">
                                        <span className="text-sm font-medium text-gray-900">{profesional.id}</span>
                                    </div>
                                    <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={imageUrls[profesional.id] || NoImage}
                                                onError={(e) => { e.currentTarget.src = NoImage.src; }}
                                                alt={profesional.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {profesional.nombre} {profesional.apellido}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-12 sm:col-span-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {profesional.email}
                                            </span>
                                            {profesional.telefono && (
                                                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    +54 {profesional.telefono}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-12 sm:col-span-2 flex justify-center gap-2">
                                        <button 
                                            onClick={() => {
                                                setSelectedProfesional(profesional);
                                                setObProfesional(profesional);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                                            title="Editar profesional"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => setProfesionalAEliminar([profesional])}
                                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                            title="Eliminar profesional"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                    )}
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