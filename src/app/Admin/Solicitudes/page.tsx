"use client"
import { getAllSolicitudesMayores, SolicitudMayor } from "@/services/Solicitud/SolicitudMayor";
import Image from "next/image";
import { useEffect, useState } from "react";
//import Background from "../../../../public/Images/Background.jpeg"
import Navigate from "@/components/Admin/navigate/page";
import adultos from "../../../../public/Images/Mayores.jpg";
import menores from "../../../../public/Images/menores.jpg";
import { deleteSolicitud, getAllSolicitudes, getPersonasSoli, getPersonasSoli2, getSolicitudById, Solicitud, updateSolicitud } from "@/services/Solicitud/Solicitud";
import { getAlumnoById } from "@/services/Alumno";
import { getAllSolicitudesMenores, SolicitudMenores } from "@/services/Solicitud/SolicitudMenor";
import { Alumno } from "@prisma/client";
import { getDireccionCompleta } from "@/services/ubicacion/direccion";
import { getResponsableByAlumnoId } from "@/services/responsable";
import { emailTest } from "@/helpers/email";
import { emailRechazo } from "@/helpers/emailRechazoSoli";
import withAuth from "@/components/Admin/adminAuth";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";


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
        //const [dataMa, dataMe] = await getPersonasSoli2(solicitudesMayores, solicitudMenores); 
        setSolicitudes(soli);
        setSolicitudesMayores(dataMa);
        setSolicitudesMenores(dataMe);

        const [alumnosMayores, alumnosMenores, responsablesMenores] = await getPersonasSoli(dataMa, dataMe);

            console.log("ALUMNOSMAYORES", alumnosMayores)
            console.log("ALUMNOSMENORES", alumnosMenores)
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
        console.log("Rechazo",correo);
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
        <main
       
        >
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
            <div className="fixed flex justify-between w-full p-4 bg-sky-600">
                <Navigate />
            </div>

            <h1 className="absolute text-3xl text-gray-800" style={{fontFamily: "Cursive", top:"25%", left:"50%", transform: "translate(-50%, -50%)"}}>Solicitudes</h1>
            
            <div className="absolute top-60 w-1/2 max-h-90 border p-3 rounded shadow-md bg-sky-600" style={{ height: '42vh',  fontFamily:"Cursive", left:"25%", opacity: 0.77}}>
                <div className="flex items-center p-5 mb-3 border rounded cursor-pointer  hover:bg-gray-400" onClick={() => setHabilitarMayores(!habilitarMayores)}>
                    <Image src={adultos} alt="adultos" width={180} height={100} />
                    <h1 className="ml-4 text-white">Solicitudes Mayores</h1>
                </div>
                
                <div className="flex items-center p-5 border rounded cursor-pointer hover:bg-gray-400" onClick={() => setHabilitarMenores(!habilitarMenores)}>
                    <Image src={menores} alt="menores" width={180} height={100} />
                    <h1 className="ml-4 text-white">Solicitudes Menores</h1>
                </div>
            </div>
    
            {habilitarMayores && (
                <div className="absolute p-6 rounded shadow-md bg-white w-1/2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ height: '70vh', overflow: 'auto', fontFamily:"Cursive"}}>
                    <h1 className="text-center mb-4">Historial de solicitudes</h1>
                    <button className="absolute top-2 right-2 p-1" onClick={() => setHabilitarMayores(!habilitarMayores)}>X</button>
                    
                    <div className="p-4 space-y-4">
                        {solicitudesMayores.map((solicitudMay, key) => (
                            <div key={key} className="p-4 rounded cursor-pointer space-y-2 bg-sky-600" style={{ color:"white"}}
                                onClick={() => {
                                    setSolicitudSelected(solicitudMay.id);
                                    setFirmaUsoImagenes(String(solicitudMay.firmaUsoImagenes));
                                    setObservacionesUsoImagenes(String(solicitudMay.observacionesUsoImagenes));
                                    setFirmaReglamento(String(solicitudMay.firmaReglamento));
                                }}>
                                <span className="block p-4 space-y-2">Solicitud: {solicitudMay.solicitudId}</span>
                                {solicitudSelected === solicitudMay.id && (
                                    <>
                                        <div className="space-y-2">
                                            <div className="">
                                                <h2 className="font-semibold">Datos del alumno:</h2>
                                                <span className="block">Nombre: {getAl(solicitudMay.alumnoId).nombre} {getAl(solicitudMay.alumnoId)?.apellido}</span>
                                                <span className="block">Teléfono: {getAl(solicitudMay.alumnoId)?.telefono}</span>
                                                <span className="block">Correo: {getAl(solicitudMay.alumnoId)?.email}</span>
                                                <span className="block">DNI: {getAl(solicitudMay.alumnoId)?.dni}</span>
                                                <span className="block">Fecha de Nacimiento: {new Date(getAl(solicitudMay.alumnoId)?.fechaNacimiento).toISOString().split('T')[0]}</span>
                                            </div>
                                            <span className="block">{firmaUsoImagenes.length > 0 ? "Accedió al uso de la imagen" : "No estuvo de acuerdo con el uso de la imagen"}</span>
                                            {observacionesUsoImagenes.length > 0 && <span className="block">Observaciones sobre el uso de imagen: {observacionesUsoImagenes}</span>}
                                            <span className="block">Firmó el reglamento</span>
                                        </div>
                                        <div className="space-x-2 mt-4">
                                            {!getSolicitud(solicitudMay.solicitudId)?.leida && (
                                                <>
                                                    {!getSolicitud(solicitudMay.solicitudId)?.enEspera ? (
                                                        <>
                                                            <button className="p-2 rounded-full bg-gray-600 hover:bg-green-600" onClick={() => handleAceptarSolicitud(solicitudMay.solicitudId)}>Aceptar</button>
                                                            <button className="p-2 rounded-full bg-gray-600 hover:bg-red-600" onClick={() => handleRechazar(solicitudMay.solicitudId, getAl(solicitudMay.alumnoId).email)}>Rechazar</button>
                                                        </>
                                                    ) : (
                                                        <button className="p-2 rounded-sm" onClick={() => handleEliminarSolicitud(solicitudMay.solicitudId)}>Solicitud corregida</button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
{habilitarMenores && (
    <div className="absolute p-6 rounded shadow-md bg-white w-1/2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ height: '70vh', overflow: 'auto', fontFamily:"Cursive"}}>
        <h1 className="text-center mb-4">Historial de solicitudes</h1>
        <button className="absolute top-2 right-2 p-1" onClick={() => setHabilitarMenores(!habilitarMenores)}>X</button>
        
        <div className="bg-sky-600 p-4 space-y-4">
            {solicitudMenores.map((solicitudMen, key) => (
                <div key={key} className="bg-sky-600 p-4 rounded cursor-pointer space-y-2"
                    onClick={() => setSolicitudSelected(solicitudMen.id)}>
                    <span className="block text-white">Solicitud: {solicitudMen.solicitudId}</span>

                    {solicitudSelected === solicitudMen.id && (
                        <>
                            <div className="space-y-4 text-white">
                                <div className="p-2 space-y-2">
                                    <h2 className="font-semibold">Datos del alumno:</h2>
                                    <span className="block">Nombre: {getAl(solicitudMen.alumnoId)?.nombre || ''} {getAl(solicitudMen.alumnoId)?.apellido || ''}</span>
                                    <span className="block">Teléfono: {getAl(solicitudMen.alumnoId)?.telefono}</span>
                                    <span className="block">Correo: {getAl(solicitudMen.alumnoId)?.email}</span>
                                    <span className="block">DNI: {getAl(solicitudMen.alumnoId)?.dni}</span>
                                    <span className="block">Fecha de Nacimiento: {new Date(getAl(solicitudMen.alumnoId)?.fechaNacimiento).toISOString().split('T')[0]}</span>
                                </div>
                                
                                <div className="p-2 space-y-2">
                                    <h2 className="font-semibold">Datos del responsable:</h2>
                                    <span className="block">Nombre: {getResp(solicitudMen.alumnoId)?.nombre} {getResp(solicitudMen.alumnoId)?.apellido}</span>
                                    <span className="block">DNI: {getResp(solicitudMen.alumnoId)?.dni}</span>
                                    <span className="block">Teléfono: {getResp(solicitudMen.alumnoId)?.telefono}</span>
                                    <span className="block">Correo: {getResp(solicitudMen.alumnoId)?.email}</span>
                                </div>

                                <span className="block">{String(solicitudMen.firmaUsoImagenes).length > 0 ? "Accedió al uso de la imagen" : "No estuvo de acuerdo con el uso de la imagen"}</span>
                                {String(solicitudMen.observacionesUsoImagenes).length > 0 && (
                                    <span className="block">Observaciones sobre el uso de imagen: {observacionesUsoImagenes}</span>
                                )}
                                <span className="block">{String(solicitudMen.firmaSalidas).length > 0 ? "Accedió a las salidas" : "No estuvo de acuerdo con las salidas fuera de Casa Jardín"}</span>
                                
                                <h2 className="font-semibold">Datos sobre la salud del menor:</h2>
                                <span className="block">Enfermedad: {solicitudMen.enfermedad}</span>
                                <span className="block">Especialista(s): {solicitudMen.especialista}</span>
                                <span className="block">Medicación: {solicitudMen.medicacion}</span>
                                <span className="block">Terapia: {solicitudMen.terapia}</span>
                                <span className="block">Alergia: {solicitudMen.alergia}</span>
                                <span className="block">Motivo de asistencia a Casa Jardín: {solicitudMen.motivoAsistencia}</span>
                                <span className="block">Firmó el reglamento</span>
                            </div>
                            <div className="space-x-2 mt-4">
                                {!getSolicitud(solicitudMen.solicitudId)?.leida && (
                                    <>
                                        {!getSolicitud(solicitudMen.solicitudId)?.enEspera ? (
                                            <>
                                                <button className="p-2 rounded-full bg-gray-600 hover:bg-green-600" onClick={() => handleAceptarSolicitud(solicitudMen.solicitudId)}>Aceptar</button>
                                                <button className="p-2 rounded-full bg-gray-600 hover:bg-red-600" onClick={() => handleRechazar(solicitudMen.solicitudId, getAl(solicitudMen.alumnoId).email)}>Rechazar</button>
                                            </>
                                        ) : (
                                            <button className="p-2 rounded-full bg-gray-600 hover:bg-green-600" onClick={() => handleEliminarSolicitud(solicitudMen.solicitudId)}>Solicitud corregida</button>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    </div>  
)}

</main>
    );
}
//export default withAuth(solicitudPage);
export default (solicitudPage);