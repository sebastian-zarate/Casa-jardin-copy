"use client";
// #region Imports
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/start/navigate/page"
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Background from "../../../../public/Images/CollageImage.jpg";
import { getImagesUser } from "@/services/repoImage";

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
    const result = await getImagesUser();
    if (result.images) {
      setImages(result.images);
      setDownloadurls(result.downloadurls);
    }
  };


  return (
    <div className="flex justify-end mr-20 mt-10">
      {downloadurls.length > 0 && (
        <Image
          src={downloadurls[currentImageIndex]}
          alt="Background"
          width={320}
          height={200}
          quality={80}
          priority={true}
          className="z-0 rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};






const Nosotros = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-hidden">
      {/* Fondo */}
      <div className="fixed inset-0">
        <Image
          src={Background}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={80}
          priority={true}
          className="z-0"
        />
      </div>

      {/* Encabezado fijo */}
      <div className="fixed top-0 left-0 right-0 flex justify-between w-full p-1 z-50" style={{ backgroundColor: "#3f8df5" }}>
        <Navigate />
      </div>

      {/* Contenido principal, ocupando todo el centro de la pantalla */}
      <div className="flex justify-between sm:h-[97vh]">
        <div
          className="fixed top-20 bottom-20 left-0 right-0 z-10 flex flex-col justify-center items-start px-8 space-y-8"
          style={{ fontFamily: "Cursive" }}
        >
          {/* Misión */}
          <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
            <h1 className="text-xl text-black">Misión:</h1>
            <h2 className="text-xl text-black max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras purus mauris,
              congue in elit eu, hendrerit interdum mi. Praesent lectus nibh, feugiat
              blandit justo fringilla, luctus semper odio.
            </h2>
          </div>

          {/* Visión */}
          <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
            <h1 className="text-xl text-black">Visión:</h1>
            <h2 className="text-xl text-black max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras purus mauris,
              congue in elit eu, hendrerit interdum mi. Praesent lectus nibh, feugiat
              blandit justo fringilla, luctus semper odio.
            </h2>
          </div>

          {/* Valores */}
          <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
            <h1 className="text-xl text-black">Valores:</h1>
            <h2 className="text-xl text-black max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras purus mauris,
              congue in elit eu, hendrerit interdum mi. Praesent lectus nibh, feugiat
              blandit justo fringilla, luctus semper odio.
            </h2>
          </div>
        </div>


        {/* Contenedor de imágenes en rotación */}
        <div className="fixed  md:top-40 sm:bottom-0  right-8 z-10">
          <RotatingImages />
        </div>
      </div>

      {/* Pie de página fijo */}
      <div
        className="fixed  bottom-0 py-0.1 border-t w-full z-30"
        style={{ opacity: 0.89, background: "#3f8df5" }}
      >
        <But_aside />
      </div>
    </main>
  );
}
export default Nosotros;