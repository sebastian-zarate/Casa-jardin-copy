"use client"; // Esto indica que este código se ejecuta en el lado del cliente.

import React, { useEffect, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { createAula, getAulas,getAulaByNombre, deleteAulas } from "../../../services/aulas";
import Image from "next/image";
import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import ButtonAdd from "../../../../public/Images/Button.png";
import Background from "../../../../public/Images/Background.jpeg";
import withAuth from "../../../components/Admin/adminAuth";
// Define the Aula interface para definir la estructura de los datos de aula
interface Aula {
    id: number;
    nombre: string;
}
// Define las propiedades y el estado del componente Aulas
const Aulas: React.FC = () => {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [selectedAulaId, setSelectedAulaId] = useState<number | null>(null);
    const [aulaDetails, setAulaDetails] = useState<{ nombre: string }>({
        nombre: "",
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
// Define the fetchAulas function to get the list of aulas
    const fetchAulas = async () => {
        try {
            const response: Aula[] = await getAulas();
            setAulas(response);
        } catch (error) {
            console.error("Error al obtener las aulas:", error);
        }
    };
// Define the handleCreateAula function to create a nueva aula  
    const handleCreateAula = async () => {
        if (!aulaDetails.nombre) {
            setErrorMessage("El nombre del aula es obligatorio");
            return;
        }
        if(await getAulaByNombre(aulaDetails.nombre)){ // Comprueba si el nombre del aula ya existe
            setErrorMessage("El nombre del aula ya existe");
            return;
        }
       if (aulaDetails.nombre.trim().length < 3) {// no puede ser menor a 3 caracteres y espacios en blanco
            setErrorMessage("El nombre del aula debe tener al menos 2 caracteres");
            return;
        }
        if(aulaDetails.nombre.trim().length > 50){// no puede ser mayor a 50 caracteres
            setErrorMessage("El nombre del aula debe tener menos de 50 caracteres");
            return;
        }
       // no puede ser solo caracteres especiales
       const regex = /^[a-zA-Z0-9_ ,.;áéíóúÁÉÍÓÚñÑüÜ]*$/;
        if(!regex.test(aulaDetails.nombre)){
                setErrorMessage("El nombre del aula no puede contener caracteres especiales");
                return;
            }
       
        

        try {// Crea el aula con los detalles proporcionados y actualiza la lista de aulas
            await createAula(aulaDetails);
            fetchAulas();
            setAulaDetails({ nombre: "" });
            setSelectedAulaId(null);
        } catch (error) {
            setErrorMessage("Error al crear el aula");
        }
    };
// Define para eliminar el aula por su id
    const handleEliminarAula = async (id: number) => {
        try {
            await deleteAulas(id); // Corrige el código de eliminación
            fetchAulas(); // Vuelve a cargar las aulas después de la eliminación
        } catch (error) {
            console.error("Error al eliminar el aula:", error);
        }
    };
// función para obtener las aulas
    useEffect(() => {
        fetchAulas();
    }, []);

    return (
        <main className="relative min-h-screen w-screen">
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />

            <Navigate />
            {/* Muestra el título de la página */}
            <h1 className="absolute top-40 left-60 mb-5 text-3xl">Aulas</h1>
            {/* Muestra la lista de aulas */}
            <div className="top-60 border p-1 absolute left-40 h-90 max-h-90" style={{ background: "#D9D9D9" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
                    {aulas.map((aula) => (
                        <div key={aula.id} className="border p-4 mx-2 relative w-47 h-47 justify-center items-center">
                            <div className="relative w-30 h-20">
                                {/* Muestra la imagen de fondo del aula */}
                                <Image
                                    src={Background}
                                    alt="Background Image"
                                    objectFit="cover"
                                    className="w-full h-full"
                                    layout="fill"
                                />
                                <button
                                    onClick={() => handleEliminarAula(aula.id)}
                                    className="absolute top-0 right-0 text-red-600 font-bold"
                                >
                                    <Image src={DeleteIcon} alt="Eliminar" width={27} height={27} />
                                </button>
                            </div>
                            <h3 className="flex bottom-0 text-black z-1"> <h2>  </h2>{ aula.nombre}</h3>
                        </div>
                    ))}
                </div>
                <button onClick={() => setSelectedAulaId(-1)} className="mt-6 mx-4">
                    <Image src={ButtonAdd} className="mx-3" alt="Añadir Aula" width={70} height={70} />
                </button>
            </div>

            <But_aside />
                    {/* Muestra el formulario para crear aula */}
            {selectedAulaId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedAulaId === -1 ? "Crear Aula" : "Editar Aula"}
                        </h2>
                        {errorMessage && (
                            <div className="mb-4 text-red-600">{errorMessage}</div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="nombre" className="block">Nombre de aula:</label>
                            <input
                                type="string"
                                id="nombre"
                            
                                value={aulaDetails.nombre}
                                onChange={(e) =>
                                    setAulaDetails({ ...aulaDetails, nombre: e.target.value })  // Corrige el nombre del campo
                                }
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCreateAula}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => setSelectedAulaId(null)}
                                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default withAuth(Aulas); // Corrige el nombre del componente
