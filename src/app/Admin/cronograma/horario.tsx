"use client"; 

import React, { useState, useEffect } from "react";

// Importamos los servicios que utilizaremos para interactuar con la API
import {
  createCronograma,
  getCronogramasPorAula,
  deleteCronogramas,
  deleteCronogramaDiaHora,getCursosCronograma
} from "../../../services/cronograma/cronograma";
import Navigate from "../../../components/Admin/navigate/page";
import { getDias, getHoras } from "../../../services/dia";
import { getAulaById } from "@/services/aulas";
import withAuth from "../../../components/Admin/adminAuth";
import { AlertCircle } from "lucide-react";
import Loader from "@/components/Loaders/loadingTalleres/page";
// Definimos una interfaz para los cursos para tipar correctamente los datos
interface Curso {
  id: number;
  nombre: string;
}



// Componente principal Horario
export function Horario({ idAula }: { idAula: number }) {
  // Estados para almacenar datos y manejar la UI
  const [horas, setHoras] = useState<{ id: number; hora_inicio: string }[]>([]); // Horas del cronograma
  const [dias, setDias] = useState<string[]>([]); // Días de la semana
  const [tabla, setTabla] = useState<string[][]>([]); // Tabla bidimensional para el cronograma
  const [aulaNombre, setAulaNombre] = useState<string>(""); // Nombre del aula
  const [cursos, setCursos] = useState<Curso[]>([]); // Lista de cursos disponibles
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null); // Celda seleccionada para agregar un curso
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal para seleccionar cursos
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Controla la visibilidad del modal de confirmación de eliminación
  const [deleteTarget, setDeleteTarget] = useState<{
    row: number;
    col: number;
  } | null>(null); // Celda objetivo para la eliminación
  const [loadingCursos, setLoadingCursos] = useState(false); // Estado para indicar si los cursos están cargando
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos generales están cargando
  const [error, setError] = useState<string | null>(null); // Mensaje de error, si lo hay
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);



  // useEffect para obtener los datos al montar el componente o cuando cambia el id del aula
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        // Obtener horas y días desde la API
        const horasData = await getHoras();
        const diasData = await getDias();

        // Obtener información del aula según el ID
        const aula = await getAulaById(idAula);
        setAulaNombre(aula?.nombre || "");

        // Actualizar estados con las horas y días obtenidos
        setHoras(horasData || []);
        setDias(diasData ? diasData.map((dia) => dia.nombre) : []);

        // Inicializar la tabla con celdas vacías
        const tablaInicial = horasData
          ? horasData.map(() => Array(diasData.length).fill(""))
          : [];
        setTabla(tablaInicial);

        // Obtener los cronogramas asignados al aula
        const cronogramas = await getCronogramasPorAula(idAula);

        // Rellenar la tabla con los cursos asignados
        cronogramas.forEach((cronograma) => {
          const horaIndex = horasData.findIndex(
            (hora) => hora.id === cronograma.horaId
          );
          const diaIndex = diasData.findIndex(
            (dia) => dia.id === cronograma.diaId
          );
          if (horaIndex !== -1 && diaIndex !== -1) {
            tablaInicial[horaIndex][diaIndex] =
              cronograma.cronograma.curso.nombre;
          }
        });

        setTabla(tablaInicial); // Actualizar la tabla en el estado
        setLoading(false); // Finalizar el estado de carga
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Hubo un problema al cargar los datos."); // Establecer mensaje de error
        setLoading(false); // Finalizar el estado de carga incluso si hay error
      }
    };

    obtenerDatos(); // Llamar a la función para obtener datos
  }, [idAula]); // Dependencia: se ejecuta cuando cambia el id del aula

  // useEffect para obtener los cursos cuando se abre el modal de selección
  useEffect(() => {
    if (isModalOpen) {
      const obtenerCursos = async () => {
        setLoadingCursos(true); // Indicar que los cursos están cargando
        setError(null); // Resetear cualquier error previo
        try {
          const cursosData = await getCursosCronograma(); // Obtener cursos desde la API
          setCursos(cursosData || []); // Actualizar el estado con los cursos obtenidos
        } catch (error) {
          console.error("Error al obtener los cursos", error);
          setError("No se pudieron cargar los cursos."); // Establecer mensaje de error
        } finally {
          setLoadingCursos(false); // Finalizar el estado de carga de cursos
        }
      };
      obtenerCursos(); // Llamar a la función para obtener cursos
    }
  }, [isModalOpen]); // Dependencia: se ejecuta cuando se abre el modal

  // Función para manejar la apertura del modal de selección de curso
  const handleAddContent = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex }); // Establecer la celda seleccionada
    setIsModalOpen(true); // Abrir el modal de selección de curso
  };

  // Función para manejar la selección de un curso
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectCurso = async (cursoId: number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const id_dia = col + 1;
      const id_hora = horas[row].id;

      if (tabla[row][col]) {
        setErrorMessage("Ya hay un curso asignado a esta hora y día.");
        return;
      }

      try {
        const result = await createCronograma({
          id_aula: idAula,
          id_curso: cursoId,
          diasHoras: [{ id_dia, id_hora }],
        });

        if (result.error) {
          setErrorMessage(result.error);
          return;
        }

        setTabla((prevTabla) => {
          const newTabla = [...prevTabla];
          newTabla[row][col] =
            cursos.find((curso) => curso.id === cursoId)?.nombre || "";
          return newTabla;
        });

        setErrorMessage(null); // Limpiar el mensaje de error
        setIsModalOpen(false); // Cerrar el modal si la operación fue exitosa
      } catch (error) {
        console.error("Error al crear el cronograma:", error);
        setErrorMessage("Error al asignar el curso. Intente nuevamente.");
      }
    }
  };

  // Función para manejar la eliminación de un curso en una celda específica
  const handleDeleteContent = (rowIndex: number, colIndex: number) => {
    setDeleteTarget({ row: rowIndex, col: colIndex }); // Establecer la celda objetivo para eliminar
    setIsDeleteModalOpen(true); // Abrir el modal de confirmación de eliminación
  };

  // Función para confirmar la eliminación de un curso
  const confirmDelete = async () => {
    if (deleteTarget) {
      const { row, col } = deleteTarget;
      const id_dia = col + 1; // Día correspondiente (1 = Lunes, etc.)
      const id_hora = horas[row].id;

      try {
        // Eliminar el cronograma de la base de datos
        await deleteCronogramaDiaHora(idAula, id_dia, id_hora);

        // Actualizar la tabla en el estado, limpiando la celda eliminada
        setTabla((prevTabla) => {
          const newTabla = [...prevTabla];
          newTabla[row][col] = ""; // Limpiar la celda
          return newTabla;
        });
      } catch (error) {
        console.error("Error al eliminar el cronograma:", error);
        setError("Error al eliminar el curso. Intente nuevamente."); // Establecer mensaje de error
      } finally {
        setIsDeleteModalOpen(false); // Cerrar el modal de confirmación de eliminación
        setDeleteTarget(null); // Resetear la celda objetivo
      }
    }
  };

  // Función para limpiar todo el cronograma del aula

  const Limpiartodoelcronogrma = async () => {
    try {
      await deleteCronogramas(idAula); // Elimina todo el cronograma del aula
      setTabla(horas.map(() => Array(dias.length).fill(""))); // Limpiar la tabla en el estado
      setError(null); // Limpiar cualquier error previo
      closeConfirmModal(); // Cerrar el modal de confirmación
    } catch (error) {
      console.error("Error al eliminar el cronograma:", error);
      setError("Error al limpiar el cronograma. Intente nuevamente.");
    }
  };



  // Función para confirmar la eliminación de todo el cronograma
  const confirmDeleteAll = async () => {
    try {
      // Eliminar todos los cronogramas del aula en la base de datos
      await deleteCronogramas(idAula);

      // Limpiar la tabla en el estado
      setTabla((prevTabla) => prevTabla.map((row) => row.map(() => "")));

      setIsDeleteModalOpen(false); // Cerrar el modal de confirmación
    } catch (error) {
      console.error("Error al eliminar el cronograma:", error);
      setError("Error al limpiar el cronograma. Intente nuevamente."); // Establecer mensaje de error
      setIsDeleteModalOpen(false); // Cerrar el modal de confirmación
    }
  };

  // Renderizado condicional para mostrar una pantalla de carga mientras los datos se cargan
  if (loading) {
    return (
      <main className=" flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navigate />
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    </main>
    );
}

if (error) {
    return (
        <main className=" flex-col items-center justify-center min-h-screen bg-gray-100">
    <Navigate />
       
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl font-bold text-red-500">{error}</div>
        </div>
    </main>
    );
}
//region return
  return (
    <main className="flex flex-col   items-center  min-h-screen bg-gray-100 border-none  m-100 p-0">
      <Navigate />
  
    <div className="w-full max-w-8xl px-12 py-8 bg-white shadow-lg rounded-lg border border-gray-300 mx-auto">
      {/* Tabla del cronograma */}
      <table className="table-auto w-full border-collapse border border-gray-500 text-sm md:text-base lg:text-lg">
        {/* Título de la tabla con el nombre del aula */}
        <caption className="text-lg font-bold mb-4">
          Horarios del {aulaNombre}
        </caption>
        <thead>
          <tr>
            <th className="border border-gray-500 p-2 sm:p-3 text-center min-w-[100px]">Hora</th>
            {dias.length > 0 &&
              dias.map((dia) => (
                <th key={dia} className="border border-gray-500 p-2 sm:p-3 text-center min-w-[100px]">
                  {dia}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {horas.length > 0 &&
            horas.map((hora, rowIndex) => (
              <tr key={hora.id}>
                <td className="border border-gray-500 p-2 sm:p-3 text-center min-w-[100px]">
                  {hora.hora_inicio}
                </td>
                {tabla[rowIndex]?.map((content, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="border border-gray-500 p-2 sm:p-3 text-center relative min-w-[100px]"
                  >
                    {content ? (
                      <>
                        <span>{content}</span> {/* Mostrar el nombre del curso */}
                        {/* Botón para eliminar el curso en esta celda */}
                        <button
                          onClick={() => handleDeleteContent(rowIndex, colIndex)}
                          className="absolute top-0 right-0 m-1 text-xs sm:text-sm text-red-500"
                          aria-label={`Eliminar contenido de ${content}`}
                        >
                          Eliminar
                        </button>
                      </>
                    ) : (
                      /* Botón para agregar un curso en esta celda */
                      <button
                        onClick={() => handleAddContent(rowIndex, colIndex)}
                        className="bg-blue-500 text-white px-1 py-1 sm:px-2 sm:py-1 rounded text-xs sm:text-sm"
                        aria-label="Agregar curso"
                      >
                        Agregar
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Mensaje de error adicional, si lo hay */}
      {error && <div className="text-red-500 mt-4">{error}</div>}

      {/* Aclaración sobre materias repetidas - Contenedor mejorado */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-800 mb-1">Información importante</h3>
                      <p className="text-blue-700 text-sm">
                        El sistema valida que una misma materia no esté asignada en el mismo día y hora en otros cronogramas. 
                        Sin embargo, es posible asignar al mismo profesor diferentes cursos en el mismo horario y día.
                      </p>
                    </div>
                  </div>
                </div>

      {/* Botones de acción: Limpiar todo y Volver */}
      <div className="flex justify-between mt-4">
        <button
          onClick={openConfirmModal}
          className="bg-red-500 text-white px-4 py-2 rounded"
          aria-label="Limpiar todo"
        >
          Limpiar todo el cronograma
        </button>
        <a
          href="/Admin/aulaSelector"
          className="bg-gray-500 text-white px-4 py-2 rounded"
          aria-label="Volver"
        >
          Volver
        </a>
      </div>

      {/* Modal para seleccionar un curso */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full z-50">
            <h2 className="text-lg font-bold mb-4">Selecciona un curso</h2>

            {/* Mensaje de error en rojo */}
            {errorMessage && (
              <div className="text-red-700 px-4 py-2 rounded mb-4">
                {errorMessage}
              </div>
            )}

            <ul className="max-h-60 overflow-auto">
              {loadingCursos ? (
                <li>Cargando cursos...</li>
              ) : (
                cursos.map((curso) => (
                  <li
                    key={curso.id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelectCurso(curso.id)}
                  >
                    {curso.nombre}
                  </li>
                ))
              )}
            </ul>

            <button
              onClick={() => {
                setIsModalOpen(false);
                setErrorMessage(null); // Limpiar mensaje de error al cerrar modal
              }}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}


      {/* Modal para confirmar la eliminación de un curso específico */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full z-50">
            <h2 className="text-lg font-bold mb-4">
              {deleteTarget === null ? "Confirmar Eliminación" : "Confirmar Eliminación"}
            </h2>
            {/* Diferenciar entre eliminación individual y eliminación masiva */}
            {deleteTarget ? (
              <p>¿Estás seguro de que deseas eliminar este curso?</p>
            ) : (
              <p>¿Estás seguro de que deseas eliminar todo el cronograma de {aulaNombre}?</p>
            )}
            <div className="flex justify-end mt-4">
              {/* Botón para cancelar la eliminación */}
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              {/* Botón para confirmar la eliminación */}
              <button
                onClick={deleteTarget ? confirmDelete : confirmDeleteAll}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para limpiar todo el cronograma */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full z-50">
            <h2 className="text-lg font-bold mb-4">¿Estás seguro de eliminar todo el cronograma del {aulaNombre}?</h2>
            <div className="flex justify-between mt-4">
              <button
                onClick={Limpiartodoelcronogrma}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Sí, eliminar
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
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
}
