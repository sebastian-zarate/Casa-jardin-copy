"use client";
// #region Imports
import React, { use, useEffect, useState } from "react";
import Navigate from "../../../components/start/navigate/page";
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";
import { getCursosActivos } from "@/services/cursos";
//imagen default si el curso no tiene imagen
import NoImage from "../../../../public/Images/default-no-image.png";
import { getImages_talleresAdmin } from "@/services/repoImage";
//para subir imagenes:
import { mapearImagenes } from "@/helpers/repoImages";
import Loader from "@/components/Loaders/loading/page";
// #endregion Imports

const Talleres = () => {
    const [cursos, setCursos] = useState<any[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [downloadurls, setDownloadurls] = useState<any[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Llamar a fetchImages después de que los cursos se hayan cargado
        if (cursos.length > 0 && !imagesLoaded) {
            fetchImages();
        }
        if (cursos.length === 0) {
            fetchTalleres();

        }
    }, [cursos]);



    async function fetchTalleres() {
        const taller = await getCursosActivos();
        console.log(taller);
        setCursos(taller);
    }
    // Método para obtener las imagenes
    const fetchImages = async () => {
        const result = await getImages_talleresAdmin();
    
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
        <main className="relative min-h-screen  text-gray-600 body-font">
            {/*             <Image
                src={Background}
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={80}
                priority={true}
            /> */}
            <Navigate />
            <div className="fixed inset-0 z-[-1] h-full w-full">
                <Image src={Background}
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
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Conozca nuestros talleres</h1>
                        <div className="h-1 w-20 bg-indigo-500 rounded"></div>
                    </div>
                </div>
                {cursos.length === 0 && (
                    <div className="flex justify-center items-center  w-full"><Loader /></div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">

                    {cursos.length !== 0 && cursos.map((curso) => (
                        <div className=" p-4 ">
                            <div className="bg-gray-100 p-6 rounded-lg min-h-96">
                                <div className="relative h-40 w-full mb-6">
                                    <Image
                                        className="rounded object-cover object-center"
                                        src={curso.imageUrl || NoImage}
                                        alt="content"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{curso.nombre}</h2>
                                <p style={{ overflow: "auto" }} className="sm:h-[8vh] md:h-[8vh] lg:h-[8vh] xl:h-[10vh] leading-relaxed text-base">{curso.descripcion}</p>
                            </div>
                        </div>
                    ))}
                    {/*                                     <Image
                   src={curso.imageUrl || NoImage}
                  alt="Background Image"
                  objectFit="cover"
                  className="w-full h-full"
                  layout="fill"
                /> */}
                </div>
            </div>
            <div
                className="fixed  bottom-0 py-0.1 border-t w-full z-30"
                style={{ opacity: 0.89, background: "#3f8df5" }}
            >
                <But_aside />
            </div>
        </main>
    );
};

export default Talleres;