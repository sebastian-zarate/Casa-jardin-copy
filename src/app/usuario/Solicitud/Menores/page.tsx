"use client"
import React, { useState, useEffect } from 'react';
import SeleccionTaller from './componentes/seleccionTaller';
import But_aside from "../../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../../components/alumno/navigate/page';
import DatosMenor from './componentes/datosMenor';
import CondicionSalud from './componentes/condicionSalud';
import AutorizacionImg from './componentes/autorizacionImagen';
import AutorizacionSalidas from './componentes/autorizacionSalidas';
import Reglamentacion from './componentes/reglamentacion';
import DatosMayor from './componentes/datosMayor';
import EmailPage from '../email/EmailPage';
import { useRouter } from 'next/navigation';
import { autorizarUser, fetchUserData } from '@/helpers/cookies';
//server
import { createSolicitud } from '@/services/Solicitud/Solicitud';
import { addPais } from '@/services/ubicacion/pais';
import { addProvincias } from '@/services/ubicacion/provincia';
import { addDireccion, getDireccionCompleta } from '@/services/ubicacion/direccion';
import { updateAlumno } from '@/services/Alumno';
import { createSolicitudMenores } from '@/services/Solicitud/SolicitudMenor';
import { createCursoSolicitud } from '@/services/curso_solicitud';
import { createAlumno_Curso, getCursosByIdAlumno } from '@/services/alumno_curso';
import { createResponsable, getResponsableByAlumnoId } from '@/services/responsable';
import { addLocalidad } from '@/services/ubicacion/localidad';
import { calcularEdad, dateTimeToString } from '@/helpers/fechas';
import { validateApellido, validateDireccion, validateDni, validateEmail, validateNombre, validatePhoneNumber } from '@/helpers/validaciones';

const Menores: React.FC = () => {
    // Estado para almacenar la pantalla actual
    const [selectedScreen, setSelectedScreen] = useState<number>(0);
    // Estado para almacenar los cursos seleccionados
    const [selectedCursosId, setSelectedCursosId] = useState<number[]>([]);
    const [cursosYaInscriptosId, setCursosYaInscriptosId] = useState<number[]>([]);
    const [cursosYaInscriptosName, setCursosYaInscriptosName] = useState<number[]>([]);

    const [datosMenor, setDatosMenor] = useState({
        nombre: "",
        apellido: "",
        fechaNacimiento: new Date().toISOString().split('T')[0],
        dni: 0,
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
        numero: 0,
    });
    const [datosMenorCopia, setDatosMenorCopia] = useState({
        nombre: "",
        apellido: "",
        fechaNacimiento: new Date().toISOString().split('T')[0],
        dni: 0,
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
        numero: 0,
    });
    const [datosMayor, setDatosMayor] = useState({
        nombre: "",
        apellido: "",
        telefono: 0,
        correoElectronico: "",
        dni: 0,
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
        numero: 0,
    });
    const [datosMayorCopia, setDatosMayorCopia] = useState({
        nombre: "",
        apellido: "",
        telefono: 0,
        correoElectronico: "",
        dni: 0,
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
        numero: 0,
    });
    const [datosSalud, setDatosSalud] = useState({
        enfermedad: "",
        alergia: "",
        tratamiento: "",
        terapia: "",
        consultasEspecialistas: "",
        motivoInscripcion: ""
    });
    const [datosAutorizacionImage, setDatosAutorizacionImage] = useState({
        firma: "",
        observaciones: "",
    });
    const [datosAutorizacionSalidas, setDatosAutorizacionSalidas] = useState({
        firma: "",
        observaciones: "",
    });
    const [datosReglamentacion, setDatosReglamentacion] = useState({
        firma: "",
    });


    const [error, setError] = useState<string>('');
    const [verificarEmail, setVerificarEmail] = useState<boolean>(false);
    const [correcto, setCorrecto] = useState(false);
    const [user, setUser] = useState<any>();
    const [verifi, setVerifi] = useState<boolean>(false)

    //datos menor: nombre, apellido, edad, fecha de nacimiento, dni,pais, localidad,calle
    //datos mayor: nombre, apellido, telefono, correo electronico, dni, pais, localidad, calle
    //datos salud: enfermedad ?, alergia?, tratamiento o medicacion?, terapia?, consultas a especialistas (neurologo, cardiologo, fisioterapeutas, etc.)
    //datos autorizacionImage: firmo el mayor a cargo?, observaciones? puede ser nulo
    //datos autorizacionSalidas: firmo el mayor a cargo?, observaciones? puede ser nulo
    //datos reglamentacion: firmo?
    // Asegúrate de que tu archivo TypeScript esté correctamente referenciado en tu HTML
    //traer los datos del alumno logeado

    const router = useRouter();
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
        if (!user) {
            const authorizeAndFetchData = async () => {
                // Primero verifico que el user esté logeado
                await autorizarUser(router);
                // Una vez autorizado obtengo los datos del user y seteo el email

                const user = await fetchUserData();

                const curYaInscriptos = await getCursosByIdAlumno(user.id);
                const curYaInscriptosId = curYaInscriptos.map((curso) => curso.id);
                const curYaInscriptosName = curYaInscriptos.map((curso) => curso.nombre);
                setCursosYaInscriptosId(curYaInscriptosId);
                setCursosYaInscriptosName(curYaInscriptosName);

                const responsable = await getResponsableByAlumnoId(user?.id);
                if (user) {
                    setUser(user);
                    let direccion, localidad, provincia, pais;
                    if(user.direccionId) {
                        direccion = await getDireccionCompleta(user.direccionId);
                        localidad = direccion?.localidad;
                        provincia = localidad?.provincia;
                        pais = provincia?.nacionalidad;
                    }
                    //cargo los datos del menor obtenidos del usuario
                    setDatosMenor({
                        ...datosMenor,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        fechaNacimiento: new Date(user.fechaNacimiento).toISOString().split('T')[0],
                        dni: Number(user.dni),
                        pais: pais?.nombre || '',
                        provincia: provincia?.nombre || '',
                        localidad: localidad?.nombre || '',
                        calle: direccion?.calle || '',
                        numero: Number(direccion?.numero),
                    });
                    setDatosMenorCopia({
                        ...datosMenor,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        fechaNacimiento: new Date(user.fechaNacimiento).toISOString().split('T')[0],
                        dni: Number(user.dni),
                        pais: pais?.nombre || '',
                        provincia: provincia?.nombre || '',
                        localidad: localidad?.nombre || '',
                        calle: direccion?.calle || '',
                        numero: Number(direccion?.numero),
                    });
                    if (typeof(responsable) !== "string" && responsable) {
                        //cargo los datos del menor obtenidos del usuario
                        setDatosMayor({
                            ...datosMayor,
                            nombre: responsable.nombre,
                            apellido: responsable.apellido,
                            telefono: Number(responsable.telefono),
                            correoElectronico: responsable.email,
                            dni: Number(responsable.dni),
                            pais: pais?.nombre || '',
                            provincia: provincia?.nombre || '',
                            localidad: localidad?.nombre || '',
                            calle: direccion?.calle || '',
                            numero: Number(direccion?.numero),
                        });
                        setDatosMayorCopia({
                            ...datosMayor,
                            nombre: responsable.nombre,
                            apellido: responsable.apellido,
                            telefono: Number(responsable.telefono),
                            correoElectronico: responsable.email,
                            dni: Number(responsable.dni),
                            pais: pais?.nombre || '',
                            provincia: provincia?.nombre || '',
                            localidad: localidad?.nombre || '',
                            calle: direccion?.calle || '',
                            numero: Number(direccion?.numero),
                        });
                    }

                }
            };

            authorizeAndFetchData();
        }
    }, [router]);

    useEffect(() => {
        if (correcto) {
            console.log("0.CARGANDO SOLICITUD")
            cargarSolicitud();
            setVerificarEmail(false);

        }
    }, [correcto])

/*     function validateDatos() {
        // carrateres especiales en el nombre y la descripción
        const regex = /^[a-zA-Z0-9_ ,.;áéíóúÁÉÍÓÚñÑüÜ@]*$/; // no quiero que tenga caracteres especiales que las comas y puntos afecten 

        if (selectedScreen === 0 && selectedCursosId.length === 0) return "Debe seleccionar al menos un taller";
        if (selectedScreen === 1) {
            // Validar que el nombre tenga al menos 2 caracteres
            if (datosMenor.nombre.length < 1 && regex.test(datosMenor.nombre)) {
                return ("El nombre debe tener al menos 2 caracteres.");
            }
            if (datosMenor.apellido.length < 1 && regex.test(datosMenor.apellido)) {
                return ("El apellido debe tener al menos 2 caracteres.");
            }
            if ((datosMenor.dni).toString().length != 8) {
                return ("El DNI debe tener al menos 8 números.");
            }
            if (datosMenor.pais.length < 1 && regex.test(datosMenor.pais)) {
                return ("El país debe tener al menos 2 caracteres.");
            }
            if (datosMenor.provincia.length < 1 && regex.test(datosMenor.provincia)) {
                return ("La provincia debe tener al menos 2 caracteres.");
            }
            if (datosMenor.localidad.length < 1 && regex.test(datosMenor.localidad)) {
                return ("La localidad debe tener al menos 2 caracteres.");
            }
            if (datosMenor.calle.length < 1 && regex.test(datosMenor.calle)) {
                return ("La calle debe tener al menos 2 caracteres.");
            }
            if (!datosMenor.numero) {
                return ("El número debe tener al menos 1 número.");
            }
            if (!/\d/.test(datosMenor.fechaNacimiento)) return ("La fecha de nacimiento es obligatoria");
        }
        if (selectedScreen === 2) {
            // Validar que el nombre tenga al menos 2 caracteres
            if (datosMayor.nombre.length < 1 && regex.test(datosMayor.nombre)) {
                return ("El nombre debe tener al menos 2 caracteres.");
            }
            if (datosMayor.apellido.length < 1 && regex.test(datosMayor.apellido)) {
                return ("El apellido debe tener al menos 2 caracteres.");
            }
            if ((datosMayor.telefono).toString().length < 7) {
                return ("El telefono debe tener al menos 9 números.");
            }
            if (datosMayor.correoElectronico.length < 11 || !datosMayor.correoElectronico.includes('@')) {
                return ("El correo electrónico debe tener al menos 11 caracteres y contener '@'.");
            }
            if ((datosMayor.dni).toString().length != 8) {
                return ("El DNI debe tener al menos 8 números.");
            }
            if (datosMayor.pais.length < 1 && regex.test(datosMayor.pais)) {
                return ("El país debe tener al menos 2 caracteres.");
            }
            if (datosMayor.provincia.length < 1 && regex.test(datosMayor.provincia)) {
                return ("La provincia debe tener al menos 2 caracteres.");
            }
            if (datosMayor.localidad.length < 1 && regex.test(datosMayor.localidad)) {
                return ("La localidad debe tener al menos 2 caracteres.");
            }
            if (datosMayor.calle.length < 1 && regex.test(datosMayor.calle)) {
                return ("La calle debe tener al menos 2 caracteres.");
            }
            if (!datosMayor.numero) {
                return ("El número debe tener al menos 1 número.");
            }
        }


        return ""
    } */
    //region validate 
    async function validatealumnoDetails() {
        const { nombre, apellido, dni, pais, provincia, localidad, calle, numero } = datosMenor || {};
        const { nombre: nombreM, apellido: apellidoM, telefono: telefonoM, correoElectronico: correoElelctronicoM, dni: dniM,
            pais: paisM, provincia: provinciaM, localidad: localidadM, calle: calleM, numero: numeroM } = datosMayor || {};

        //validar que el nombre sea de al menos 2 caracteres y no contenga números
        let resultValidate;
        if (selectedScreen === 0 && selectedCursosId.length === 0) return "Debe seleccionar al menos un taller";
        if (selectedScreen === 0 && selectedCursosId.some(id => cursosYaInscriptosId.includes(id))) {
            return "Ya se encuentra inscripto en uno de los talleres seleccionados (sus talleres: " + cursosYaInscriptosName.join(", ")+").";
        }
        if (selectedScreen === 1) {
            resultValidate = validateNombre(nombre);
            if (resultValidate) return resultValidate;

            resultValidate = validateApellido(apellido);
            if (resultValidate) return resultValidate;

            resultValidate = validateDni(String(dni));
            if (resultValidate) return resultValidate;
            console.log(JSON.stringify(datosMayor))
            console.log(JSON.stringify(datosMayorCopia))
            resultValidate = validateDireccion(pais, provincia, localidad, String(calle), Number(numero));
            if (resultValidate) return resultValidate

            if (JSON.stringify(datosMenor) !== JSON.stringify(datosMenorCopia)) {
                return "Los datos del alumno no son los mismos que los registrados en el sistema";
            }
        }
        if (selectedScreen === 2) {
            resultValidate = validateNombre(nombreM);
            if (resultValidate) return resultValidate;

            resultValidate = validateApellido(apellidoM);
            if (resultValidate) return resultValidate;

            resultValidate = validateEmail(correoElelctronicoM);
            if (resultValidate) return resultValidate;

            resultValidate = validateDni(String(dni));
            if (resultValidate) return resultValidate;

            if (!telefonoM ) {
                return "El teléfono no puede estar vacío";
            }
            resultValidate = validatePhoneNumber(String(telefonoM));
            if (resultValidate) return resultValidate;
            resultValidate = validateDireccion(paisM, provinciaM, localidadM, String(calleM), Number(numeroM));
            if (resultValidate) return resultValidate

            console.log(JSON.stringify(datosMayor))
            console.log(JSON.stringify(datosMayorCopia))
            if(datosMayorCopia.nombre && datosMayorCopia.apellido && datosMayorCopia.correoElectronico &&
                datosMayorCopia.telefono && datosMayorCopia.pais && datosMayorCopia.provincia && 
                datosMayorCopia.localidad && datosMayorCopia.calle && datosMayorCopia.numero && datosMayorCopia.dni
            ){
                if (JSON.stringify(datosMayor) !== JSON.stringify(datosMayorCopia)) {
                    return "Los datos del responsable no son los mismos que los registrados en el sistema";
                }
            }
        }
        return "";
    }

    async function continuar() {

        if (selectedScreen === 0 && selectedCursosId.length === 0) return setError("Debe seleccionar al menos un taller");
        const err = await validatealumnoDetails();
        if (err != "") return setError(err);
        setSelectedScreen(selectedScreen + 1)
    }
    //carga de datos post confirmación
    async function cargarSolicitud() {
        if (datosReglamentacion.firma.length < 1 && selectedScreen === 3) return setError("Debe firmar la reglamentación");
        //crear solicitud
        const solicitud = await createSolicitud()

        //crear ubicaciones del menor
        const pais = await addPais({ "nombre": datosMenor.pais })
        const provincia = await addProvincias({ "nombre": datosMenor.provincia, "nacionalidadId": pais.id })
        const localidad = await addLocalidad({ "nombre": datosMenor.localidad, "provinciaId": provincia.id })
        const direccion = await addDireccion({ "calle": datosMenor.calle, "numero": datosMenor.numero, "localidadId": localidad.id })

        //alumno que pudo ser actualizado
        const newAlumno = {
            Id: Number(user?.id),
            nombre: datosMenor.nombre,
            apellido: datosMenor.apellido,
            dni: datosMenor.dni,
            email: user.email,
            direccionId: direccion.id,
        }

        await updateAlumno(Number(newAlumno.Id), newAlumno)

        //console.log("ALUMNO::::", alumno)
        //crear ubicaciones del mayor/responsable
        const paisMayor = await addPais({ "nombre": datosMayor.pais })
        const provinciaMayor = await addProvincias({ "nombre": datosMayor.provincia, "nacionalidadId": paisMayor.id })
        const localidadMayor = await addLocalidad({ "nombre": datosMayor.localidad, "provinciaId": provinciaMayor.id })
        const direccionMayor = await addDireccion({ "calle": datosMayor.calle, "numero": datosMayor.numero, "localidadId": localidadMayor.id })

        //crear responsable del menor
        const alumno = await createResponsable({
            alumnoId: Number(user?.id),
            nombre: datosMayor.nombre,
            apellido: datosMayor.apellido,
            dni: datosMayor.dni,
            email: datosMayor.correoElectronico,
            telefono: String(datosMayor.telefono),
            direccionId: direccionMayor.id,
        })

        //console.log("RESPONSABLE::::", responsable)

        //si alumno es un string es un error
        if (typeof alumno === "string") return setError(alumno)

        //crear solicitud menor
        await createSolicitudMenores({
            solicitudId: solicitud.id,
            alumnoId: Number(user?.id),
            enfermedad: datosSalud.enfermedad,
            alergia: datosSalud.alergia,
            medicacion: datosSalud.tratamiento,
            terapia: datosSalud.terapia,
            especialista: datosSalud.consultasEspecialistas,
            motivoAsistencia: datosSalud.motivoInscripcion,
            firmaUsoImagenes: datosAutorizacionImage.firma.length > 0 ? `${user?.nombre} ${user?.apellido}` : "",
            observacionesUsoImagenes: datosAutorizacionImage.observaciones,
            firmaSalidas: datosAutorizacionSalidas.firma.length > 0 ? `${user?.nombre} ${user?.apellido}` : "",
            observacionesSalidas: datosAutorizacionSalidas.observaciones,
            firmaReglamento: datosReglamentacion.firma
        })


        //console.log("SOLIMenor::::", soliMenor)
        //        console.log("X:::::",x)
        //crear curso solicitud y alumno_curso
        for (let i = 0; i < selectedCursosId.length; i++) {
            await createCursoSolicitud({
                "cursoId": selectedCursosId[i],
                "solicitudId": solicitud.id,
            })
            await createAlumno_Curso({
                "alumnoId": Number(user?.id),
                "cursoId": selectedCursosId[i],
            })
        }
        setCorrecto(false)
        setVerifi(false)
        window.location.href = "/usuario/principal"

    }
    return (

        <main>
            <Navigate />

            <div id='miDiv' style={{ height: (selectedScreen < 6 ? '70vh' : 'auto') }}>
                {selectedScreen === 0 && (
                    user ? (
                        <SeleccionTaller
                            edad={calcularEdad(user.fechaNacimiento)}
                            setSelectedCursosId={setSelectedCursosId}
                            selectedCursosId={selectedCursosId}
                        />
                    ) : (
                        <div>Cargando...</div>
                    )
                )}
                {selectedScreen === 1 && (
                    <DatosMenor
                        datosMenor={datosMenor}
                        setDatosMenor={setDatosMenor}
                    />
                )}
                {selectedScreen === 2 && (
                    <DatosMayor
                        setDatosMayor={setDatosMayor}
                        datosMayor={datosMayor}
                        setError={setError}
                    />
                )}
                {selectedScreen === 3 && (
                    <CondicionSalud
                        setDatosSalud={setDatosSalud}
                    />
                )}
                {selectedScreen === 4 && (
                    <AutorizacionImg
                        setDatosAutorizacionImage={setDatosAutorizacionImage}
                    />
                )}
                {selectedScreen === 5 && (
                    <AutorizacionSalidas
                        setDatosAutorizacionSalidas={setDatosAutorizacionSalidas}
                    />
                )}
                {selectedScreen === 6 && (
                    <Reglamentacion
                        setDatosReglamentacion={setDatosReglamentacion}
                    />
                )}
            </div>

            {selectedScreen < 6 && (
                <div className='p-5 w-full'>
                    <div className='flex mb-5 justify-center space-x-80'>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-6'
                            onClick={() => {
                                selectedScreen - 1 < 0
                                    ? window.location.href = `${window.location.origin}/usuario/Solicitud/Inscripcion`
                                    : setSelectedScreen(selectedScreen - 1);
                            }}
                        >
                            Volver
                        </button>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-4'
                            onClick={() => continuar()}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            {selectedScreen === 6 && (
                <div className='p-5 w-full'>
                    <div className='flex mb-5 justify-center space-x-80'>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-5'
                            onClick={() => setSelectedScreen(selectedScreen - 1)}
                        >
                            Volver
                        </button>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-5'
                            onClick={() => {
                                if (datosReglamentacion.firma.length < 1 && selectedScreen === 6) return setError("Debe firmar la reglamentación");
                                setVerificarEmail(true)
                            }}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
            {verificarEmail && <div className=' absolute bg-slate-100 rounded-md shadow-md px-2 left-1/2 top-1/2 tranform -translate-x-1/2 -translate-y-1/2'>
                <button className='absolute top-2 right-2' onClick={() => setVerificarEmail(false)}>X</button>
                <EmailPage email={user.email} setVerifi={setVerifi} setCorrecto={setCorrecto} correcto={correcto} />
            </div>}

            {verifi && (correcto ?
                (<h1 className=' absolute top-1/2 text-xl font-semibold' style={{ color: "green" }}>Se ha enviado la solicitud de inscripción correctamente!</h1>)
                :
                (<h1 className=' absolute top-1/2 text-xl font-semibold' style={{ color: "red" }}>No se pudo generar la solicitud de inscripción!</h1>)
            )}
            {error != '' && <div className="absolute top-1/2 right-1/3 transform -translate-x-1/3 -translate-y-1/4 bg-white border p-4 rounded-md shadow-md w-96">
                <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        onClick={() => setError('')}
                    >
                        Cerrar
                    </button>
                </div>
            </div>}

            <div className=" w-full mt-40" >
                <But_aside />
            </div>
        </main>
    )
}
export default Menores;