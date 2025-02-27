"use client";
// #region Imports
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/alumno/navigate/page";
import { useRouter } from 'next/navigation';
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";
import { getCursosByIdAlumno } from "@/services/alumno_curso";
import { autorizarUser, fetchUserData } from "@/helpers/cookies";
import withAuthUser from "../../../components/alumno/userAuth";
import NoImage from "../../../../public/Images/default-no-image.png";
import { getImages_talleresAdmin } from "@/services/repoImage";
import { mapearImagenes } from "@/helpers/repoImages";
import Loader from "@/components/Loaders/loading/page";
import TallerCard from "@/components/start/tallerCard";


// #endregion Imports

const MisCursos = () => {
  const [cursos, setCursos] = useState<any[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();


  useEffect(() => {
    const authorizeAndFetchData = async () => {
      try {
        await autorizarUser(router); // Autorizar usuario
        const user = await fetchUserData(); // Obtener datos del usuario

        if (user) {
          setUserName(`${user.nombre} ${user.apellido}`);
          const talleres = await getCursosByIdAlumno(Number(user.id)); // Obtener cursos
          setCursos(talleres);
          fetchImages(talleres); // Obtener imágenes
        } else {
          setErrorMessage("Usuario no autorizado o sesión expirada.");
        }
      } catch (error) {
        console.error("Error al autorizar o cargar datos:", error);
        setErrorMessage("Ocurrió un error al cargar los datos.");
      }
    };

    authorizeAndFetchData();
  }, []);

  const fetchImages = async (talleres: any[]) => {
    try {
      const result = await getImages_talleresAdmin();

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        const updatedCursos = mapearImagenes(talleres, {
          images: result.images,
          downloadurls: result.downloadurls,
        });

        updatedCursos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setCursos(updatedCursos);
        setImagesLoaded(true);
      }
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      setErrorMessage("Ocurrió un error al cargar las imágenes.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main
        className="flex flex-col min-h-screen bg-cover bg-center justify-center items-center"
        style={{
          backgroundImage: `url(${Background.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Navigate />
        <div className="flex flex-col items-center">
          <Loader /> {/* Componente de carga */}
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Navegación fija */}
      <header className="fixed top-0 left-0 w-full z-10 h-[64px] bg-white shadow-md">
        <Navigate />
      </header>

      <main className="relative min-h-screen pb-20 text-gray-600 body-font pt-[64px]">
        {/* Fondo */}
        <div className="fixed inset-0 z-[-1] h-full w-full">
          <Image
            src={Background}
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={80}
            priority={true}
          />
        </div>

        <div className="container px-5 py-14 mx-auto">
          <div className="flex flex-wrap w-full mb-20">
            <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                Tus Talleres
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          {/* Loader o contenido */}
          {loading ? (
            <div className="flex justify-center items-center w-full h-[60vh]">
              <Loader />
            </div>
          ) : cursos.length === 0 ? (
            <p className="text-center text-gray-500">No estás inscripto a ningún curso aún.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
              {cursos.map((curso) => (
                <TallerCard key={curso.id} taller={curso} profesionales={curso.profesionales} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer
        className="pt-1 bottom-0 border-t w-full opacity-90 bg-sky-600"
      >
        <But_aside />
      </footer>
    </>
  );
};

export default withAuthUser(MisCursos);


