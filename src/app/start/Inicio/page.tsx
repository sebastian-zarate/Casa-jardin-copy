"use client";
// #region Imports
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/start/navigate/page";
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import childStartImage from "../../../../public/Images/childStarImage.jpg";
import goalSectionStartImage from "../../../../public/Images/goalSectionStartImage.jpg";
import { getImages_procesoInscrip, getImages_talleresAdmin } from "@/services/repoImage";
import Logo from "../../../../public/Images/LogoCasaJardin.png";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";
import { mapearImagenes } from "@/helpers/repoImages";
import Carrusel from "./carrusel";


const RotatingImages: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [downloadurls, setDownloadurls] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rotationInterval = 3000; // Tiempo en milisegundos para rotación automática (3 segundos)

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    // Configurar el temporizador para rotación automática
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, rotationInterval);

    // Limpiar el temporizador al desmontar el componente
    return () => clearInterval(intervalId);
  }, [images]);

  const fetchImages = async () => {
    const result = await getImages_talleresAdmin();
    if (result.images) {
      setImages(result.images);
      setDownloadurls(result.downloadurls);
    }
  };

  return (
    <div className="w-full h-60 flex items-center justify-center overflow-hidden">
      {downloadurls.length > 0 && (
        <Image
          src={downloadurls[currentImageIndex]}
          alt="Rotating Banner"
          layout="fill"
          objectFit="cover"
          quality={80}
          priority={true}
          className="z-0"
        />
      )}
    </div>
  );
};
// Constante de inicio utilizando el Navigate y But_aside
const Inicio = () => {
  const [cursos, setCursos] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [downloadurls, setDownloadurls] = useState<any[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Método para obtener las imagenes
  const fetchImages = async () => {
    const result = await getImages_procesoInscrip();
    console.log(result.images, "LAS IMAGENESSSSS");
    console.log(result.downloadurls, "LOS DOWNLOADURLS");
    if (result.error) {
      setErrorMessage(result.error);
    } else {
      console.log(result);
      setImages(result.images);
      setDownloadurls(result.downloadurls);

      // Mapear las imágenes con los cursos
      const updatedCursos = mapearImagenes(cursos, { images: result.images, downloadurls: result.downloadurls });

      // Ordenar los cursos alfabéticamente por nombre
      updatedCursos.sort((a, b) => a.nombre.localeCompare(b.nombre));

      // Actualiza el estado de los cursos
      setCursos(updatedCursos);

      // Marcar las imágenes como cargadas
      setImagesLoaded(true);

      // Hacer un console.log de las imageUrl después de actualizar el estado
      updatedCursos.forEach((curso) => {
        if (curso.imageUrl) {
          console.log(`Curso: ${curso.nombre}, Image URL: ${curso.imageUrl}`);
        }
      });
    }
  };
  return (
    <main className="relative min-h-screen">
      {/* Fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={Background}
          alt="Fondo de la academia"
          layout="fill"
          objectFit="cover"
          quality={80}
          priority={true}
        />
      </div>
      {/* Navegación fija */}
      <div className="fixed top-0 w-full z-50">
        <Navigate />
      </div>

      {/* Banner de imágenes */}
      <div className="relative  z-30 mt-16"> {/* mt-16 para dar espacio al Navigate */}
        <RotatingImages />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center mt-10 px-4">
        {/*         <div className="flex items-center p-4 justify-around  bg-white rounded-lg shadow-lg  h-full mt-10">
          <div>
            <h1
              className="text-3xl text-black text-center"
              style={{ fontFamily: "Cursive", color: "#000000" }}
            >
              Bienvenidos a Casa Jardin
            </h1>
            <h2
              className="max-w-2xl text-center mt-6 text-base leading-relaxed text-gray-800"
              style={{ fontFamily: "Cursive" }}
            >
              ¡Bienvenidos a Casa Jardin, un espacio para Aprender, Crear y Crecer!
              <br />
              <br />
              En nuestra academia, creemos que el aprendizaje no tiene límites de edad.
              Por eso, hemos diseñado un lugar donde personas de todas las generaciones,
              desde los más pequeños hasta adultos, pueden desarrollar nuevas habilidades,
              descubrir sus talentos y explorar su creatividad.
              <br />
              <br />
              Nuestro objetivo es ofrecer un entorno inclusivo y acogedor donde cada
              estudiante se sienta inspirado para alcanzar su máximo potencial. Ya sea
              que busques explorar un nuevo pasatiempo, mejorar tus habilidades o
              disfrutar de un espacio creativo, aquí encontrarás una comunidad apasionada
              y comprometida contigo.
              <br />
              <br />
              ¡Únete a nosotros y forma parte de esta experiencia de aprendizaje única!
            </h2>
          </div>
          <img src="" alt="" />
        </div> */}
        <section className="py-42 w-2/3 ">
          <div className="container">
            <div className="grid items-center gap-8 lg:grid-cols-2 shadow-lg rounded-lg p-2">
              <div className="flex flex-col p-2 items-center text-center lg:items-start lg:text-left">
                <div
                  className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                  Qué somos?<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    className="lucide lucide-arrow-down-right ml-2 size-4">
                    <path d="m7 7 10 10"></path>
                    <path d="M17 7v10H7"></path>
                  </svg>
                </div>
                <h1 className="my-2 mb-4 p-2 text-pretty text-4xl font-bold lg:text-6xl">Bienvenidos a Casa Jardin</h1>
                <p className="mb-8 max-w-xl text-zinc-600 lg:text-xl py-2 px-6">
                  ¡Bienvenidos a Casa Jardin, un espacio para Aprender, Crear y Crecer!
                  <br />
                  <br />
                  En nuestra academia, creemos que el aprendizaje no tiene límites de edad.
                  Por eso, hemos diseñado un lugar donde personas de todas las generaciones,
                  desde los más pequeños hasta adultos, pueden desarrollar nuevas habilidades,
                  descubrir sus talentos y explorar su creatividad.
                </p>

              </div>
              <Image className="max-h-96 w-full rounded-md object-cover" src={childStartImage} alt="childStart" width={500} height={400} />
            </div>
          </div>
        </section>
        <section className="w-full sm:w-2/3 mx-auto md:w-2/3">
          <div className="mx-auto bg-blue-200 shadow-lg rounded-lg max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ">
            <div className="ml-5 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 md:items-center md:gap-8">
              <div className="md:col-span-1 mb-8 md:mb-0">
              <div className="max-w-lg md:max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl">
                Compartiendo una misma meta
                </h2>
                <p className="mt-4 text-gray-600 lg:text-lg">
                Nuestro objetivo es ofrecer un entorno inclusivo y acogedor donde cada estudiante
                se sienta inspirado para alcanzar su máximo potencial. Ya sea que busques explorar un
                nuevo pasatiempo, mejorar tus habilidades o disfrutar de un espacio creativo, aquí
                encontrarás una comunidad apasionada y comprometida contigo.
                </p>
              </div>
              </div>
              <div className="md:col-span-1 lg:ml-40 lg:col-span-3 mt-8 md:mt-0">
              <Image className="max-h-96 lg:ml-5 xl:ml-15 md:ml-0 sm:ml-0 rounded-md object-cover" src={goalSectionStartImage} alt="goalChild" width={500} height={400} />
              </div>
            </div>
          </div>
        </section>


        <div className="lg:flex md:flex sm:flex-col justify-center items-center lg:justify-around p-2  bg-slate-100 rounded-lg shadow-lg w-2/3 h-full mt-10">
          <div className=" flex flex-col p-4">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Pasos a seguir para registrarse:</h1>
            <h2 className="mb-8 max-w-xl text-zinc-600 lg:text-xl">¡Únete a nosotros y forma parte de esta experiencia única!</h2>
          </div>
          <Carrusel />
        </div>

      </div>

      {/* Recordatorio colocado arriba */}
      <div className="w-full z-40 mb-20 translate-y-2 bg-yellow-100  text-yellow-700 p-4 text-center mt-4 shadow-md">
        <p className="text-lg">
          Nota: Para aprovechar al máximo nuestra plataforma, recuerda{" "}
          <span className="font-semibold">iniciar sesión</span> o{" "}
          <span className="font-semibold">registrarte</span> utilizando el botón "Ingresar" en la parte superior derecha.
        </p>
      </div>


      {/* Botón de navegación adicional */}
      <div
        className="fixed  bottom-0 py-0.1 border-t w-full z-30"
        style={{ opacity: 0.89, background: "#3f8df5" }}
      >
        <But_aside />
      </div>
    </main>
  );
};

export default Inicio;