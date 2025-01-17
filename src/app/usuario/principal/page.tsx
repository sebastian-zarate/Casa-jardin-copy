"use client";
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/alumno/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { autorizarUser, fetchUserData } from "@/helpers/cookies";
import withAuthUser from "../../../components/alumno/userAuth";
import { useRouter } from "next/navigation";
import { ChevronRight, Clipboard, Book, CalendarDays, UserCircle } from "lucide-react";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";

const Principal: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const authorizeAndFetchData = async () => {
      await autorizarUser(router);
      const user = await fetchUserData();
      if (user) {
        setUserName(`${user.nombre} ${user.apellido}`);
      }
    };

    authorizeAndFetchData();
  }, [router]);

  return (
    <main
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${Background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Navegación */}
      <Navigate />

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow bg-white/50 p-6">
        {/* Mensaje de bienvenida */}
        <div className="mt-16 text-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
            Bienvenido de regreso, {userName}
          </h1>
        </div>

        {/* Opciones principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-10">
          {[
            {
              icon: UserCircle,
              title: "Mi Cuenta",
              description: "Accede a la información de tu cuenta.",
              link: "/usuario/Cuenta",
            },
            {
              icon: Book,
              title: "Mis Cursos",
              description: "Consulta los cursos en los que estás inscrito.",
              link: "/usuario/Cursos",
            },  
            {
              icon: CalendarDays,
              title: "Calendario",
              description: "Revisa las fechas importantes y actividades.",
              link: "/usuario/Cronograma",
            },
            {
              icon: Clipboard,
              title: "Solicitud de Inscripción",
              description: "Realiza nuevas solicitudes de inscripción.",
              link: "/usuario/Solicitud/Inscripcion",
            },
          ].map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                <section.icon className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <p className="text-sm text-gray-600">{section.description}</p>
              <a
                href={section.link}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
              >
                Ir a {section.title}
                <ChevronRight className="w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Botón fijo en la parte inferior */}
      <div
        className="fixed bottom-0 py-2 border-t w-full z-30"
        style={{ background: "#EF4444" }}
      >
        <But_aside />
      </div>
    </main>
  )
}  
export default withAuthUser(Principal);
