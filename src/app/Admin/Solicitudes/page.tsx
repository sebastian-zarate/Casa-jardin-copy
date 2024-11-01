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
import { getAllSolicitudesMenores } from "@/services/Solicitud/SolicitudMenor";


const solicitudPage: React.FC = () => {
    const [solicitudesMayores, setSolicitudesMayores] = useState<SolicitudMayor[]>([]);
    const [solicitudMenores, setSolicitudesMenores] = useState<any[]>([]);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [habilitarMayores, setHabilitarMayores] = useState<boolean>(false);
    const [habilitarMenores, setHabilitarMenores] = useState<boolean>(false);
    const [nombreCompleto, setNombreCompleto] = useState<string>("");
    const [firmaUsoImagenes, setFirmaUsoImagenes] = useState<string>("");
    const [observacionesUsoImagenes, setObservacionesUsoImagenes] = useState<string>("");
    const [firmaReglamento, setFirmaReglamento] = useState<string>("");
    const [solicitudSelected, setSolicitudSelected] = useState<number>(0);

    useEffect(() => {
        if (solicitudesMayores.length === 0) fetchData();
    }, [solicitudesMayores]);
    const fetchData = async () => {
        const dataMa = await getAllSolicitudesMayores();
        const dataMe = await getAllSolicitudesMenores();
        const soli = await getAllSolicitudes();
        setSolicitudes(soli);
        setSolicitudesMayores(dataMa);
        setSolicitudesMenores(dataMe);
    }
    const handleEliminarSolicitud = async (solicitudId: number) => {
        console.log(solicitudMenores);
        const soliElim = await deleteSolicitud(solicitudId);
        console.log(soliElim);
    }

    const handleAceptarSolicitud = async (solicitudId: number) => {
        const soli = await updateSolicitud(solicitudId, { leida: true });
        console.log(soli);
    }
    const handleDatos = async (alumnoId: number, firma: string, observFirma: string, reglam: string, id: number) => {
        const alumno = await getAlumnoById(alumnoId);
        setNombreCompleto(alumno?.nombre + " " + alumno?.apellido);
        setFirmaUsoImagenes(firma);
        setObservacionesUsoImagenes(observFirma);
        setFirmaReglamento(reglam);
        setSolicitudSelected(id);
    }
    const heandleLeida = (solicitudId: number) => {
        const leida = solicitudes.find((solicitud) => solicitud.id === solicitudId);
        console.log(leida);
        return leida;
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

                <div className="flex cursor-pointer p-5 border rounded hover:bg-slate-200" onClick={()=> setHabilitarMenores(!habilitarMenores)}>
                    <Image src={menores} alt="menores" width={180} height={100} />
                    <h1 className="p-3 ">Solicitudes Menores</h1>
                </div>
            </div>
            {habilitarMayores && (
                <div className="absolute  p-4 rounded shadow-md bg-white w-1/2 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ height: '70vh', overflow: "auto" }}>
                    <h1 className="flex justify-center">Historial de solicitudes</h1>
                    <button className="absolute top-1 right-2 p-1" onClick={() => setHabilitarMayores(!habilitarMayores)}>X</button>
                    <div className="bg-green-300 p-4">
                        {solicitudesMayores.map((solicitud, key) => (
                            <div key={key} className="bg-red-400 cursor-pointer"
                                onClick={() => { handleDatos(solicitud.alumnoId, solicitud.firmaUsoImagenes, solicitud.observacionesUsoImagenes, solicitud.firmaReglamento, solicitud.id); }}>
                                <span>Solicitud: {solicitud.solicitudId}</span>
                                { !heandleLeida(solicitud.solicitudId)?.leida && (
                                    <>
                                        <button onClick={() => handleAceptarSolicitud(solicitud.solicitudId)}>Aceptar</button>
                                        <button onClick={() => handleEliminarSolicitud(solicitud.solicitudId)}>Rechazar</button>
                                    </>
                                )}
                                {solicitudSelected === solicitud.id &&
                                    <div>
                                        <span>{nombreCompleto} </span>
                                        <span>{firmaUsoImagenes}</span>
                                        <span>{observacionesUsoImagenes}</span>
                                        <span>{firmaReglamento}</span>
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
                        {solicitudMenores.map((solicitud, key) => (
                            <div key={key} className="bg-red-400 cursor-pointer"
                                onClick={() => { handleDatos(solicitud.alumnoId, solicitud.firmaUsoImagenes, solicitud.observacionesUsoImagenes, solicitud.firmaReglamento, solicitud.id); }}>
                                <span>Solicitud: {solicitud.solicitudId}</span>
                                { !heandleLeida(solicitud.solicitudId)?.leida && (
                                    <>
                                        <button onClick={() => handleAceptarSolicitud(solicitud.solicitudId)}>Aceptar</button>
                                        <button onClick={() => handleEliminarSolicitud(solicitud.solicitudId)}>Rechazar</button>
                                    </>
                                )}
                                {solicitudSelected === solicitud.id &&
                                    <div>
                                        <span>{nombreCompleto}</span>
                                        <span>{firmaUsoImagenes}</span>
                                        <span>{observacionesUsoImagenes}</span>
                                        <span>{firmaReglamento}</span>
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
export default solicitudPage;