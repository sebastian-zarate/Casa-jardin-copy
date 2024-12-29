"use client";
// #region Imports
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/start/navigate/page"
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Background from "../../../../public/Images/CollageImage.jpg";
import TabbedContent from "./tabs";
import { getImagesUser } from "@/services/repoImage";
import RotatingImages from "@/components/start/rotatingImages";






const Nosotros = () => {
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
    <main className="relative min-h-screen  overflow-hidden">
      {/* Fondo */}
      <div className="fixed inset-0 pointer-events-none">
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
      <div className="fixed top-0 left-0 right-0   w-full z-50">
        <Navigate />
      </div>

      {/* Contenido principal, ocupando todo el centro de la pantalla */}
      <div className="h-auto mb-28 flex flex-col md:flex-row lg:flex-row justify-around sm:flex-row mt-32 text-pretty font-sans text-lg leading-relaxed">
      <div
        className="bottom-20 left-0 right-0 z-10 flex flex-col justify-start items-center px-8 space-y-8"
      >
        <TabbedContent />
      </div>


        {/* Contenedor de imágenes en rotación */}
        <div className="   min-h-80 ">
          <RotatingImages images={downloadurls}/>
        </div>
      </div>

      {/* Pie de página fijo */}
      <div
        className="fixed  bottom-0 py-0.1 border-t w-full z-30 bg-sky-600 opacity-90"
      >
        <But_aside />
      </div>
    </main>
  );
}
export default Nosotros;