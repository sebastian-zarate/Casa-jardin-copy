"use client";

import React, { useEffect, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import EditIcon from "../../../../public/Images/EditIcon.png";
import { createAula, getAulas, getAulaByNombre, deleteAulas, updateAula } from "../../../services/aulas";
import Image from "next/image";
import withAuth from "../../../components/Admin/adminAuth";
import Background from "../../../../public/Images/Background.jpeg";
import { Horario } from "../cronograma/horario";

import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import ButtonAdd from "../../../../public/Images/Button.png";
import But_aside from "@/components/but_aside/page";


// Define the Aula interface para definir la estructura de los datos de aula
interface Aula {
    id: number;
    nombre: string;
}

const Aulas: React.FC = () => {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [selectedAulaId, setSelectedAulaId] = useState<number | null>(null); // Añadir estado para el ID del aula seleccionada
    const [selectedAulaIdCrear, setSelectedAulaIdCrear] = useState<number | null>(null); // Añadir estado para el ID del aula seleccionada
    const [selectedAulaIdEliminar, setSelectedAulaIdEliminar] = useState<number | null>(null); // Añadir estado para el ID del aula seleccionada
    const [aulaDetails, setAulaDetails] = useState<{ nombre: string }>({ nombre: "" });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedAulaNombre, setSelectedAulaNombre] = useState(""); // Estado para el nombre del aula
    // modificar aula
    const [selectedAulaIdModificar, setSelectedAulaIdModificar] = useState<number | null>(null); // Añadir estado para el ID del aula seleccionada
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
    //Define the handleCreateAula function to create a nueva aula  
    const validateAulaNombre = async (nombre: string): Promise<string | null> => {
        if (!nombre.trim()) {
            return "El nombre del aula es obligatorio";
        }
        if (nombre.trim().length < 3) {
            return "El nombre del aula debe tener al menos 3 caracteres";
        }
        if (nombre.trim().length > 50) {
            return "El nombre del aula debe tener menos de 50 caracteres";
        }
        const regex = /^[a-zA-Z0-9_ " ,.;áéíóúÁÉÍÓÚñÑüÜ]*$/;
        if (!regex.test(nombre)) {
            return "El nombre del aula no puede contener caracteres especiales";
        }
        const aulaExistente = await getAulaByNombre(nombre);
        if (aulaExistente) {
            return "El nombre del aula ya existe";
        }
        return null; // No hay errores
    };

    const handleCreateAula = async () => {
        const error = await validateAulaNombre(aulaDetails.nombre);
        if (error) {
            showError(error);
            return;
        }

        try {
            await createAula(aulaDetails);
            fetchAulas();
            setAulaDetails({ nombre: "" });
            setSelectedAulaIdCrear(null);
        } catch (error) {
            showError("Error al crear el aula");
        }
    };


    // Define para eliminar el aula por su id
    const handleEliminarAula = async (id: number) => {
        try {
            await deleteAulas(id); // Corrige el código de eliminación
            setSelectedAulaIdEliminar(null); // Resetea el estado del ID del a
            fetchAulas(); // Vuelve a cargar las aulas después de la eliminación
        } catch (error) {
            showError("No se puede eliminar el aula, porque tiene horarios asignados");
        }
    };
    // Función para mostrar el mensaje de error
    const showError = (message: string) => {
        setErrorMessage(message);

        // Elimina el mensaje de error después de 3 segundos
        setTimeout(() => {
            setErrorMessage(null);  // Resetea el estado a null
        }, 3000);  // 3 segundos
    };

    // poder modificar el aula nombre del aula por su id
    const handleModificarAula = async (id: number) => {
        const error = await validateAulaNombre(aulaDetails.nombre);
        if (error) {
            showError(error);
            return;
        }

        try {
            await updateAula(id, aulaDetails);
            fetchAulas();
            setSelectedAulaIdModificar(null);
            setAulaDetails({ nombre: "" });
        } catch (error) {
            showError("Error al modificar el aula");
        }
    };

    return (
        <main className="relative min-h-screen w-screen " style={{ fontFamily: "Cursive" }}>
            
            <Navigate />
            <div className="fixed inset-0 z-[-1]">
                <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
            </div>

            {/* Muestra el título de la página */}
            
            <h1 className="absolute top-40 sm:left-40 mb-5 text-2xl  sm:text-3xl bg-white rounded-lg p-2 ">Salones </h1>


            {/* Muestra la lista de aulas */}
            <div
        className="top-60 border p-1 absolute left-40 h-[calc(80vh-15rem)] overflow-y-auto "
        style={{ background: "#D9D9D9" }}
      >
         <div className="flex justify-start mb-4 ">
          <button onClick={() => setSelectedAulaIdCrear(-1)} className="flex items-center mx-7 mt-6">
            <Image
              src={ButtonAdd}
              alt="Añadir Aula"
              width={70}
              height={70}
              className="mx-2"
            />
            <span className="text-black font-medium">Agregar un nuevo Salón</span>
          </button>
        </div>
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
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Previene la propagación del evento para que no seleccione el aula
                                        setSelectedAulaIdEliminar(aula.id); // Llama a la función para eliminar el aula
                                        setSelectedAulaNombre(aula.nombre); // Guarda el nombre del aula para mostrarlo en el mensaje
                                    }}
                                    className="absolute top-0 right-0 text-red-600 font-bold"
                                >
                                    <Image src={DeleteIcon} alt="Eliminar" width={27} height={27} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Previene la propagación del evento para que no seleccione el aula
                                        setSelectedAulaIdModificar(aula.id); // Añadir onClick para seleccionar el aula
                                        setSelectedAulaNombre(aula.nombre); // Guarda el nombre del aula para mostrarlo en el mensaje
                                    }}
                                    className="absolute top-0 right-8 text-red-600 font-bold"
                                >
                                    <Image src={EditIcon} alt="Editar" width={30} height={30} />
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
            {selectedAulaId && (
                <div className=" fixed top-0 left-0 right-0 bottom-0 bg-white  shadow-lg overflow-auto">
                    <Horario idAula={selectedAulaId} />
                </div>
            )}
            {/* Crear Aula */}
            {selectedAulaIdCrear !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative max-h-screen overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-3">
                            {selectedAulaIdCrear === -1 ? "Agregar Salón" : "Editar Salón"}
                        </h2>
                        {errorMessage && (
                            <div className="mb-3 text-red-600 text-sm">{errorMessage}</div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="nombre" className="block text-sm">Nombre de Salón:</label>
                            <input
                                type="text"
                                id="nombre"
                                value={aulaDetails.nombre}
                                onChange={(e) =>
                                    setAulaDetails({ ...aulaDetails, nombre: e.target.value })
                                }
                                className="p-1 w-full border rounded text-sm"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCreateAula}
                                className="bg-red-600 py-1 px-3 text-white rounded text-sm hover:bg-red-700"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedAulaIdCrear(null);
                                    setErrorMessage(null);
                                    setAulaDetails({ nombre: "" });
                                }}
                                className="bg-gray-600 py-1 px-3 text-white rounded text-sm hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Eliminar Aula */}
            {selectedAulaIdEliminar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative max-h-screen overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-3">
                            ¿Eliminar el salón: {selectedAulaNombre}?
                        </h2>
                        {errorMessage && (
                            <div className="mb-3 text-red-600 text-sm">{errorMessage}</div>
                        )}
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => handleEliminarAula(selectedAulaIdEliminar)}
                                className="bg-red-600 py-1 px-3 text-white rounded text-sm hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedAulaIdEliminar(null);
                                    setErrorMessage(null);
                                }}
                                className="bg-gray-600 py-1 px-3 text-white rounded text-sm hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modificar Aula */}
            {selectedAulaIdModificar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative max-h-screen overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-3">Modificar Salón</h2>
                        {errorMessage && (
                            <div className="mb-3 text-red-600 text-sm">{errorMessage}</div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="nombre" className="block text-sm">
                                Nuevo nombre de {selectedAulaNombre}:
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                value={aulaDetails.nombre}
                                onChange={(e) =>
                                    setAulaDetails({ ...aulaDetails, nombre: e.target.value })
                                }
                                className="p-1 w-full border rounded text-sm"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    if (selectedAulaIdModificar) handleModificarAula(selectedAulaIdModificar);
                                }}
                                className="bg-red-600 py-1 px-3 text-white rounded text-sm hover:bg-red-700"
                            >
                                Guardar Cambios
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedAulaIdModificar(null);
                                    setErrorMessage(null);
                                    setAulaDetails({ nombre: "" });
                                }}
                                className="bg-gray-600 py-1 px-3 text-white rounded text-sm hover:bg-gray-700"
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

export default withAuth(Aulas);
