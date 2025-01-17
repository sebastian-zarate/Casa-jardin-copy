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
import { Search } from "lucide-react";
import { Input } from "postcss";

// Define the Aula interface para definir la estructura de los datos de aula
interface Aula {
    id: number;
    nombre: string;
}

const AulasProfecional: React.FC = () => {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [selectedAulaId, setSelectedAulaId] = useState<number | null>(null); // Añadir estado para el ID del aula seleccionada
    const[selectedProfesionalId, setSelectedProfesionalId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
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
    const filteredAulas = aulas
    .filter((aula) => aula.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
   
    return (
        <main className="relative min-h-screen w-full">
            <Navigate />

            <div className="fixed inset-0 z-[-1]">
                <Image 
                    src={Background} 
                    alt="Background" 
                    layout="fill" 
                    objectFit="cover" 
                    quality={80} 
                    priority={true} 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-8 text-white bg-black bg-opacity-50 p-4 rounded-lg">
                    Selecciona un salón
                </h1>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar salón..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-lg border rounded-lg"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Classroom List */}
                <div className="bg-white bg-opacity-90 rounded-lg shadow-xl p-6 max-h-[60vh] overflow-y-auto">
                    {filteredAulas.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredAulas.map((aula) => (
                                <div key={aula.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative w-full h-40">
                                        <button
                                            className="relative w-full h-full"
                                            onClick={() => handleSelectAula(aula.id)}
                                        >
                                            <Image
                                                src={Background}
                                                alt="Background Image"
                                                objectFit="cover"
                                                className="w-full h-full"
                                                layout="fill"
                                            />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-center mb-2">{aula.nombre}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 text-lg">No se encontraron aulas.</p>
                    )}
                </div>
            </div>

            {/* Componente Horario */}
            {selectedAulaId && selectedProfesionalId !== null && (
                <div className="fixed inset-0 bg-white shadow-lg overflow-auto z-10">
                    <HorarioProfesional idAula={selectedAulaId} idProfesional={selectedProfesionalId} />
                </div>
            )}
        </main>
    );

};

export default AulasProfecional;