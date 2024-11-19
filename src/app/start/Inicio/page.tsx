"use client";
// #region Imports
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/start/navigate/page";
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import { getImages_talleresAdmin } from "@/services/repoImage";
import Logo from "../../../../public/Images/LogoCasaJardin.png";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";


const RotatingImages: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [downloadurls, setDownloadurls] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rotationInterval = 3000; // Tiempo en milisegundos para rotación automática (5 segundos)

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

  /*const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };*/

  /*const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };*/

  return (
    <div className= "flex justify-end mr-20 ">
      {downloadurls.length > 0 && (
        <Image
          src={downloadurls[currentImageIndex]}
          alt="Background"
          width={370}
          height={200}
          quality={80}
          priority={true}
          className="z-0 rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

// Constante de inicio utilizando el Navigate y But_aside
const Inicio = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={Background}
          alt="Background"
          layout="fill" // Esto asegura que ocupe todo el contenedor padre
          objectFit="cover" // Ajusta la imagen para cubrir todo el espacio
          quality={80}
          priority={true}
        />
      </div>

      {/* Contenido */}
      <div className="fixed top-0 w-full z-50">
        <Navigate />
        <div
          className="fixed bottom-0 py-5 border-t w-full z-30"
          style={{ opacity: 0.88, background: "#3f8df5" }}
        >
          <But_aside />
        </div>
        <div className="flex flex-col items-left justify-center mt-10">
          <h1
            className="text-2xl text-black text-left ml-20"
            style={{ color: "#000000", fontFamily: "Cursive" }}
          >
            Bienvenidos a Casa Jardin
          </h1>
          <h2 className="max-w-lg text-center text-ml mt-4" style={{ fontFamily: "Cursive" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras purus mauris, congue in
            elit eu, hendrerit interdum mi. Praesent lectus nibh, feugiat blandit justo fringilla,
            luctus semper odio.
          </h2>
        </div>
        <div className="relative z-20">
          <RotatingImages />
        </div>
      </div>
    </main>
  );
};

export default Inicio;