"use client"; // Esto indica que este código se ejecuta en el lado del cliente.

import React, { useEffect, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";

import { createAula, getAulas, getAulaByNombre, deleteAulas } from "../../../services/aulas";
import Image from "next/image";
import withAuth from "../../../components/Admin/adminAuth";
import Background from "../../../../public/Images/Background.jpeg";
import { Horario } from "../cronograma/horario";

// Define the Aula interface para definir la estructura de los datos de aula
interface Aula {
    id: number;
    nombre: string;
}

const Aulas: React.FC = () => {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [selectedAulaId, setSelectedAulaId] = useState<number | null>(null); // Añadir estado para el ID del aula seleccionada
    const [aulaDetails, setAulaDetails] = useState<{ nombre: string }>({ nombre: "" });


    // Define the fetchAulas function to get the list of aulas
    const fetchAulas = async () => {
        try {
            const response: Aula[] = await getAulas();
            setAulas(response);
        } catch (error) {
            console.error("Error al obtener las aulas:", error);
        }
    };

    // función para obtener las aulas
    useEffect(() => {
        fetchAulas();
    }, []);

    // Función para manejar la selección del aula
    const handleSelectAula = (id: number) => {
        // que me lleve  a LA pagina de horario en admin/cronograma
        setSelectedAulaId(id);
    }

   return (
    <main className="relative min-h-screen w-screen">
        <Image
            src={Background}
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={80}
            priority={true}
        />

        <div className="fixed justify-between w-full p-4" style={{ background: "#1CABEB" }}>
            <Navigate />
        </div>

        {/* Muestra el título de la página */}
        <h1 className="absolute top-40 left-60 mb-5 text-3xl">Aulas</h1>

        {/* Muestra la lista de aulas */}
        <div className="top-60 border p-1 absolute left-40 h-90 max-h-90" style={{ background: "#D9D9D9" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
                {aulas.map((aula) => (
                    <button
                        key={aula.id}
                        onClick={() => handleSelectAula(aula.id)} // Añadir onClick para seleccionar el aula
                        className="border p-4 mx-2 relative w-47 h-47 justify-center items-center"
                    >
                        <div className="relative w-30 h-20">
                            <Image
                                src={Background}
                                alt="Background Image"
                                objectFit="cover"
                                className="w-full h-full"
                                layout="fill"
                            />
                        </div>
                        <h3 className="flex bottom-0 text-black z-1">
                            {aula.nombre}
                        </h3>
                    </button>
                ))}
            </div>
        </div>

        {/* Componente Horario con el ID del aula seleccionada */}
        {selectedAulaId && (
             <div className="fixed top-0 left-0 right-0 bottom-0 bg-white border p-4 shadow-lg overflow-auto">
             <Horario idAula={selectedAulaId} />
         </div>
        )}

        
    </main>
);

};

export default withAuth(Aulas);
