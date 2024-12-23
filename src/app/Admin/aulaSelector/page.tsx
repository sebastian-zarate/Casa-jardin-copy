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
    visible: boolean;
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
            const response = (await getAulas()).map(aula => ({ ...aula, visible: true })) as Aula[];
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
        <main
            className="relative bg-cover bg-center"
            style={{
                backgroundImage: `url(${Background})`,
            }}
        >
            <Navigate />

            <div className="relative w-full">
                {/* Fondo Fijo */}
                <div className="fixed inset-0 z-[-1]">
                    <Image
                        src={Background}
                        alt="Background"
                        layout="fill"
                        objectFit="cover"
                        quality={80}
                        priority
                    />
                </div>

                {/* Contenedor Principal */}
                <div className="relative mt-8 flex justify-center">
                    <div className="border p-4 max-w-[96vh] w-11/12 sm:w-2/3 md:w-4/5 lg:w-2/3 h-[62vh] bg-slate-50 overflow-y-auto rounded-lg">
                        <div className="flex flex-col items-center p-2">
                            <h1 className="text-2xl uppercase">Salones</h1>
                        </div>

                        <div className="flex flex-col space-y-4 bg-white">
                            <div className="relative overflow-x-auto shadow-lg sm:rounded-lg mb-4">
                                {/* Barra de acciones */}
                                <div className="flex justify-around bg-white p-2 mb-4">
                                    <button
                                        onClick={() => setSelectedAulaIdCrear(-1)}
                                        className="px-2 w-10 h-10"
                                    >
                                        <Image src={ButtonAdd} alt="Agregar Salón" />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
                                        onChange={(e) => {
                                            const searchTerm = e.target.value.toLowerCase();
                                            setAulas(
                                                aulas.map((aula) => ({
                                                    ...aula,
                                                    visible: aula.nombre.toLowerCase().includes(searchTerm),
                                                }))
                                            );
                                        }}
                                    />
                                </div>

                                {/* Tabla de salones */}
                                <table className="w-full text-sm text-left text-gray-500 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3">Nombre</th>
                                            <th className="px-6 py-3">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {aulas.filter((aula) => aula.visible).map((aula) => (
                                            <tr
                                                className="bg-white border-b hover:bg-gray-50"
                                                key={aula.id}
                                            >
                                                <td className="px-6 py-4 text-gray-900">
                                                    <div className="text-base font-semibold">{aula.nombre}</div>
                                                </td>
                                                <td className="px-6 py-4 space-y-2">
                                                    <div>
                                                        <button
                                                            onClick={() => setSelectedAulaId(aula.id)}
                                                            className="font-medium text-blue-600 hover:underline"
                                                        >
                                                            Ver Horario
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAulaIdModificar(aula.id);
                                                                setAulaDetails({ nombre: aula.nombre }); // Inicializa el campo de entrada con el nombre del aula
                                                            }}
                                                            className="font-medium text-blue-600 hover:underline w-full text-left mb-2"
                                                        >
                                                            Editar
                                                        </button>

                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => setSelectedAulaIdEliminar(aula.id)}
                                                            className="font-medium text-red-600 hover:underline"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Componente Horario */}
                {selectedAulaId && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white shadow-lg overflow-auto">
                        <Horario idAula={selectedAulaId} />
                    </div>
                )}

                {/* Modales para Crear/Editar */}
                {(selectedAulaIdCrear !== null || selectedAulaIdModificar) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative max-h-screen overflow-y-auto">
                            <h2 className="text-lg font-semibold mb-3">
                                {selectedAulaIdCrear === -1 ? "Agregar Salón" : "Modificar Salón"}
                            </h2>
                            {errorMessage && (
                                <div className="mb-3 text-red-600 text-sm">{errorMessage}</div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="nombre" className="block text-sm">
                                    {selectedAulaIdCrear === -1
                                        ? "Nombre de Salón:"
                                        : `Nuevo nombre de ${selectedAulaNombre}:`}
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
                                    onClick={
                                        selectedAulaIdCrear === -1
                                            ? handleCreateAula
                                            : () => selectedAulaIdModificar !== null && handleModificarAula(selectedAulaIdModificar)
                                    }
                                    className="bg-red-600 py-1 px-3 text-white rounded text-sm hover:bg-red-700"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedAulaIdCrear(null);
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
                                    value={aulaDetails.nombre} // Se usa aulaDetails.nombre como valor del input
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
                                        setAulaDetails({ nombre: "" }); // Limpia el estado al cerrar
                                    }}
                                    className="bg-gray-600 py-1 px-3 text-white rounded text-sm hover:bg-gray-700"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Modal para Eliminar */}
                {selectedAulaIdEliminar && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
                            <h2 className="text-lg font-semibold mb-3">Eliminar Salón</h2> 
                            {errorMessage && (
                                <div className="mb-3 text-red-600 text-sm">{errorMessage}</div>
                            )}
                            <div className="mb-3">
                                <p>¿Estás seguro de eliminar el salón?</p>
                            </div>
                           
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => {
                                        if (selectedAulaIdEliminar) handleEliminarAula(selectedAulaIdEliminar);
                                    }
                                    }
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
            </div>
        </main>






    );

};

export default withAuth(Aulas);
