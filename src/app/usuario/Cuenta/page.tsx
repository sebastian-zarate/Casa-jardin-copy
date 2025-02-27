"use client"
import React, { useRef, useState, useEffect } from 'react';
import Background from "../../../../public/Images/Background.jpeg";
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Navigate from "../../../components/alumno/navigate/page";
import { dniExists, emailExists, updateAlumno } from '@/services/Alumno';
import { addDireccion, getDireccionCompleta, updateDireccionById } from '@/services/ubicacion/direccion';
import { addProvincias, updateProvinciaById } from '@/services/ubicacion/provincia';
import { addLocalidad, updateLocalidad } from '@/services/ubicacion/localidad';
import { addPais } from '@/services/ubicacion/pais';
import { getCursosByIdAlumno } from '@/services/alumno_curso';
import { Curso } from '@/services/cursos';
import withAuthUser from "../../../components/alumno/userAuth";
import { useRouter } from 'next/navigation';
import { autorizarUser, fetchUserData } from '@/helpers/cookies';
import PasswordComponent from '@/components/Password/page';
import { validateApellido, validateFechaNacimiento, validateDireccion, validateDni, validateEmail, validateNombre, validatePhoneNumber } from '@/helpers/validaciones';
import Loader from '@/components/Loaders/loadingSave/page';
type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    dni: number | null;
    telefono: string | null;
    email: string;
    /*     password: string; */
    direccionId: number;
    fechaNacimiento: string;
    rolId: number;
};

const Cuenta: React.FC = () => {
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
        id: number; nombre: string; apellido: string; dni: number | null;
        telefono: string | null; email: string; fechaNacimiento: string; direccionId?: number; rolId?: number;
    }>({
        id: user?.id || 0,
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        dni: user?.dni || null,
        telefono: user?.telefono || null,
        email: user?.email || '',
        fechaNacimiento: user?.fechaNacimiento ? new Date(user.fechaNacimiento).toISOString().split('T')[0] : '',
        direccionId: user?.direccionId || 0,
        rolId: user?.rolId || 0
    });
    const [alumnoDetailsCopia, setAlumnoDetailsCopia] = useState<{
        id: number; nombre: string; apellido: string; dni: number | null;
        telefono: string | null; email: string; fechaNacimiento: string; direccionId?: number; rolId?: number;
    }>({
        id: user?.id || 0,
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        dni: user?.dni || null,
        telefono: user?.telefono || null,
        email: user?.email || '',
        fechaNacimiento: user?.fechaNacimiento ? new Date(user.fechaNacimiento).toISOString().split('T')[0] : '',
        direccionId: user?.direccionId || 0,
        rolId: user?.rolId || 0
    });
    
    const [nacionalidadName, setNacionalidadName] = useState<string>();
    // Estado para almacenar el ID de la provincia, inicialmente nulo
    const [provinciaName, setProvinciaName] = useState<string>();

    // Estado para almacenar el ID de la localidad, inicialmente nulo
    const [localidadName, setLocalidadName] = useState<string>();

    // Estado para almacenar la calle, inicialmente nulo
    const [calle, setcalle] = useState<string | null>();

    // Estado para almacenar el número de la dirección, inicialmente nulo
    const [numero, setNumero] = useState<number | null>();

    //para obtener user by email

    const [habilitarCambioContraseña, setHabilitarCambioContraseña] = useState<boolean>(false);
    const [correcto, setCorrecto] = useState<boolean>(false);

    //listas de cursos
    const [cursos, setCursos] = useState<Curso[]>()

    const [mayoriaEdad, setMayoriaEdad] = useState<boolean>(false);

    const [loadingDireccion, setLoadingDireccion] = useState<boolean>(false);
    const [permitirDireccion, setPermitirDireccion] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    //endregion

    //region UseEffects
    // Función para obtener los datos del usuario

    const router = useRouter();
    useEffect(() => {
        if (user && !alumnoDetails.email) {
            getUser()

        }

    }, [user]);
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
        authorizeAndFetchData();
    }, [router]);

    const authorizeAndFetchData = async () => {
        console.time("authorizeAndFetchData");
        // Primero verifico que el user esté logeado
        console.log("router", router);
        await autorizarUser(router);
        // Una vez autorizado obtengo los datos del user y seteo el email
        const user = await fetchUserData();
        //console.log("user", user);
        setUser(user)
        if (!user) return;
        const edad = calculaEdad(new Date(user.fechaNacimiento));
        if (edad >= 18) setMayoriaEdad(true);
        else setMayoriaEdad(false);
        console.log("---------> edad", edad)
        console.log("mayoria edad:", mayoriaEdad);
        let talleres = await getCursosByIdAlumno(Number(user?.id));
        setCursos([])
        talleres.map((curso) => {
            setCursos(prev => (prev ? [...prev, curso] : [curso]));
        })
        //console.timeEnd("authorizeAndFetchData");
    };
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
    useEffect(() => {
        if (user) {
            /*             console.log("permitirDireccion", permitirDireccion);
                        console.log("loadingDireccion", loadingDireccion); */
            if ((!nacionalidadName && !provinciaName && !localidadName && !calle && !numero && user?.direccionId) && permitirDireccion) {
                console.log("obAlumno111", user);
                getUbicacion(user);
            }

        }

        if (!user) {
            setNacionalidadName("");
            setProvinciaName("");
            setLocalidadName("");
            setcalle("");
            setNumero(null);
            setLoadingDireccion(false)
        }
    }, [user, permitirDireccion]);
    //endregion

    //region Funciones


    async function createUbicacion() {
        const nacionalidad = await addPais({ nombre: String(nacionalidadName) });
        const prov = await addProvincias({ nombre: String(provinciaName), nacionalidadId: Number(nacionalidad?.id) });
        const localidad = await addLocalidad({ nombre: String(localidadName), provinciaId: Number(prov?.id) });

        const direccion = await addDireccion({ calle: String(calle), numero: Number(numero), localidadId: Number(localidad?.id) });
        return { direccion, nacionalidad };
    }
    async function getUbicacion(userUpdate: any) {
        // Obtener la dirección del usuario por su ID
        //console.log("SI DIRECCIONID ES FALSE:", Number(userUpdate?.direccionId));
        setLoadingDireccion(true);
        const direccion = await getDireccionCompleta(userUpdate?.direccionId);

        //console.log("NACIONALIDAD", nacionalidad);
        // Actualizar los estados con los datos obtenidos
        setLocalidadName(String(direccion?.localidad?.nombre));
        setProvinciaName(String(direccion?.localidad?.provincia?.nombre));
        setNacionalidadName(String(direccion?.localidad?.provincia?.nacionalidad?.nombre));
        setNumero(direccion?.numero);
        setcalle(direccion?.calle);
        setLoadingDireccion(false);
        return { direccion };
    }
    async function getUser() {
        console.log(user?.nombre);
        const userUpdate: Usuario = {
            id: user?.id || 0,
            nombre: user?.nombre || '',
            apellido: user?.apellido || '',
            dni: user?.dni ?? null,
            telefono: user?.telefono ?? null,
            email: user?.email || '',
            fechaNacimiento: user?.fechaNacimiento ? new Date(user.fechaNacimiento).toISOString().split('T')[0] : '',
            direccionId: user?.direccionId || 0,
            rolId: user?.rolId || 0
        };
    
        if (!userUpdate.direccionId) {
            setNacionalidadName("");
            setProvinciaName("");
            setLocalidadName("");
            setcalle("");
            setNumero(null);
        } else if (userUpdate.direccionId) {
            getUbicacion(userUpdate);
        }
    
        setAlumnoDetails({
            id: userUpdate.id,
            nombre: userUpdate.nombre,
            apellido: userUpdate.apellido,
            dni: userUpdate.dni,
            telefono: userUpdate.telefono,
            fechaNacimiento: userUpdate.fechaNacimiento,
            email: userUpdate.email,
            direccionId: userUpdate.direccionId,
            rolId: userUpdate.rolId
        });
    
        setAlumnoDetailsCopia({
            id: userUpdate.id,
            nombre: userUpdate.nombre,
            apellido: userUpdate.apellido,
            dni: userUpdate.dni,
            telefono: userUpdate.telefono,
            fechaNacimiento: userUpdate.fechaNacimiento,
            email: userUpdate.email,
            direccionId: userUpdate.direccionId,
            rolId: userUpdate.rolId
        });
    
        console.log("userUpdate", userUpdate);
        console.log("alumnoDetails", alumnoDetails);
        setUser(userUpdate);
        //setOpenBox(!openBox)
    
        //CARGAR TODAS LAS DIRECCIONES
    }

    function calculaEdad(birthDate: Date) {
        const today = new Date();
        let edad = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            edad--;
        }
        return edad;
    }
    //region validate
    async function validatealumnoDetails() {
        const { nombre, apellido, email, telefono, dni } = alumnoDetails || {};
        console.log("alumno details", alumnoDetails);
        /*         if (JSON.stringify(alumnoDetails) === JSON.stringify(alumnoDetailsCopia)) {
                    return;
                } */


        //validar que el nombre sea de al menos 2 caracteres y no contenga números
        let resultValidate;
        if (alumnoDetails) {
            resultValidate = validateNombre(nombre);
            if (resultValidate) return resultValidate;

            resultValidate = validateApellido(apellido);
            if (resultValidate) return resultValidate;

            resultValidate = validateEmail(email);
            if (resultValidate) return resultValidate;
            if (email !== alumnoDetailsCopia?.email) {
                const estado = await emailExists(email)
                if (estado) {
                    return "El email ya está registrado.";
                }
                if (resultValidate) return resultValidate;
            }


            if (dni && typeof (dni) === "number") {
                resultValidate = validateDni(String(dni));
                if (resultValidate) return resultValidate;
                if (dni !== alumnoDetailsCopia?.dni) {
                    const estado = await dniExists(dni);
                    if (estado) {
                        return "El dni ya está registrado.";
                    }
                }
            }
            //ya que el telefono es opcional, si es mayor de edad
            if (telefono && mayoriaEdad) {
                resultValidate = validatePhoneNumber(telefono.toString());
                if (resultValidate) return resultValidate;
            }

        }
        if (permitirDireccion) {
            resultValidate = validateDireccion(nacionalidadName, provinciaName, localidadName, String(calle), Number(numero));
            if (resultValidate) return resultValidate
        }
        console.log("resultvalidate", resultValidate);
        let validateInput = validateFechaNacimiento(new Date(alumnoDetails.fechaNacimiento));
        if (validateInput) return validateInput;

        
    }

    async function handleSaveChanges() {
        // Validar los detalles del alumno antes de continuar
        const validationError = await validatealumnoDetails();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        console.log("flag 1 save changes");
        // Crear un objeto con los campos necesarios, eliminando espacios al inicio y al final
        const trimmedAlumnoDetails = {
            nombre: alumnoDetails.nombre.trim(),
            apellido: alumnoDetails.apellido.trim(),
            email: alumnoDetails.email.trim(),
            telefono: alumnoDetails.telefono?.toString().trim(),
            dni: alumnoDetails.dni, //puede ser null
            fechaNacimiento: new Date(alumnoDetails.fechaNacimiento),

        };

        console.log("flag 1.1 save changes - trimmedAlumnoDetails:", trimmedAlumnoDetails);
        setIsSaving(true);
        
        //si los datos son iguales no se hace nada (estaba mal el condicional) y si no hay cambios en la direccion
        if (JSON.stringify(alumnoDetails) === JSON.stringify(alumnoDetailsCopia) && !permitirDireccion) {
            console.log("flag 1a save changes - insde json if");
            setIsSaving(false);
            return 
        }
        // Validar campos requeridos después de aplicar .trim()
        if (!trimmedAlumnoDetails.nombre || !trimmedAlumnoDetails.apellido || !trimmedAlumnoDetails.email) {
            console.log("flag 1b save changes - inside big if");
            setErrorMessage('Los campos Nombre, Apellido y Correo no pueden estar vacíos.');
            return;
        }

        let newAlumno;

        try {
            console.log("flag 2 save changes - inside try");
            //region cargar datos con direcc
            if (permitirDireccion) {
                console.log("flag 3 save changes - inside permitirDireccion");
                // Validar si el usuario tiene una dirección asociada
                console.log("condicional de direccion:", !alumnoDetails.direccionId);
                if (!alumnoDetails.direccionId) {
                    // Crear ubicación si no existe dirección asociada
                    console.log("flag 3a save changes - inside permitirDireccion -!direccionId");
                    const { direccion } = await createUbicacion();

                    console.log("flag 3a1 - direccion:", direccion);
                    newAlumno = await updateAlumno((alumnoDetails?.id), {
                        ...trimmedAlumnoDetails,
                        direccionId: (direccion?.id),
                    });
                    console.log("falg 3a2 - new alumno:", newAlumno);

                } 
                //se entra si  tiene una direccion asociada
                else {
                    console.log("flag 3b save changes - else de existe direccion asosciada");
                    // Actualizar detalles relacionados con la dirección, localidad y provincia
                    const { direccion } = await getUbicacion(alumnoDetails);

                    const trimmedDireccionDetails = {
                        calle: String(calle).trim(),
                        numero: Number(numero),
                        localidadId: Number(direccion?.localidad?.id),
                    };

                    const trimmedLocalidadDetails = {
                        nombre: String(localidadName).trim(),
                        provinciaId: Number(direccion?.localidad?.provincia?.id),
                    };

                    const trimmedProvinciaDetails = {
                        nombre: String(provinciaName).trim(),
                        nacionalidadId: Number(direccion?.localidad?.provincia?.nacionalidad?.id),
                    };

                    console.log("flag 4 - guardar cambios")
                    await updateDireccionById(Number(direccion?.id), trimmedDireccionDetails);
                    await updateLocalidad(Number(direccion?.localidad?.id), trimmedLocalidadDetails);
                    await updateProvinciaById(Number(direccion?.localidad?.provincia?.id), trimmedProvinciaDetails);

                    newAlumno = await updateAlumno(Number(alumnoDetails?.id), {
                        ...trimmedAlumnoDetails,
                        direccionId: (direccion?.id),
                    });

                    console.log("falg 5a - new alumno:", newAlumno);
                }
            }
            //region no cargar datos con direcc
            else {
                newAlumno = await updateAlumno(Number(alumnoDetails.id), {
                    ...trimmedAlumnoDetails,
                });
                console.log("falg 20 - new alumno:", newAlumno);
            }

            console.log(" flag 5 - new alumno si no entro al else:", newAlumno);
            // Refrescar datos y cerrar la interfaz de edición
            setOpenBox(0);
            getUser();
            setIsSaving(false);
            authorizeAndFetchData();
        } catch (error) {
            setErrorMessage("Ha ocurrido un error al guardar los cambios.");
            setIsSaving(false);
        }
        console.log("final flag - Resultado final:", newAlumno);
    }

    //endregion

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow relative overflow-auto">
                <div className='absolute inset-0 -z-10'>
                    <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={20} priority={true} />
                </div>
                {/* Barra de navegación fija */}
                <div className="fixed justify-between w-full z-10">
                    <Navigate />
                </div>
    
                {/* Contenido desplazable */}
                <div className="pt-20 px-4 pb-40">
                    <h1 className="flex my-10 items-center justify-center font-bold text-3xl">Datos del Estudiante</h1>
                    <div className="flex justify-center w-full">
                        <div className="mx-auto bg-gray-100 rounded-lg shadow-md px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 w-full max-w-4xl">
                            {/* Información del usuario */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
                                <p className="p-2 border rounded bg-gray-100">{user?.nombre} {user?.apellido}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">DNI:</label>
                                <p className="p-2 border rounded bg-gray-100">{user?.dni || "DNI no cargado"}</p>
                            </div>
    
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Talleres:</label>
                                {cursos?.length !== 0 ? (
                                    <p className="p-2 border rounded bg-gray-100" style={{ height: '10vh', overflow: "auto" }}>
                                        {cursos?.map((curso) => curso.nombre).join(", ")}
                                    </p>
                                ) : <p className="p-2 border rounded bg-gray-100">Talleres no cargados</p>}
                            </div>
    
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Domicilio:</label>
                                <p className="p-2 border rounded bg-gray-100">
                                    {nacionalidadName || "-"}, {provinciaName || "-"},
                                    {localidadName || "-"}, {calle || "-"} {numero || "-"}
                                </p>
                            </div>
    
                            {mayoriaEdad && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">Teléfono:</label>
                                    <p className="p-2 border rounded bg-gray-100">
                                        {user?.telefono || "Teléfono no cargado"}
                                    </p>
                                </div>
                            )}
    
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Email:</label>
                                <p className="p-2 border rounded bg-gray-100">{user?.email}</p>
                            </div>
    
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Fecha de Nacimiento:</label>
                                <p className="p-2 border rounded bg-gray-100">
                                    {user?.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-ES', {
                                        timeZone: 'UTC',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                    }) : ''}
                                </p>
                            </div>
                        </div>
                    </div>
    
                    {/* Botón Editar */}
                    <div className="flex items-center justify-center mt-5">
                        <button
                            className="bg-red-500 py-2 px-10 text-white rounded hover:bg-red-700"
                            onClick={() => { setOpenBox(1); console.log(openBox); getUser(); }}
                        >
                            Editar
                        </button>
                    </div>
                </div>  
    
    
                {openBox === 1 && (
                    <div className="fixed inset-0 flex items-center w-600 justify-center bg-black bg-opacity-50 z-50">
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
                                    pattern='[A-Za-zÀ-ÿ ]+'
                                    placeholder='Ej: Juan'
                                    maxLength={50}
                                    value={alumnoDetails.nombre}
                                    onChange={(e) => setAlumnoDetails({ ...alumnoDetails, nombre: e.target.value })}
                                    className="p-2 w-full border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="apellido" className="block">Apellido:</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    pattern='[A-Za-zÀ-ÿ ]+'
                                    placeholder='Ej: Pérez'
                                    maxLength={50}
                                    value={(alumnoDetails.apellido)}
                                    onChange={(e) => setAlumnoDetails({ ...alumnoDetails, apellido: e.target.value })}
                                    className="p-2 w-full border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="dni" className="block">DNI:</label>
                                <input
                                    type="text"
                                    id="dni"
                                    name="dni"
                                    pattern="[0-9]*"
                                    placeholder="Ingrese su DNI sin puntos ni espacios"
                                    maxLength={8} // Limita el máximo de caracteres a 8
                                    value={alumnoDetails.dni !== null ? String(alumnoDetails.dni) : ''}
                                    onChange={(e) => {
                                        const regex = /^[0-9]*$/; // Permite solo números
                                        if (regex.test(e.target.value)) {
                                            setAlumnoDetails({ ...alumnoDetails, dni: e.target.value === '' ? null : Number(e.target.value) }); // Actualiza solo si es un número válido
                                        }
                                    }}
                                    required
                                    className="p-2 w-full border rounded"
                                />
                            </div>
    
                            <div className="mb-4">
                                <label htmlFor="email" className="block">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={(alumnoDetails.email)}
                                    onChange={(e) => setAlumnoDetails({ ...alumnoDetails, email: e.target.value })}
                                    className="p-2 w-full border rounded"
                                    required
                                />
                            </div>
                            {/*                       <div className="mb-4">
                                <label htmlFor="imagen" className="block">Imagen:</label>
                                <input
                                    type="file"
                                    id="imagen"
                                    name="imagen"
                                    className="p-2 w-full border rounded"
                                />
                            </div> */}
                            {mayoriaEdad && (
                                <div className="mb-4">
                                    <label htmlFor="telefono" className="block">Teléfono:</label>
                                    <div className="flex">
                                        <h3 className="p-2">+54</h3>
                                        <input
                                            type="text"
                                            id="telefono"
                                            name="telefono"
                                            placeholder="Ej: 03431234567"
                                            value={alumnoDetails.telefono ?? ''}
                                            onChange={(e) => setAlumnoDetails({ 
                                                ...alumnoDetails, 
                                                telefono: e.target.value === '' ? null : e.target.value 
                                            })}
                                            maxLength={11} // Limita el número total de caracteres
                                            className="p-2 w-full border rounded"
                                        />
                                    </div>
                            </div>)
                            }
                            <div className="flex-col flex mb-4">
                                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                                <input
                                    id="fechaNacimiento"
                                    type="date"
                                    name="fechaNacimiento"
                                    className="border rounded"
                                    value={alumnoDetails.fechaNacimiento}
                                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                                        .toISOString()
                                        .split('T')[0]} // Hace 100 años desde hoy
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 2))
                                        .toISOString()
                                        .split('T')[0]} // Hace 2 años desde hoy
                                    onChange={(e) => setAlumnoDetails({ ...alumnoDetails, fechaNacimiento: e.target.value })}
                                    required
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
                                                onChange={(e) => {
                                                    if (/^[A-Za-zÀ-ÿ\s]*$/.test(e.target.value)) {
                                                        setNacionalidadName(e.target.value);
                                                    } else {
                                                        alert("Solo se permiten letras y espacios.");
                                                    }
                                                }}
                                                className="p-2 w-full border rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="provincia" className="block">Provincia:</label>
                                            <input
                                                type="text"
                                                id="provincia"
                                                name="provincia"
                                                maxLength={55}
                                                pattern='[A-Za-z ]+'
                                                value={String(provinciaName)}
                                                placeholder="Ingrese la provincia donde vive"
                                                onChange={(e) => {
                                                    if (/^[A-Za-zÀ-ÿ\s]*$/.test(e.target.value)) {
                                                        setProvinciaName(e.target.value);
                                                    } else {
                                                        setErrorMessage("Solo se permiten letras y espacios.");
                                                    }
                                                }}
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
                                                onChange={(e) => {
                                                    if (/^[A-Za-zÀ-ÿ\s]*$/.test(e.target.value)) {
                                                        setLocalidadName(e.target.value);
                                                    } else {
                                                        setErrorMessage("Solo se permiten letras y espacios.");
                                                    }
                                                }}
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
                                                max={99999}
                                                placeholder="Ingrese el número de su calle"
                                                value={numero ? Number(numero) : ""}
                                                onChange={(e) => setNumero(Number(e.target.value))}
                                                className="p-2 w-full border rounded"
                                            />
                                        </div>
                                    </>
                                }
                            </>
                            }
    
                            <div>
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
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => { handleSaveChanges(); console.log("openBox", openBox) }}
                                    className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader /> : "Guardar"}
                                </button>
                                <button
                                    onClick={() => { setOpenBox(0); console.log(openBox); setPermitirDireccion(false); getUser() }}
                                    className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <footer className="bg-sky-600 border-t w-full">
                <But_aside />
            </footer>
        </div>
    );
}
export default withAuthUser(Cuenta);