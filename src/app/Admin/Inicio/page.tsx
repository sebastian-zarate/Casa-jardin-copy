"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigate from "../../../components/Admin/navigate/page"; // Ajusta la ruta según tu estructura de carpetas
import Image from "next/image";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg"; // Ajusta la ruta según tu estructura de carpetas
import withAuth from "../../../components/Admin/adminAuth";
import { getCantCursosActivos, getCursos } from "@/services/cursos";
import { getSolicitudes } from "@/services/Solicitud/Solicitud";
import { getCantAlumnosInscriptos } from "@/services/alumno_curso";
import { getCantProfesionalesActivos } from "@/services/profesional_curso";
//para front
import { DashboardCard } from "@/components/varios/DashboardCard";
import { ZoomIn, Blocks, Laptop, ListEnd, ChevronRight, Clipboard, Book, GraduationCap, Users, Brush, CheckSquare, Calendar, Apple} from 'lucide-react';

const Inicio: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado de carga
  const [cantTalleres, setCantTalleres] = useState(0); // Estado de cantidad de talleres
  const [cantSolicitudes, setCantSolicitudes] = useState(0); // Estado de cantidad de solicitudes
  const [cantAlumnos, setCantAlumnos] = useState(0); // Estado de cantidad de alumnos
  const [cantProfesores, setCantProfesores] = useState(0); // Estado de cantidad de profesores

  useEffect(() => {
    // Lógica para obtener la cantidad de talleres, solicitudes, alumnos y profesores
    if (!loading) getCantidades();

  }, []);
  const getCantidades = async () => {
    // Lógica para obtener la cantidad de talleres, solicitudes, alumnos y profesores
    const talleres = await getCursos();
    const talleresActivos = await getCantCursosActivos();
    setCantTalleres(talleresActivos);
    let solicitudes = await getSolicitudes();
    solicitudes = solicitudes.filter((solicitud) => solicitud.leida === false);
    setCantSolicitudes(solicitudes.length);
/*     const alumnos = await getAlumnos()
    setCantAlumnos(alumnos.length); */
    const alumnos = await getCantAlumnosInscriptos();
    setCantAlumnos(alumnos);
    const profesores = await getCantProfesionalesActivos();
    setCantProfesores(profesores);
    //console.log(talleres, solicitudes, alumnos, profesores);
    setLoading(true);
  }

  const handleNavigation = (route: string) => {
    const basePath = "/Admin";
    router.push(`${basePath}${route}`);
  };

  return (
    <main className="relative min-h-screen w-full">
      <Navigate />
      <div className="fixed inset-0 z-[-1]">
        <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
      </div>
      <section
        className=" justify-center items-center flex py-20 "
      >
        <div className="container relative px-4 ">
            <h2 className="mb-8 xl:w-1/2 text-center text-balance text-2xl font-semibold lg:text-4xl">
            ¡Bienvenido de nuevo! Estamos listos para seguir construyendo juntos.
            </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Talleres"
            description={`${cantTalleres} talleres activos`}
            icon={GraduationCap}
            onClick={() => handleNavigation('/cursos')}
            gradient="bg-gradient-to-br from-sky-700 to-sky-500"
          />
          <DashboardCard
            title="Alumnos"
            description={`${cantAlumnos} alumnos inscriptos`}
            icon={Users}
            onClick={() => handleNavigation('/alumnos')}
            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
          />
          <DashboardCard
            title="Profesionales"
            description={`${cantProfesores} profesionales registrados`}
            icon={Apple}
            onClick={() => handleNavigation('/profesionales')}
            gradient="bg-gradient-to-br from-yellow-500 to-orange-600"
          />
          <DashboardCard
            title="Solicitudes"
            description={`${cantSolicitudes} solicitudes pendientes`}
            icon={CheckSquare}
            onClick={() => handleNavigation('/Solicitudes')}
            gradient="bg-gradient-to-br from-red-500 to-rose-600"
          />
          <DashboardCard
            title="Cronograma"
            description="Revisa el cronograma de talleres"
            icon={Calendar}
            onClick={() => handleNavigation('/aulaSelector')}
            gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
          />    
            {/* {[
              {
                icon: Brush,
                title: "Talleres",
                description: `${cantTalleres} talleres activos`,
                link: "/Admin/cursos",
              },
              {
                icon: Users,
                title: "Alumnos",
                description: `${cantAlumnos} alumnos inscriptos`,
                link: "/Admin/alumnos",
              },
              {
                icon: Clipboard,
                title: "Profesionales",
                description: `${cantProfesores} profesionales activos`,
                link: "/Admin/profesionales",
              },
              {
                icon: CheckSquare,
                title: "Solicitudes",
                description: `${cantSolicitudes} pendientes de revisión`,
                link: "/Admin/Solicitudes",
              },

            ].map((block, index) => (
              <div key={index} className="flex flex-col gap-10 rounded-lg border bg-white p-8">
                <div>
                  <block.icon className="z-30 w-5" />
                  <h3 className="mb-2 mt-6 font-medium">{block.title}</h3>
                  <p className="text-sm text-zinc-600">{block.description}</p>
                </div>
                <a href={block.link} className="flex items-center gap-2 text-sm font-medium">
                  Saber más
                  <ChevronRight className="w-4" />
                </a>
              </div>
            ))} */}
          </div>
        </div>
      </section>



    </main>
  );
};

export default withAuth(Inicio); 