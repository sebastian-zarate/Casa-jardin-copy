"use client"
import { getAllSolicitudesMayores, SolicitudMayor } from "@/services/Solicitud/SolicitudMayor";
import Image from "next/image";
import { useEffect, useState } from "react";
import Background from "../../../../public/Images/Background.jpeg"
import Navigate from "@/components/Admin/navigate/page";
import adultos from "../../../../public/Images/adultos.jpg";
import menores from "../../../../public/Images/menores.jpg";
import { deleteSolicitud, getAllSolicitudes, getSolicitudById, Solicitud, updateSolicitud } from "@/services/Solicitud/Solicitud";
import { getAlumnoById } from "@/services/Alumno";
import { getAllSolicitudesMenores, SolicitudMenores } from "@/services/Solicitud/SolicitudMenor";
import { Alumno } from "@prisma/client";
import { getDireccionCompleta } from "@/services/ubicacion/direccion";
import { getResponsableByAlumnoId } from "@/services/responsable";
import { emailTest } from "@/helpers/email";
import { emailRechazo } from "@/helpers/emailRechazoSoli";
import withAuth from "@/components/Admin/adminAuth";


const solicitudPage: React.FC = () => {
    // Estado para almacenar las solicitudes de mayores
    const [solicitudesMayores, setSolicitudesMayores] = useState<SolicitudMayor[]>([]);
    // Estado para almacenar las solicitud de menores
    const [solicitudMenores, setSolicitudesMenores] = useState<SolicitudMenores[]>([]);
    // Estado para almacenar las solicitudes todas
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    // Estado para habilitar solicitudes de mayores
    const [habilitarMayores, setHabilitarMayores] = useState<boolean>(false);
    // Estado para habilitar solicitudes de menores
    const [habilitarMenores, setHabilitarMenores] = useState<boolean>(false);
    //estado para dejar en espera una solicitud
    const [esperaSolicitud, setEsperaSolicitud] = useState<number>(0);

    const [firmaUsoImagenes, setFirmaUsoImagenes] = useState<string>("");
    const [observacionesUsoImagenes, setObservacionesUsoImagenes] = useState<string>("");
    const [firmaReglamento, setFirmaReglamento] = useState<string>("");
    const [solicitudSelected, setSolicitudSelected] = useState<number>(0);

    const [alumnosMayores, setAlumnosMayores] = useState<any[]>()
    const [direccionesMayores, setDireccionesMayores] = useState<any[]>()
    const [alumnosMenores, setAlumnosMenores] = useState<any[]>()
    const [responsables, setResponsables] = useState<any[]>()
    const [direccionesMenores, setDireccionesMenores] = useState<any[]>()



    useEffect(() => {
        const fetchDataIfNeeded = async () => {
            if (solicitudes.length === 0) {
                await fetchData();
                
            }
        };
        fetchDataIfNeeded();
    }, []);

    const fetchData = async () => {

        const [dataMa, dataMe, soli] = await Promise.all([
            getAllSolicitudesMayores(),
            getAllSolicitudesMenores(),
            getAllSolicitudes()
        ]);
        setSolicitudes(soli);
        setSolicitudesMayores(dataMa);
        setSolicitudesMenores(dataMe);

            const [alumnosMayores, alumnosMenores, responsablesMenores] = await Promise.all([
                Promise.all(dataMa.map(async (solicitMay) => {
                    const alumno = await getAlumnoById(solicitMay.alumnoId);
                    return alumno;
                })),
                Promise.all(dataMe.map(async (solicitMen) => {
                    const alumno = await getAlumnoById(solicitMen.alumnoId);
                    return alumno;
                })),
                Promise.all(dataMe.map(async (solicitMen) => {
                    const responsable = await getResponsableByAlumnoId(solicitMen.alumnoId);
                    return responsable;
                }))
            ]);
            /*         const direccionesMenores = await Promise.all(
                        alumnosMenores.map(async (alum) => {
                        return  await getDireccionCompleta(Number(alum?.direccionId));
                        })
                    ) */

            console.log("ALUMNOSMAYORES", alumnosMayores)
            //        console.log("DIRECC",direccionesMayores)
            setAlumnosMayores(alumnosMayores);
            //setDireccionesMayores(direccionesMayores)
            setAlumnosMenores(alumnosMenores)
            setResponsables(responsablesMenores)
            //setDireccionesMenores(direccionesMenores)
        
    }
    const handleEliminarSolicitud = async (solicitudId: number) => {
        //console.log(solicitudMenores);
        await deleteSolicitud(solicitudId);
        //console.log(soliElim);
        fetchData()
    }
    const handleRechazar = async (solicitudId: number, correo: string) => {
        await updateSolicitud(solicitudId, { enEspera: true })
        await emailRechazo(correo);
        fetchData()
    }

    const handleAceptarSolicitud = async (solicitudId: number) => {
        await updateSolicitud(solicitudId, { leida: true });
        // console.log(soli);
        fetchData()
    }

    const getSolicitud = (solicitudId: number) => {
        const sol = solicitudes.find((solicitud) => solicitud.id === solicitudId);
        // console.log(sol);
        return sol;
    }
    const getAl = (id: number) => {
        const alumnoMayor = alumnosMayores?.reduce((acc, alumno) => {
            if (alumno.id === id) {
                return alumno;
            }
            return acc;
        }, null);
        if (!alumnoMayor) {
            return alumnosMenores?.reduce((acc, alumno) => {
                if (alumno.id === id) {
                    return alumno;
                }
                return acc;
            }, null);
        }
        return alumnoMayor
    }
    const getResp = (id: number) => {
        return responsables?.reduce((acc, resp) => {
            if (resp.alumnoId === id) {
                return resp;
            }
            return acc;
        }, null);
    }
    /*
    SolicitudId
    Nombre y apellido alumno
    firmaUsoImagenes
    observacionesUsoImagenes
    firmaReglamento

    */
    return (
        <main>
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
            <div className="fixed justify-between w-full p-4" style={{ background: "#1CABEB" }} >
                <Navigate />
            </div>
            <h1 className="absolute top-40 left-1/3 mb-5 text-3xl" >Solicitudes</h1>
            <div className="top-60 border p-3 absolute left-60 rounded shadow-md max-h-90 w-1/2 bg-white " style={{ height: '40vh' }}>
                <div className="flex p-5 cursor-pointer border mb-3 rounded hover:bg-slate-200" onClick={() => setHabilitarMayores(!habilitarMayores)}>
                    <Image src={adultos} alt="adultos" width={180} height={100} />
                    <h1 className="p-3 ">Solicitudes Mayores</h1>
                </div>

                <div className="flex cursor-pointer p-5 border rounded hover:bg-slate-200" onClick={() => setHabilitarMenores(!habilitarMenores)}>
                    <Image src={menores} alt="menores" width={180} height={100} />
                    <h1 className="p-3 ">Solicitudes Menores</h1>
                </div>
            </div>
            {habilitarMayores && (
                <div className="absolute  p-4 rounded shadow-md bg-white w-1/2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ height: '70vh', overflow: "auto" }}>
                    <h1 className="flex justify-center">Historial de solicitudes</h1>
                    <button className="absolute top-1 right-2 p-1" onClick={() => setHabilitarMayores(!habilitarMayores)}>X</button>
                    <div className="bg-green-300 p-4">
                        {solicitudesMayores.map((solicitudMay, key) => (
                            <div key={key} className="bg-red-400 cursor-pointer"
                                onClick={() => {
                                    setSolicitudSelected(solicitudMay.id); setFirmaUsoImagenes(String(solicitudMay.firmaUsoImagenes));
                                     setObservacionesUsoImagenes(String(solicitudMay.observacionesUsoImagenes)); setFirmaReglamento(String(solicitudMay.firmaReglamento));
                                }}>
                                <span>Solicitud: {solicitudMay.solicitudId}</span>
                                {!getSolicitud(solicitudMay.solicitudId)?.leida && (
                                    <>
                                        {!getSolicitud(solicitudMay.solicitudId)?.enEspera && (
                                            <>
                                                <button onClick={() => handleAceptarSolicitud(solicitudMay.solicitudId)}>Aceptar</button>
                                                <button className=" p-2 rounded-sm" onClick={() => handleRechazar(solicitudMay.solicitudId, getAl(solicitudMay.alumnoId).correoElectronico)}>Rechazar</button>
                                            </>
                                        )}
                                        {getSolicitud(solicitudMay.solicitudId)?.enEspera &&
                                            <button className=" p-2 rounded-sm" onClick={() => handleEliminarSolicitud(solicitudMay.solicitudId)}>Solicitud corregida</button>
                                        }
                                    </>
                                )}
                                {solicitudSelected === solicitudMay.id &&
                                    <div>
                                        <div className="p-2">
                                            <h2>Datos del alumno:</h2>
                                            <span>Nombre: {getAl(solicitudMay.alumnoId).nombre} {getAl(solicitudMay.alumnoId)?.apellido}</span>
                                            <span>Telefono: {getAl(solicitudMay.alumnoId)?.telefono}</span>
                                            <span>Correo: {getAl(solicitudMay.alumnoId)?.correoElectronico}</span>
                                            <span>DNI: {getAl(solicitudMay.alumnoId)?.dni}</span>

                                            <span>Fecha de Nacimiento: {new Date(getAl(solicitudMay.alumnoId)?.fechaNacimiento).toISOString().split('T')[0]}</span>
                                        </div>

                                        <span>{firmaUsoImagenes.length > 0 ? "Accedió al uso de la imagenen" : "No estuvo de acuerdo con el uso de la imagen"}</span>
                                        {observacionesUsoImagenes.length > 0 && <span>Tuvo las siguientes observaciones respecto al uso de Imagen: {observacionesUsoImagenes}</span>}
                                        <span>Firmó el reglamento</span>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {habilitarMenores && (
                <div className="absolute  p-4 rounded shadow-md bg-white w-1/2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ height: '70vh', overflow: "auto" }}>
                    <h1 className="flex justify-center">Historial de solicitudes</h1>
                    <button className="absolute top-1 right-2 p-1" onClick={() => setHabilitarMenores(!habilitarMenores)}>X</button>
                    <div className="bg-green-300 p-4">
                        {solicitudMenores.map((solicitudMen, key) => (
                            <div key={key} className="bg-red-400 cursor-pointer"
                                /* onClick={() => { handleDatos(solicitud.alumnoId, solicitud.firmaUsoImagenes, solicitud.observacionesUsoImagenes, solicitud.firmaReglamento, solicitud.id); }} */
                                onClick={() => setSolicitudSelected(solicitudMen.id)}>
                                <span>Solicitud: {solicitudMen.solicitudId}</span>
                                {!getSolicitud(solicitudMen.solicitudId)?.leida && (
                                    <>
                                        {!getSolicitud(solicitudMen.solicitudId)?.enEspera && (
                                            <>
                                                <button onClick={() => handleAceptarSolicitud(solicitudMen.solicitudId)}>Aceptar</button>
                                                <button className=" p-2 rounded-sm" onClick={() => handleRechazar(solicitudMen.solicitudId, getAl(solicitudMen.alumnoId).correoElectronico)}>Rechazar</button>
                                            </>
                                        )}
                                        {getSolicitud(solicitudMen.solicitudId)?.enEspera &&
                                            <button className=" p-2 rounded-sm" onClick={() => handleEliminarSolicitud(solicitudMen.solicitudId)}>Solicitud corregida</button>
                                        }
                                    </>
                                )}
                                {solicitudSelected === solicitudMen.id &&
                                    <div>
                                        <div className="p-2">
                                            <h2>Datos del alumno:</h2>
                                            <span>Nombre: {getAl(solicitudMen.alumnoId).nombre} {getAl(solicitudMen.alumnoId)?.apellido}</span>
                                            <span>Telefono: {getAl(solicitudMen.alumnoId)?.telefono}</span>
                                            <span>Correo: {getAl(solicitudMen.alumnoId)?.correoElectronico}</span>
                                            <span>DNI: {getAl(solicitudMen.alumnoId)?.dni}</span>
                                            {/*                                <span>Pais: {alumnoSelected?.pais}</span>
                                            <span>Provincia: {alumnoSelected?.provincia}</span>
                                            <span>Localidad: {alumnoSelected?.localidad}</span>
                                            <span>Calle: {alumnoSelected?.calle}</span>
                                            <span>Numero: {alumnoSelected?.numero}</span> */}
                                            <span>Fecha de Nacimiento: {new Date(getAl(solicitudMen.alumnoId)?.fechaNacimiento).toISOString().split('T')[0]}</span>
                                        </div>
                                        <div className="p-2">
                                            <h2>Datos del responsable:</h2>
                                            <span>Nombre: {getResp(solicitudMen.alumnoId)?.nombre} {getResp(solicitudMen.alumnoId)?.apellido}</span>
                                            <span>DNI: {getResp(solicitudMen.alumnoId)?.dni}</span>
                                            <span>Telefono: {getResp(solicitudMen.alumnoId)?.telefono}</span>
                                            <span>Correo: {getResp(solicitudMen.alumnoId)?.email}</span>
                                        </div>
                                        <span>{String(solicitudMen.firmaUsoImagenes) .length > 0 ? "Accedió al uso de la imagenen" : "No estuvo de acuerdo con el uso de la imagen"}</span>
                                        {String(solicitudMen.observacionesUsoImagenes).length > 0 && <span>Tuvo las siguientes observaciones respecto al uso de Imagen: {observacionesUsoImagenes}</span>}
                                        <span>{String(solicitudMen.firmaSalidas) .length > 0 ? "Accedió a las salidas" : "No estuvo de acuerdo con las salidas fuera de Casa Jardín"}</span>
                                        <h1>Datos sobre la salud del menor:</h1>
                                        <span>Enfermedad: {solicitudMen.enfermedad} </span>
                                        <span>Especialista/s: {solicitudMen.especialista} </span>
                                        <span>Medicación:{solicitudMen.medicacion}</span>
                                        <span>Terapia:{solicitudMen.terapia}</span>
                                        <span>Alergia:{solicitudMen.alergia}</span>
                                        <span>Motivo de la asistencia a casa jardín:{solicitudMen.motivoAsistencia}</span>
                                        <span>Firmó el reglamento</span>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}
export default withAuth(solicitudPage);