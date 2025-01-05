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
import { emailTest } from "@/helpers/email/email";
import { emailRechazo } from "@/helpers/email/emailRechazoSoli";
import withAuth from "@/components/Admin/adminAuth";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";
import Loader from "@/components/Loaders/loader/loader";
import { getCursoSolicitudBySoliId } from "@/services/curso_solicitud";
import { createAlumno_Curso } from "@/services/alumno_curso";

//front
import { Smile, Baby, XCircle} from "lucide-react";
import { DashboardCard } from "@/components/varios/DashboardCard";
// para la tabla
import { SolicitudData, createColumns } from "@/components/Admin/solicitudes/column";
import { DataTable } from "@/components/Admin/solicitudes/data-table";
import { create } from "domain";


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

    const [firmaUsoImagenes, setFirmaUsoImagenes] = useState<string>("");
    const [observacionesUsoImagenes, setObservacionesUsoImagenes] = useState<string>("");
    const [firmaReglamento, setFirmaReglamento] = useState<string>("");
    const [solicitudSelected, setSolicitudSelected] = useState<number>(0);

    const [alumnosMayores, setAlumnosMayores] = useState<any[]>()
    const [direccionesMayores, setDireccionesMayores] = useState<any[]>()
    const [alumnosMenores, setAlumnosMenores] = useState<any[]>()
    const [responsables, setResponsables] = useState<any[]>()
    const [direccionesMenores, setDireccionesMenores] = useState<any[]>()
    const [loading, setLoading] = useState<boolean>(true);

    const [soliMayoresNoLeidas, setSoliMayoresNoLeidas] = useState<number>(0);
    const [soliMenoresNoLeidas, setSoliMenoresNoLeidas] = useState<number>(0);

    //para las solicitudes filtradas
    const [filtroMayores, setFiltroMayores] = useState(false);
    const [mayoresFiltradas, setMayoresFiltradas] = useState<number[]>([]);
    const [mayoresColData, setMayoresColData] = useState<SolicitudData[]>([]);

    const [filtroMenores, setFiltroMenores] = useState(false);
    const [menoresFiltradas, setMenoresFiltradas] = useState<number[]>([]);
    const [menoresColData, setMenoresColData] = useState<SolicitudData[]>([])

    const [showSelect, setShowSelect] = useState(false);


    useEffect(() => {
        const fetchDataIfNeeded = async () => {
            setLoading(true);
            if (solicitudes.length === 0) {
                await fetchData();
            }
            
            setLoading(false);
        };
        fetchDataIfNeeded();
    }, []);

    useEffect(() => {

        const solicitudesNoLeidas = solicitudes.filter((solicitud) => !solicitud.leida);
        const soliMayoresNoLeid = solicitudesNoLeidas.filter((solicitud) => solicitudesMayores.some((data) => data.solicitudId === solicitud.id));
        setSoliMayoresNoLeidas(soliMayoresNoLeid.length);
        console.log("soli mayores no leidas: ",soliMayoresNoLeid);
        const soliMenoresNoLeid = solicitudesNoLeidas.filter((solicitud) => solicitudMenores.some((data) => data.solicitudId === solicitud.id));
        setSoliMenoresNoLeidas(soliMenoresNoLeid.length);
        console.log("soli menores no leidas: ",soliMenoresNoLeid);

    }, [solicitudesMayores, solicitudMenores]);

    // Bloquear desplazamiento cuando los modales están activos
    useEffect(() => {
        if (habilitarMayores || habilitarMenores) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [habilitarMayores, habilitarMenores]);

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

        // Seteo inicial de solicitudes filtradas
        const mayoresData = dataMa.map((solicitud) => {
            const solicitudEstado = soli.find((s) => s.id === solicitud.solicitudId);
            const alumno = alumnosMayores.find((a) => a?.id === solicitud.alumnoId)
             
            return {
            codigo: solicitud.solicitudId,
            alumno: alumno ? alumno.nombre + alumno.apellido : "Error: datos no disponibles",
            email: alumno ? alumno.email : "Error: datos no disponibles",
            estado: solicitudEstado?.leida ? "Leída" : "No leída",
            };
        });
        setMayoresColData(mayoresData)

        const menoresData = dataMe.map((solicitud) => {
            const solicitudEstado = soli.find((s) => s.id === solicitud.solicitudId);
            const alumno = alumnosMenores.find((a) => a?.id === solicitud.alumnoId)
             
            return {
            codigo: solicitud.solicitudId,
            alumno: alumno ? alumno.nombre + alumno.apellido : "Error: datos no disponibles",
            email: alumno ? alumno.email : "Error: datos no disponibles",
            estado: solicitudEstado?.leida ? "Leída" : "No leída",
            };
        });
        setMenoresColData(menoresData)


    }
    const handleEliminarSolicitud = async (solicitudId: number) => {
        //console.log(solicitudMenores);
        await deleteSolicitud(solicitudId);
        //console.log(soliElim);
        fetchData()
    }
    const handleRechazar = async (solicitudId: number, correo: string) => {
        console.log("Rechazo", correo);
        await updateSolicitud(solicitudId, { enEspera: true })
        await emailRechazo(correo);
        fetchData()
    }

    const handleAceptarSolicitud = async (solicitudId: number, idAlumno: number) => {
        await updateSolicitud(solicitudId, { leida: true });
        const curso_soli = await getCursoSolicitudBySoliId(solicitudId);
        if (typeof (curso_soli) === "string") return console.log("No se encontraron cursos");
        for (let i = 0; i < curso_soli.length; i++) {
            await createAlumno_Curso({
                "alumnoId": idAlumno,
                "cursoId": (curso_soli[i].cursoId),
            })
        }
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

    //creo las columnas para la tabla (las columnas de acciones)
    const handleVerDetalles = async (solicitudId: number) => {
        setSolicitudSelected(solicitudId);
        setShowSelect(true);
    }

    const handleAcceptSolicitud = async (solicitudId: number) => {
        console.log("aceptar solicitud: ", solicitudId);
    }
    const handleReject = async (solicitudId: number) => {
        console.log("rechazar solicitud: ", solicitudId);
    }
    const columns = createColumns(handleVerDetalles, handleAcceptSolicitud, handleReject);

    //region return
    return (
        <main
            className="relative min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Navegación */}
            <div className="fixed top-0 left-0 right-0 flex justify-between w-full px-4 bg-sky-600 z-50">
                <Navigate />
            </div>
            <div className="fixed inset-0 z-[-1]">
                <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
            </div>
            {/* Contenido principal */}
            {!habilitarMayores && !habilitarMenores && (
                <div className="flex flex-col items-center justify-center min-h-screen relative z-10  ">
                    <div className= "py-2 px-4 justify-center items-center rounded-lg shadow-lg w-4/5 lg:w-1/2 md:w-2/3 sm:w-4/5">
                    <h1 className="text-3xl text-center text-gray-800 my-6">Solicitudes</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DashboardCard
                            title="Solicitudes Mayores"
                            description={soliMayoresNoLeidas > 0 ? `${soliMayoresNoLeidas} solicitudes pendientes` : "No hay solicitudes pendientes"}
                            icon={Smile}
                            onClick={() => setHabilitarMayores(!habilitarMayores)}
                            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                            />
                            <DashboardCard
                            title="Solicitudes Menores"
                            description={soliMenoresNoLeidas > 0 ? `${soliMenoresNoLeidas} solicitudes pendientes` : "No hay solicitudes pendientes"}
                            icon={Baby}
                            onClick={() => setHabilitarMenores(!habilitarMenores)}
                            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modales */}
            {habilitarMayores && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-10">
                    <div className="relative p-6 rounded shadow-md bg-white w-full" style={{ height: '70vh', overflow: 'auto', maxWidth: 'none' }}>
                    <h1 className="text-center mb-4">Historial de solicitudes Mayores</h1>
                    <button className="absolute top-2 right-2 p-1" onClick={() => { setHabilitarMayores(!habilitarMayores); setSolicitudSelected(0) }}>
                        <XCircle className="w-6 h-6 text-gray-800 hover:text-red-500" />
                    </button>
                    <div className="p-4 space-y-4">
                        {loading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <Loader />
                            <h1>Cargando solicitudes</h1>
                        </div>
                        ) : (
                        <div className="container mx-auto py-3 overflow-x-auto">
                                <DataTable columns={columns} data={mayoresColData} />
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {habilitarMenores && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-10">
                    <div className="relative p-6 rounded shadow-md bg-white w-full" style={{ height: '70vh', overflow: 'auto', maxWidth: 'none' }}>
                    <h1 className="text-center mb-4">Historial de solicitudes Menores</h1>
                    <button className="absolute top-2 right-2 p-1" onClick={() => { setHabilitarMenores(!habilitarMenores); setSolicitudSelected(0) }}>
                        <XCircle className="w-6 h-6 text-gray-800 hover:text-red-500" />
                    </button>
                    <div className="p-4 space-y-4">
                        {loading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <Loader />
                            <h1>Cargando solicitudes</h1>
                        </div>
                        ) : (
                        <div className="container mx-auto py-10 overflow-x-auto">
                                <DataTable columns={columns} data={menoresColData} />
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showSelect && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-30">
                    <div className="relative p-6 rounded shadow-md bg-white w-full" style={{ height: '70vh', overflow: 'auto', maxWidth: 'none' }}>
                        <h1 className="text-center mb-4">Detalles de la solicitud</h1>
                        <button className="absolute top-2 right-2 p-1" onClick={() => { setShowSelect(false); setSolicitudSelected(0) }}>
                            <XCircle className="w-6 h-6 text-gray-800 hover:text-red-500" />
                        </button>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">Solicitud ID</h2>
                                    <p>{solicitudSelected}</p>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Alumno</h2>
                                    <p>nombre hardcodeado</p>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Email</h2>
                                    <p>email hardodeado</p>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Firma Uso de Imágenes</h2>
                                    <p>{firmaUsoImagenes}</p>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Observaciones Uso de Imágenes</h2>
                                    <p>{observacionesUsoImagenes}</p>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">Firma Reglamento</h2>
                                    <p>{firmaReglamento}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}
        </main>
    );
};

//export default withAuth(solicitudPage);
export default (solicitudPage);