"use client";
// #region Imports
import React, { use, useEffect, useRef, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { Alumno, createAlumno, createAlumnoAdmin, deleteAlumno, dniExists, emailExists, getAlumnos, updateAlumno } from "../../../services/Alumno";
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
import { createResponsable, deleteResponsable, deleteResponsableByAlumnoId, getAllResponsables, getDireccionResponsableByAlumnoId, updateResponsable } from "@/services/responsable";
import { validateApellido, validateDireccion, validateDni, validateEmail, validateFechaNacimiento, validateNombre, validatePasswordComplexity, validatePhoneNumber, validateNombreRespon } from "@/helpers/validaciones";
import Loader from "@/components/Loaders/loadingSave/page";
import { Mail, Pencil, Phone, Plus, Search, Trash2, UserRoundPlus, UserRoundX, Users, } from "lucide-react";
// #endregion

// Function to check if a person is an adult based on their birth date
const isAdult = (birthDate: string): boolean => {
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return age >= 18;
};

const Alumnos: React.FC = () => {
    // #region UseStates
    const [alumnos, setAlumnos] = useState<any[]>([]);
    const [alumnosBuscados, setAlumnosBuscados] = useState<Alumno[]>([]);
    const [alumnosMostrados, setAlumnosMostrados] = useState<any[]>([]);
    const [alumnoAbuscar, setAlumnoAbuscar] = useState<string>("");
    const [habilitarAlumnosBuscados, setHabilitarAlumnosBuscados] = useState<boolean>(true);
    const [selectedAlumno, setSelectedAlumno] = useState<any>(null);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<any>(null);

    const [obAlumno, setObAlumno] = useState<any>(null);

    const [alumnoDetails, setAlumnoDetails] = useState<any>({
        id: null,
        nombre: "",
        apellido: "",
        dni: null,
        telefono: null,
        email: "",
        password: "",
        fechaNacimiento: new Date(),
        direccionId: null
    });
    const [alumnoDetailsCopia, setAlumnoDetailsCopia] = useState<any>({
        id: null,
        nombre: "",
        apellido: "",
        dni: null,
        telefono: null,
        email: "",
        password: "",
        fechaNacimiento: new Date(),
        direccionId: null
    });
    const [responsableDetails, setResponsableDetails] = useState<any>({
        id: null,
        nombre: "",
        apellido: "",
        dni: null,
        telefono: null,
        email: "",
        alumnoId: null,
        direccionId: null
    });
    const [responsableDetailsCopia, setResponsableDetailsCopia] = useState<any>({
        id: null,
        nombre: "",
        apellido: "",
        dni: null,
        telefono: null,
        email: "",
        alumnoId: null,
        direccionId: null
    });
    const [responsables, setResponsables] = useState<any[]>([]);
    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");
    //Estado para almacenar las imagenes
    const [images, setImages] = useState<any[]>([]);

    //useState para almacenar la dirección alumno
    const [nacionalidadNameResp, setNacionalidadNameResp] = useState<string>();
    // Estado para almacenar el ID de la provincia, inicialmente nulo
    const [provinciaNameResp, setProvinciaNameResp] = useState<string>();

    // Estado para almacenar el ID de la localidad, inicialmente nulo
    const [localidadNameResp, setLocalidadNameResp] = useState<string>();

    // Estado para almacenar la calle, inicialmente nulo
    const [calleResp, setcalleResp] = useState<string | null>(null);

    // Estado para almacenar el número de la dirección, inicialmente nulo
    const [numeroResp, setNumeroResp] = useState<number | null>(null);

    //useState para almacenar la dirección alumno
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
    const [loadingDireccion, setLoadingDireccion] = useState<boolean>(true);
    const [permitirDireccion, setPermitirDireccion] = useState<boolean>(false);

    const [loadingDireccionResp, setLoadingDireccionResp] = useState<boolean>(true);
    const [permitirDireccionResp, setPermitirDireccionResp] = useState<boolean>(false);
    //decidir si el alumno elegido es mayor o menor
    const [mayor, setMayor] = useState<boolean>(false);
    const [AlumnoAEliminar, setAlumnoAEliminar] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [allAlumnosChecked, setAllAlumnosChecked] = useState<boolean>(false);
    const [allAlumnosSelected, setAllAlumnosSelected] = useState<any[]>([]);
    // #endregion

    // #region UseEffects
    //useEffect para obtener los alumnos
    useEffect(() => {
        fetchAlumnos();
        fetchImages();
        handleCancel_init();
    }, []);

    useEffect(() => {
        if (errorMessage !== "") {
            setInterval(() => {
                setErrorMessage("")
            }, 5000);
        }
    }, [errorMessage])


    useEffect(() => {
        if (obAlumno) {
            /*             console.log("permitirDireccion", permitirDireccion);
                        console.log("loadingDireccion", loadingDireccion); */
            if ((!nacionalidadName && !provinciaName && !localidadName && !calle && !numero && (selectedAlumno !== -1 || selectedAlumno !== -2) && obAlumno?.direccionId) && permitirDireccion) {
                console.log("obAlumno111", obAlumno);
                getUbicacion(obAlumno);
            }
            if ((!nacionalidadNameResp && !provinciaNameResp && !localidadNameResp && !calleResp && !numeroResp && (selectedAlumno !== -1 || selectedAlumno !== -2)) && permitirDireccionResp) {
                console.log("obAlumno", obAlumno);
                getUbicacionResp(obAlumno);
            }
        }

        if (!obAlumno) {
            setNacionalidadName("");
            setProvinciaName("");
            setLocalidadName("");
            setcalle("");
            setNumero(null);
            setNacionalidadNameResp("");
            setProvinciaNameResp("");
            setLocalidadNameResp("");
            setcalleResp("");
            setNumeroResp(null);
            setLoadingDireccion(false)
            setLoadingDireccionResp(false)
        }
        console.log("obAlumno", obAlumno);
    }, [obAlumno, permitirDireccion, permitirDireccionResp]);
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
                password: "",
                fechaNacimiento: selectedAlumno.fechaNacimiento && new Date(selectedAlumno.fechaNacimiento).toISOString().split('T')[0]
            });
            setAlumnoDetailsCopia({
                id: selectedAlumno.id,
                nombre: selectedAlumno.nombre,
                apellido: selectedAlumno.apellido,
                dni: selectedAlumno.dni,
                telefono: selectedAlumno.telefono,
                direccionId: selectedAlumno.direccionId,
                email: selectedAlumno.email,
                password: "",
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
                        dni: responsableALum[0]?.dni || null,
                        telefono: responsableALum[0]?.telefono || null,
                        email: responsableALum[0]?.email || "",
                        alumnoId: selectedAlumno.id,
                        direccionId: responsableALum[0]?.direccionId || null
                    });
                    setResponsableDetailsCopia({
                        nombre: responsableALum[0]?.nombre || "",
                        apellido: responsableALum[0]?.apellido || "",
                        dni: responsableALum[0]?.dni || null,
                        telefono: responsableALum[0]?.telefono || null,
                        email: responsableALum[0]?.email || "",
                        alumnoId: selectedAlumno.id,
                        direccionId: responsableALum[0]?.direccionId || null
                    });
                } else setMayor(true);
            }
        } else {
            setAlumnoDetails({
                nombre: "",
                apellido: "",
                dni: null,
                telefono: null,
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

        const nacionalidad = await addPais({ nombre: String(nacionalidadName) });
        const prov = await addProvincias({ nombre: String(provinciaName), nacionalidadId: Number(nacionalidad?.id) });

        const localidad = await addLocalidad({ nombre: String(localidadName), provinciaId: Number(prov?.id) });
        //console.log("LOCALIDAD", localidad);
        const direccion = await addDireccion({ calle: String(calle), numero: Number(numero), localidadId: Number(localidad?.id) });
        //console.log("DIRECCION", direccion);

        const nacionalidadResp = await addPais({ nombre: String(nacionalidadNameResp) });
        const provResp = await addProvincias({ nombre: String(provinciaNameResp), nacionalidadId: Number(nacionalidadResp?.id) });
        const localidadResp = await addLocalidad({ nombre: String(localidadNameResp), provinciaId: Number(provResp?.id) });
        const direccionResp = await addDireccion({ calle: String(calleResp), numero: Number(numeroResp), localidadId: Number(localidadResp?.id) });
        return { direccion, direccionResp };
    }

    async function getUbicacion(userUpdate: any) {
        // Obtener la dirección del usuario por su ID

        setLoadingDireccion(true);
        const direccion = await getDireccionCompleta(userUpdate?.direccionId);

        // Actualizar los estados con los datos obtenidos
        setLocalidadName(String(direccion?.localidad?.nombre));
        setProvinciaName(String(direccion?.localidad?.provincia?.nombre));
        setNacionalidadName(String(direccion?.localidad?.provincia?.nacionalidad?.nombre));
        setNumero(Number(direccion?.numero));
        setcalle(String(direccion?.calle));
        setLoadingDireccion(false);

        return direccion;
    }
    async function getUbicacionResp(userUpdate: any) {
        setLoadingDireccionResp(true);
        const direccionResponsable = await getDireccionResponsableByAlumnoId(userUpdate?.id);
        setLocalidadNameResp(String(direccionResponsable?.direccion?.localidad?.nombre));
        setProvinciaNameResp(String(direccionResponsable?.direccion?.localidad?.provincia?.nombre));
        setNacionalidadNameResp(String(direccionResponsable?.direccion?.localidad?.provincia?.nacionalidad?.nombre));
        setNumeroResp(Number(direccionResponsable?.direccion?.numero));
        setcalleResp(String(direccionResponsable?.direccion?.calle));
        setLoadingDireccionResp(false);
        return direccionResponsable
    }

    //region validate
    async function validatealumnoDetails() {
        const { nombre, apellido, password, email, telefono, dni } = alumnoDetails || {};
        const { nombre: nombreR, apellido: apellidoR, email: EmailR,
            dni: dniR, telefono: telefonoR } = responsableDetails || {};

        //validar que el nombre sea de al menos 2 caracteres y no contenga números
        let resultValidate;
        if (alumnoDetails) {
            resultValidate = validateNombre(nombre);
            if (resultValidate) return resultValidate;

            resultValidate = validateApellido(apellido);
            if (resultValidate) return resultValidate;

            resultValidate = validateEmail(email);
            if (resultValidate) return resultValidate;
            if (email !== alumnoDetailsCopia.email) {
                const estado = await emailExists(email)
                if (estado) {
                    return "El email ya está registrado.";
                }
                if (resultValidate) return resultValidate;
            }


            if (dni) {
                resultValidate = validateDni(String(dni));
                if (resultValidate) return resultValidate;
                if (dni !== alumnoDetailsCopia.dni) {
                    const estado = await dniExists(Number(dni))
                    if (estado) {
                        return "El dni ya está registrado.";
                    }
                }
            }
            resultValidate = validateFechaNacimiento(alumnoDetails.fechaNacimiento);
            if (resultValidate) return resultValidate;

            if (mayor && telefono && typeof (telefono) === "number") {
                resultValidate = validatePhoneNumber(String(telefono));
                if (resultValidate) return resultValidate;
            }


            if (selectedAlumno === -1 || selectedAlumno === -1 || password.length > 0) {
                resultValidate = validatePasswordComplexity(password);
                if (resultValidate) return resultValidate;
            }

        }
        if (permitirDireccion) {
            resultValidate = validateDireccion(nacionalidadName, provinciaName, localidadName, String(calle), Number(numero));
            if (resultValidate) return resultValidate
        }

        if (responsableDetails && mayor === false && selectedAlumno === -1 && selectedAlumno === -4) {
            resultValidate = validateNombreRespon(nombreR, apellidoR);
            if (resultValidate) return resultValidate;

            resultValidate = validateEmail(EmailR);
            if (resultValidate) return resultValidate;
            if (EmailR !== responsableDetailsCopia.email) {
            const estado = await emailExists(EmailR)
            if (estado) {
                return "El email del responsable ya está registrado.";
            }
            }
            if (permitirDireccionResp) {
            resultValidate = validateDireccion(nacionalidadNameResp, provinciaNameResp, localidadNameResp, String(calleResp), Number(numeroResp));
            if (resultValidate) return resultValidate
            }
            //el Dni no puede estar vacio
            resultValidate = validateDni(String(dniR));
            if (resultValidate) return resultValidate;
            if (dniR !== responsableDetailsCopia.dni) {
            const estado = await dniExists(dniR)
            if (estado) {
                return "El dni del responsable ya está registrado.";
            }
            }
            //el teléfono puede estar vacio
            if (telefonoR && typeof (telefonoR) === "number") {
            resultValidate = validatePhoneNumber(String(telefonoR));
            if (resultValidate) return resultValidate;
            }
        }
        // if (!/\d/.test(fechaNacimiento)) return ("La fecha de nacimiento es obligatoria");
    }
    // Función para manejar los cambios en los campos del formulario
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setAlumnoDetails((prevDetails: any) => ({
            ...prevDetails,
            [name]: value // Convierte `telefono` a número entero si el campo es `telefono` y maneja `fechaNacimiento`

        }));
        // console.log("FECHA", name, value);
    }
    function handleChangeResponsable(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setResponsableDetails((prevDetails: any) => ({
            ...prevDetails,
            [name]: value // Convierte `telefono` a número entero si el campo es `telefono`
        }));
    }
    function setVariablesState() {
        setNacionalidadName("");
        setProvinciaName("");
        setLocalidadName("");
        setcalle("");
        setNumero(null);
        setObAlumno(null);
        setSelectedAlumno(null);
        setCursosElegido([]);
        fetchAlumnos();
        setErrorMessage("");
    }
    async function handleSaveChanges() {
        setIsSaving(true);
        const validationError = await validatealumnoDetails();
        console.log(alumnoDetails);
        console.log(" no psas");

        if (validationError) {

            setErrorMessage(validationError);
            setIsSaving(false);
            return;
        }
        setPermitirDireccion(false);

        //-----------------------------------SI EL USUARIO DESEA CAMBIAR LA DIRECCIÓN---------------------------------------------------------
        if (permitirDireccion) {

            //region NO direcc CARGADA 
            if (!obAlumno.direccionId) {
                const { direccion, direccionResp } = await createUbicacion();
                //---------------------------------------------------------------SI ES MENOR-------------------------------------------------------------------------------------------
                if (mayor === false) {

                    const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                        nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                        dni: (alumnoDetails.dni), email: alumnoDetails.email,
                        direccionId: (direccion?.id), fechaNacimiento: new Date(alumnoDetails.fechaNacimiento),
                        password: alumnoDetails.password
                    });
                    if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                    if (permitirDireccionResp) {
                        await updateResponsable(alumnoDetails?.id || 0, {
                            nombre: responsableDetails.nombre, apellido: responsableDetails.apellido,
                            dni: (responsableDetails.dni), email: responsableDetails.email, telefono: (responsableDetails.telefono ? String(responsableDetails.telefono) : responsableDetails.telefono),
                            alumnoId: newAlumno.id, direccionId: (direccionResp?.id)
                        });
                    }
                    else if (!permitirDireccionResp) {
                        await updateResponsable(alumnoDetails?.id || 0, {
                            nombre: responsableDetails.nombre, apellido: responsableDetails.apellido,
                            dni: (responsableDetails.dni), email: responsableDetails.email, telefono: (responsableDetails.telefono ? String(responsableDetails.telefono) : responsableDetails.telefono),
                            alumnoId: newAlumno.id
                        });
                    }

                    for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                        await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                    }

                    setVariablesState();
                    setIsSaving(false);
                    return;
                }
                //-----------------------------------------------------------SI ES MAYOR---------------------------------------------------------------------------------------------------
                //console.log("ALUMNODETAILS", alumnoDetails);
                const telefonoExists = alumnos.some(alumno => alumno.telefono === String(alumnoDetails.telefono) && alumno.id !== alumnoDetails.id);
                if (telefonoExists) {
                    setErrorMessage("El teléfono ya está registrado.");
                    setIsSaving(false);
                    return;
                }
                const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                    nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                    dni: (alumnoDetails.dni), email: alumnoDetails.email, telefono: (alumnoDetails.telefono ? String(alumnoDetails.telefono) : alumnoDetails.telefono),
                    direccionId: (direccion?.id), fechaNacimiento: new Date(alumnoDetails.fechaNacimiento),
                    password: alumnoDetails.password
                });
                if (typeof newAlumno === "string") return setErrorMessage(newAlumno);

                for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                    await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                }

                setVariablesState();
                setIsSaving(false);
                return;
            }
            //region si direcc CARGADA
            else if (obAlumno.direccionId) {
                const direccion = await getUbicacion(obAlumno);
                const direccionResponsable = await getUbicacionResp(obAlumno);
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
                    //---------------------------------------------------------------SI ES MENOR-------------------------------------------------------------------------------------------
                    if (mayor === false) {
                      
                        const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                            nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                            dni: (alumnoDetails.dni), email: alumnoDetails.email,
                            direccionId: (direccion?.id), fechaNacimiento: new Date(alumnoDetails.fechaNacimiento), password: alumnoDetails.password
                        });
                        if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                        if (permitirDireccionResp) {
                            await updateResponsable(alumnoDetails?.id || 0, {
                                nombre: responsableDetails.nombre, apellido: responsableDetails.apellido,
                                dni: (responsableDetails.dni), email: responsableDetails.email, telefono: (alumnoDetails.telefono ? String(alumnoDetails.telefono) : alumnoDetails.telefono),
                                alumnoId: newAlumno.id, direccionId: (direccionResponsable?.id)
                            });
                        }
                        else if (!permitirDireccionResp) {
                            await updateResponsable(alumnoDetails?.id || 0, {
                                nombre: responsableDetails.nombre, apellido: responsableDetails.apellido,
                                dni: (responsableDetails.dni), email: responsableDetails.email, telefono: (responsableDetails.telefono ? String(responsableDetails.telefono) : responsableDetails.telefono),
                                alumnoId: newAlumno.id
                            });
                        }
                        if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                        for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                            await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                        }
                        setVariablesState();
                        setIsSaving(false);
                        return;
                    }
                    //console.log("ALUMNODETAILS", alumnoDetails);

                    //---------------------------------------------------------------SI ES MAYOR-------------------------------------------------------------------------------------------
                    const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                        nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                        dni: (alumnoDetails.dni), telefono: (alumnoDetails.telefono ? String(alumnoDetails.telefono) : alumnoDetails.telefono),
                        direccionId: (newDireccion?.id), email: alumnoDetails.email, fechaNacimiento: new Date(alumnoDetails.fechaNacimiento),
                        password: alumnoDetails.password
                    });
                    if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                    for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                        await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                    }

                    setVariablesState();
                    setIsSaving(false);
                } catch (error) {
                    console.error("Error al actualizar el profesional", error);
                }
            }
        }
        //-----------------------------------SI EL USUARIO NO DESEA CAMBIAR LA DIRECCIÓN---------------------------------------------------------
        else if (!permitirDireccion) {
            //si es menor
            if (mayor === false) {
                //console.log("fecha 1", new Date(alumnoDetails.fechaNacimiento));
                // console.log("fecha 2", (alumnoDetails.fechaNacimiento));
                const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                    nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                    dni: (alumnoDetails.dni), email: alumnoDetails.email,
                    fechaNacimiento: new Date(alumnoDetails.fechaNacimiento),
                    password: alumnoDetails.password
                });
                if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                await updateResponsable(alumnoDetails?.id || 0, {
                    nombre: responsableDetails.nombre, apellido: responsableDetails.apellido,
                    dni: (responsableDetails.dni), email: responsableDetails.email, telefono: (alumnoDetails.telefono ? String(alumnoDetails.telefono) : alumnoDetails.telefono),
                    alumnoId: newAlumno.id
                });
                if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                    await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                }

                setVariablesState();
                setIsSaving(false);
                return;
            }
            if (mayor === true) {
                //console.log("ALUMNODETAILS", alumnoDetails);
                const newAlumno = await updateAlumno(alumnoDetails?.id || 0, {
                    nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                    dni: (alumnoDetails.dni), email: alumnoDetails.email, telefono: (alumnoDetails.telefono ? String(alumnoDetails.telefono) : alumnoDetails.telefono),
                    fechaNacimiento: new Date(alumnoDetails.fechaNacimiento),
                    password: alumnoDetails.password
                });
                if (typeof newAlumno === "string") return setErrorMessage(newAlumno);

                for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                    await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                }

                setVariablesState();
                setIsSaving(false);
                return;
            }
        }
        setIsSaving(false);
    }
    async function handleCreateAlumno() {

        const validationError = await validatealumnoDetails();
        // console.log("newDireccion", direccion);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        setIsSaving(true);
        //region si agrega direcc
        if (permitirDireccion) {
            const { direccion, direccionResp } = await createUbicacion();
            //se agrega al telefono el código de país

            try {
                //---------------------------------------------------------------SI ES MAYOR-------------------------------------------------------------------------------------------
                if (selectedAlumno == -1) {
                    //se crea el alumno, si ya existe se lo actualiza pero sin cambiar la contraseña y el email.
                    const newAlumno = await createAlumnoAdmin({
                        nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                        dni: Number(alumnoDetails.dni), email: alumnoDetails.email, telefono: String(alumnoDetails.telefono),
                        direccionId: Number(direccion?.id), password: alumnoDetails.password, rolId: 2,     //rol 2 es alumno
                        fechaNacimiento: new Date(alumnoDetails.fechaNacimiento)
                    });
                    console.log("newAlumno", newAlumno);
                    if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                    for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                        await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                        //console.log(prof_cur)
                    }

                    setVariablesState();
                }
                //---------------------------------------------------------------SI ES MENOR-------------------------------------------------------------------------------------------
                if (selectedAlumno === -2) {

                    const newAlumno = await createAlumnoAdmin({
                        nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                        dni: Number(alumnoDetails.dni), email: alumnoDetails.email,
                        direccionId: Number(direccion?.id), password: alumnoDetails.password, rolId: 2,     //rol 2 es alumno
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
                        dni: Number(responsableDetails.dni), email: responsableDetails.email, telefono: String(alumnoDetails.telefono),
                        alumnoId: newAlumno.id, direccionId: Number(direccionResp?.id)
                    });
                    setVariablesState();
                }

            } catch (error) {
                console.error("Error al crear el alumno", error);
            }
        }
        //region no agrega direcc
        else if (!permitirDireccion) {
            try {
                //---------------------------------------------------------------SI ES MAYOR-------------------------------------------------------------------------------------------
                if (selectedAlumno == -1) {
                    //se crea el alumno, si ya existe se lo actualiza pero sin cambiar la contraseña y el email.
                    const newAlumno = await createAlumnoAdmin({
                        nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                        dni: Number(alumnoDetails.dni), email: alumnoDetails.email, telefono: String(alumnoDetails.telefono),
                        password: alumnoDetails.password, rolId: 2,     //rol 2 es alumno
                        fechaNacimiento: new Date(alumnoDetails.fechaNacimiento)
                    });
                    console.log("newAlumno", newAlumno);
                    if (typeof newAlumno === "string") return setErrorMessage(newAlumno);
                    for (const curso of cursosElegido) {                                  //recorre los cursos elegidos y los guarda en la tabla intermedia
                        await createAlumno_Curso({ cursoId: curso.id, alumnoId: newAlumno.id });
                        //console.log(prof_cur)
                    }
                    setIsSaving(false);
                    setVariablesState();
                }
                //---------------------------------------------------------------SI ES MENOR-------------------------------------------------------------------------------------------
                if (selectedAlumno === -2) {

                    const newAlumno = await createAlumnoAdmin({
                        nombre: alumnoDetails.nombre, apellido: alumnoDetails.apellido,
                        dni: Number(alumnoDetails.dni), email: alumnoDetails.email,
                        password: alumnoDetails.password, rolId: 2,     //rol 2 es alumno
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
                        dni: Number(responsableDetails.dni), email: responsableDetails.email, telefono: String(alumnoDetails.telefono),
                        alumnoId: newAlumno.id
                    });
                    setIsSaving(false);
                    setVariablesState();
                }

            } catch (error) {
                console.error("Error al crear el alumno", error);
            }
        }
    }
    async function handleEliminarAlumno(id: any) {
        setIsDeleting(true);
        console.log(id);
        //elimino el responsable si el alumno es menor
        if (mayor === false) {
            console.log("responsable", responsableDetails);

            const responsable = await deleteResponsableByAlumnoId(id);
            console.log("responsable borrado", responsable);
        }
        const alumnoBorrado = await deleteAlumno(id);
        console.log("alumno borrado", alumnoBorrado);
        fetchAlumnos();
        setAlumnoAEliminar(null);
        setIsDeleting(false);
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
        setPermitirDireccion(false);
        setPermitirDireccionResp(false);
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
        setAlumnosBuscados(filteredAlumnos);
        setAlumnoAbuscar(e.target.value);
        setAlumnos(filteredAlumnos);
    };



    // #region Return
    return (
        <main
            className="relative bg-cover bg-center"
            style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <Navigate />

            {AlumnoAEliminar && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

                <h2 className="text-lg mb-4">Confirmar Eliminación</h2>
                <p>
                    ¿Estás seguro de que deseas eliminar a:{" "}
                    <strong>{AlumnoAEliminar.nombre}</strong>?
                </p>
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                    onClick={() => {
                        handleEliminarAlumno(AlumnoAEliminar.id);
                    }}
                    disabled={isDeleting}
                    className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                    >
                    {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                    </button>
                    <button
                    onClick={() => setAlumnoAEliminar(null)}
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
        {/* Título y Descripción */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Alumnos</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Gestiona los alumnos del sistema
                </p>
            </div>
            {/* Botones */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={() => setSelectedAlumno(-2)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo alumno menor</span>
                </button>
                <button
                    onClick={() => setSelectedAlumno(-1)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo alumno mayor</span>
                </button>
            </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por nombre.."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={alumnoAbuscar}
                    onChange={handleSearchChange}
                />
            </div>
        </div>

        {/* Tabla de Alumnos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-12 bg-gray-50 py-4 px-6 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="hidden sm:block col-span-2">CÓDIGO</div>
                <div className="col-span-4">NOMBRE</div>
                <div className="col-span-3">CONTACTO</div>
                <div className="hidden sm:block col-span-2">MAYORÍA DE EDAD</div>
                <div className="col-span-1 text-center">ACCIÓN</div>
            </div>

            {alumnos.length === 0 ? (
                <div className="py-12 px-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                        <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No hay alumnos registrados</h3>
                    <p className="text-sm text-gray-500">
                        Comienza agregando un alumno
                    </p>
                </div>
            ) : (
                alumnos.sort((a, b) => a.id - b.id).map((alumno) => (
                    <div
                        key={alumno.id}
                        className="grid grid-cols-1 sm:grid-cols-12 items-center py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        <div className="col-span-1 sm:col-span-2">
                            <span className="text-sm font-medium text-gray-900">{alumno.id}</span>
                        </div>
                        <div className="col-span-1 sm:col-span-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div>
                                <h3 className="font-medium text-gray-900">{alumno.nombre} {alumno.apellido}</h3>
                                <p className="text-sm text-gray-500">DNI: {alumno.dni}</p>
                            </div>
                        </div>
                        <div className="col-span-1 sm:col-span-3">
                            <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {alumno.email}
                                </span>
                                {alumno.telefono && (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        +54 {alumno.telefono}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="hidden sm:block col-span-2">
                            {new Date().getFullYear() - new Date(alumno.fechaNacimiento).getFullYear() >= 18 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                                    <Users className="w-4 h-4" />
                                    Mayor
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-amber-50 text-amber-700 rounded-full">
                                    <Users className="w-4 h-4" />
                                    Menor
                                </span>
                            )}
                        </div>
                        <div className="col-span-1 flex justify-center gap-2">
                            <button
                                onClick={() => {
                                    // Calcular si el alumno es mayor de edad
                                    const isAdultValue = isAdult(alumno.fechaNacimiento);

                                    // Establecer el alumno seleccionado (para edición o nuevo)
                                    if (isAdultValue) setAlumnoSeleccionado(-3);
                                    else if (!isAdultValue) setAlumnoSeleccionado(-4);
                                    setSelectedAlumno( alumno);
                                    setObAlumno(alumno);
                                    setMayor(isAdultValue);

                                    // Formatear la fecha de nacimiento del alumno
                                    const formattedDate = alumno.fechaNacimiento
                                        ? new Date(alumno.fechaNacimiento).toISOString().split('T')[0]
                                        : "";

                                    // Configurar los detalles del alumno seleccionado
                                    const alumnoDetails = {
                                        id: alumno.id,
                                        nombre: alumno.nombre,
                                        apellido: alumno.apellido,
                                        email: alumno.email,
                                        dni: alumno.dni,
                                        telefono: alumno.telefono,
                                        fechaNacimiento: formattedDate,
                                        password: "",
                                    };


                                    // Establecer los detalles en el estado
                                    setAlumnoDetails(alumnoDetails);

                                    // Crear una copia de los detalles para futuras referencias
                                    setAlumnoDetailsCopia({ ...alumnoDetails });
                                }}
                                className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setAlumnoAEliminar(alumno)}
                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
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
                {(selectedAlumno !== null && selectedAlumno !== undefined) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div ref={scrollRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative" style={{ height: '70vh', overflow: "auto" }}>
                            <h2 className="text-2xl font-bold mb-4">
                                {selectedAlumno === -2 ? "Nuevo Alumno menor" : selectedAlumno === -1 ? "Nuevo Alumno mayor" : alumnoSeleccionado === -3 ? "Editar Alumno mayor" : alumnoSeleccionado === -4 ? "Editar Alumno menor" : null}
                            </h2>
                            {errorMessage && (
                                <div className="mb-4 text-red-600">
                                    {errorMessage}
                                </div>
                            )}
                            <h1 className=" w-full mt-8 mb-3 font-semibold underline">Datos del alumno</h1>
                            <div className="mb-4">
                                <label htmlFor="nombre" className="block">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Ingrese nombre del alumno"
                                    pattern="[A-Za-z ]+"
                                    maxLength={50}
                                    value={alumnoDetails.nombre}
                                    onChange={handleChange}
                                    className="p-2 w-full border rounded"
                                    required
                                />
                                <label htmlFor="apellido" className="block">Apellido:</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    maxLength={50}
                                    pattern=" [A-Za-z ]+"
                                    placeholder="Ingrese apellido del alumno"
                                    value={alumnoDetails.apellido}
                                    onChange={handleChange}
                                    className="p-2 w-full border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={selectedAlumno === -1 ? "Si no tiene email, el mismo debe ser del responsable" : "Ingrese email del alumno"}
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                    max={75}
                                    value={alumnoDetails.email}
                                    onChange={handleChange}
                                    className="p-2 w-full border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="dni" className="block">DNI:</label>
                                <input
                                    type="text" // Cambiado a "text" para mayor control
                                    id="dni"
                                    name="dni"
                                    placeholder="Ingrese el DNI"
                                    value={alumnoDetails.dni || ''} // Asegurar un valor por defecto como cadena vacía
                                    maxLength={8} // Limitar a 8 caracteres
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ""); // Eliminar cualquier caracter no numérico
                                        const formattedValue = value

                                        setAlumnoDetails({ ...alumnoDetails, dni: formattedValue }); // Actualizar el estado
                                    }}
                                    className="p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="telefono" className="block">Teléfono:</label>
                                <div className="flex items-center">
                                    <span className="p-2 bg-gray-200 rounded-l">+54</span>
                                    <input
                                        type="text"
                                        id="telefono"
                                        name="telefono"
                                        placeholder="Ingrese el número de teléfono"
                                        maxLength={10} // Limitar a 10 dígitos
                                        value={alumnoDetails.telefono || ''} // Asegurar un valor inicial válido
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
                                            setAlumnoDetails({ ...alumnoDetails, telefono: value }); // Actualizar el estado
                                        }}
                                        className="p-2 w-full border rounded-r"
                                    />
                                </div>

                            </div>

                            <div className="flex-col flex mb-4">
                                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                                <input
                                    id="fechaNacimiento"
                                    type="date"
                                    name="fechaNacimiento"
                                    className="border rounded"
                                    value={alumnoDetails.fechaNacimiento}
                                    onChange={handleChange}
                                    min={
                                        selectedAlumno === -2
                                            ? new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]
                                            : new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]
                                    }
                                    max={
                                        selectedAlumno === -2
                                            ? new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0]
                                            : new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]
                                    }

                                        
                                        
                                    
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block">Contraseña:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder={(selectedAlumno === -2 || selectedAlumno === -1) ? "" : "Si desea cambiar la contraseña, ingresela aquí"}
                                    value={alumnoDetails.password}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className="p-2 w-full border rounded"
                                />
                            </div>
                            <button
                                onClick={() => { setPermitirDireccion(!permitirDireccion); }}
                                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                            >
                                Desea cargar su dirección ?
                            </button>
                            {permitirDireccion && <>
                                {loadingDireccion && <p className="text-red-600">Cargando su ubicación...</p>}
                                {!loadingDireccion &&
                                    <>
                                        <div className="mb-4">
                                            <label htmlFor="pais" className="block">País:</label>
                                            <input
                                                type="text"
                                                id="pais"
                                                name="pais"
                                                pattern='[A-Za-z ]+'
                                                maxLength={35}
                                                value={String(nacionalidadName)}
                                                placeholder="Ingrese el país donde vive"
                                                onChange={(e) => setNacionalidadName(e.target.value)}
                                                className="p-2 w-full border rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="provincia" className="block">Provincia:</label>
                                            <input
                                                type="text"
                                                id="provincia"
                                                name="provinciaName"
                                                maxLength={55}
                                                pattern='[A-Za-z ]+'
                                                value={String(provinciaName)}
                                                placeholder="Ingrese la provincia donde vive"
                                                onChange={(e) => setProvinciaName(e.target.value)}
                                                className="p-2 w-full border rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="localidad" className="block">Localidad:</label>
                                            <input
                                                type="text"
                                                name="localidad"
                                                maxLength={35}
                                                pattern='[A-Za-z ]+'
                                                value={String(localidadName)}
                                                placeholder="Ingrese la localidad donde vive"
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
                                                maxLength={75}
                                                pattern='[A-Za-z ]+'
                                                value={String(calle)}
                                                placeholder="Ingrese el nombre de su calle"
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
                                                maxLength={5}
                                                placeholder="Ingrese el número de su calle"

                                                value={numero ? Number(numero) : ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*$/.test(value)) {
                                                        setNumero(Number(e.target.value))
                                                    }
                                                }}
                                                className="p-2 w-full border rounded"
                                            />
                                        </div>
                                    </>
                                }
                            </>
                            }
                            {selectedAlumno !== -1 && alumnoSeleccionado !== -3 && (
                                <>
                                    <div>
                                        <h1 className=" w-full mt-8 mb-3 font-semibold underline">Datos del responsable</h1>
                                        <div className="mb-4">
                                            <label htmlFor="ResponsableNombre" className="block">Nombre :</label>
                                            <input
                                                type="text"
                                                id="ResponsableNombre"
                                                name="nombre"
                                                pattern='[A-Za-z ]+'
                                                placeholder="Ingrese el nombre del responsable"
                                                maxLength={50}
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
                                                pattern='[A-Za-z ]+'
                                                placeholder="Ingrese el apellido del responsable"
                                                maxLength={50}
                                                value={responsableDetails.apellido}
                                                onChange={handleChangeResponsable}
                                                className="p-2 w-full border rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="dni" className="block">DNI:</label>
                                            <input
                                                type="text" // Cambiado a "text" para mayor control
                                                id="dni"
                                                name="dni"
                                                placeholder="Ingrese el DNI"
                                                value={responsableDetails.dni || ''} // Asegurar un valor por defecto como cadena vacía
                                                maxLength={8} // Limitar a 8 caracteres
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, ""); // Eliminar cualquier caracter no numérico
                                                    const formattedValue = value

                                                    setResponsableDetails({ ...responsableDetails, dni: formattedValue }); // Actualizar el estado
                                                }}
                                                className="p-2 w-full border rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="telefono" className="block">Teléfono:</label>
                                            <div className="flex items-center">
                                                <span className="p-2 bg-gray-200 rounded-l">+54</span>
                                                <input
                                                    type="text"
                                                    id="telefono"
                                                    name="telefono"
                                                    placeholder="Ingrese el número de teléfono"
                                                    maxLength={10} // Limitar a 10 dígitos
                                                    value={responsableDetails.telefono || ''} // Asegurar un valor inicial válido
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
                                                        setResponsableDetails({ ...responsableDetails, telefono: value }); // Actualizar el estado
                                                    }}
                                                    className="p-2 w-full border rounded-r"
                                                />
                                            </div>

                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="emailR" className="block">Email:</label>
                                            <input
                                                type="text"
                                                id="emailR"
                                                name="email"
                                                placeholder="Ingrese el email del responsable"
                                                value={responsableDetails.email}
                                                onChange={handleChangeResponsable}
                                                className="p-2 w-full border rounded"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setPermitirDireccionResp(!permitirDireccionResp); }}
                                        className="bg-gray-700 py-2 mb-2 px-5 text-white rounded hover:bg-gray-800"
                                    >
                                        Desea cargar su dirección ?
                                    </button>
                                    {permitirDireccionResp && <>
                                        {loadingDireccionResp && <p className="text-red-600">Cargando la ubicación del responsable...</p>}
                                        {!loadingDireccionResp &&
                                            <>
                                                <div className="mb-4">
                                                    <label htmlFor="paisRes" className="block">País:</label>
                                                    <input
                                                        type="text"
                                                        id="paisRes"
                                                        name="pais"
                                                        maxLength={75}
                                                        value={String(nacionalidadNameResp)}
                                                        placeholder="Ingrese el país del responsable"
                                                        onChange={(e) => setNacionalidadNameResp(e.target.value)}
                                                        className="p-2 w-full border rounded"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="provinciaResp" className="block">Provincia:</label>
                                                    <input
                                                        type="text"
                                                        id="provinciaResp"
                                                        name="provincia"
                                                        maxLength={75}
                                                        value={String(provinciaName)}
                                                        placeholder="Ingrese la provincia del responsable"
                                                        onChange={(e) => setProvinciaNameResp(e.target.value)}
                                                        className="p-2 w-full border rounded"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="localidadResp" className="block">Localidad:</label>
                                                    <input
                                                        type="text"
                                                        id="localidadResp"
                                                        name="localidad"
                                                        value={String(localidadName)}
                                                        placeholder="Ingrese la localidad del responsable"
                                                        onChange={(e) => setLocalidadNameResp(e.target.value)}
                                                        className="p-2 w-full border rounded"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="calleResp" className="block">Calle:</label>
                                                    <input
                                                        type="text"
                                                        id="calleResp"
                                                        name="calle"
                                                        value={String(calle)}
                                                        placeholder="Ingrese la calle del responsable"
                                                        onChange={(e) => setcalleResp(e.target.value)}
                                                        className="p-2 w-full border rounded"
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="numeroResp" className="block">Número:</label>
                                                    <input
                                                        type="number"
                                                        id="numeroResp"
                                                        name="numero"
                                                        placeholder="Ingrese el número de calle del responsable"
                                                        value={numero ? Number(numero) : ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d*$/.test(value)) {
                                                                setNumeroResp(Number(e.target.value))
                                                            }
                                                        }}
                                                        className="p-2 w-full border rounded"
                                                    />
                                                </div>
                                            </>
                                        }
                                    </>
                                    }
                                </>
                            )}
                            <div>
                                <Talleres crearEstado={selectedAlumno} user={obAlumno} cursosElegido={cursosElegido} setCursosElegido={setCursosElegido} />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => {
                                        (selectedAlumno === -1 || selectedAlumno === -2) && !mayor ? handleCreateAlumno() : handleSaveChanges()
                                    }}


                                    className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader /> : "Guardar"}
                                </button>
                                <button
                                    disabled={isSaving}
                                    onClick={() => {
                                        setSelectedAlumno(null); handleCancel_init()
                                        setErrorMessage("")
                                    }}
                                    className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* este metodo quiero qque sea par al madficacion de alumno mayor */}


            </div>

        </main>
    );
}
// #endregion
//export default Alumnos;
export default withAuth(Alumnos);
