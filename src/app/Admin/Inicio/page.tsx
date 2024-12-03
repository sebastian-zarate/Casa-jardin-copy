"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigate from "../../../components/Admin/navigate/page"; // Ajusta la ruta según tu estructura de carpetas
import Image from "next/image";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg"; // Ajusta la ruta según tu estructura de carpetas
import withAuth from "../../../components/Admin/adminAuth";
import { getCursos } from "@/services/cursos";
import { getSolicitudes } from "@/services/Solicitud/Solicitud";
import { getAlumnos } from "@/services/Alumno";
import { getProfesionales } from "@/services/profesional";
import { ZoomIn, Blocks, Laptop, ListEnd, ChevronRight, Clipboard, Book, GraduationCap, Users, Brush, CheckSquare } from 'lucide-react';

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
    setCantTalleres(talleres.length);
    let solicitudes = await getSolicitudes();
    solicitudes = solicitudes.filter((solicitud) => solicitud.leida === false);
    setCantSolicitudes(solicitudes.length);
    const alumnos = await getAlumnos()
    setCantAlumnos(alumnos.length);
    const profesores = await getProfesionales();
    setCantProfesores(profesores.length);
    //console.log(talleres, solicitudes, alumnos, profesores);
    setLoading(true);
  }

  return (
    <main className="relative min-h-screen w-screen">
      <Navigate />
      <div className="fixed inset-0 z-[-1]">
        <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
      </div>
      <section
        className=" justify-center items-center flex py-20 "
      >
        <div className="container relative">
          <h2 className="mb-8 max-w-screen-sm text-balance text-2xl font-semibold lg:text-4xl">
            ¡Bienvenido de nuevo! Estamos listos para seguir construyendo juntos.
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
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
                description: `${cantProfesores} profesionales de la academia`,
                link: "/Admin/profesionales",
              },
              {
                icon: CheckSquare,
                title: "Solicitudes",
                description: `${cantSolicitudes} pendientes de revisión`,
                link: "/Admin/solicitudes",
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
            ))}
          </div>
        </div>
      </section>



    </main>
  );
};

export default withAuth(Inicio); 
