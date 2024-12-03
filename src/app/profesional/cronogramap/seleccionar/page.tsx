'use client'

import React, { useEffect, useState } from "react";
import Navigate from "../../../../components/profesional/navigate/page";
import But_aside from "../../../../components/but_aside/page";
import { createAula, getAulas, getAulaByNombre, deleteAulas } from "../../../../services/aulas";
import Image from "next/image";
import { getProfesionalByCookie } from "../../../../services/profesional";
import Background from "../../../../../public/Images/Background.jpeg";

import DeleteIcon from "../../../../../public/Images/DeleteIcon.png";
import ButtonAdd from "../../../../public/Images/Button.png";
import HorarioProfesional from "../modificar/HorarioProfesional";

// Define the Aula interface para definir la estructura de los datos de aula
interface Aula {
    id: number;
    nombre: string;
}

const AulasProfecional: React.FC = () => {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [selectedAulaId, setSelectedAulaId] = useState<number | null>(null); // Añadir estado para el ID del aula seleccionada
    const[selectedProfesionalId, setSelectedProfesionalId] = useState<number | null>(null);
    
    const fetchAulas = async () => {
        try {
            const response: Aula[] = await getAulas();

            setAulas(response);

        } catch (error) {
            console.error("Error al obtener las aulas:", error);
        }
        try {
            const response = await getProfesionalByCookie();
            if (response) {
                setSelectedProfesionalId(response.id);
            }
        }
        catch (error) {
            console.error("Error al obtener el profesional:", error);
        }
    };

    // función para obtener las aulas
    useEffect(() => {
        fetchAulas();
    }, []);
    const handleSelectAula = (id: number) => {
        setSelectedAulaId(id);
    };
   
    return (
        <main className="relative min-h-screen w-screen  " style={{ fontFamily: "Cursive" }}>
            <Navigate />
            <div className="fixed inset-0 z-[-1]">
                <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
            </div>

            {/* Muestra el título de la página */}
            <h1 className="absolute top-40 left-60 mb-5 sm:left-40 mb-5 text-2xl sm:text-3xl bg-white rounded-lg p-2">Selecciona un salón</h1>

            {/* Muestra la lista de aulas */}
            <div
        className="top-60 border p-1 absolute left-40 h-[calc(80vh-15rem)] overflow-y-auto"
        style={{ background: "#D9D9D9" }}
      >                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
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
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Previene la propagación del evento para que no seleccione el aula
                                    }}
                                    className="absolute top-0 right-0 text-red-600 font-bold"
                                >
                        
                                </button>
                            </div>
                            <h3 className="flex bottom-0 text-black z-1">
                                {aula.nombre}
                            </h3>
                        </button>

                    ))}

                </div>
               
                
            </div>
  

            {/* Componente Horario con el ID del aula seleccionada */}
            {selectedAulaId && selectedProfesionalId !== null && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-white  shadow-lg overflow-auto">
                    <HorarioProfesional idAula={selectedAulaId} idProfesional={selectedProfesionalId} />
                </div>
            )}
         


        </main>
    );

};

export default AulasProfecional;