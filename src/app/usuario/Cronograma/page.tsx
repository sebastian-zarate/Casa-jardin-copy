"use client"; // Esta línea indica que este archivo debe ejecutarse en el cliente

import React, { useState, useEffect } from "react";

// Importamos los servicios que utilizaremos para interactuar con la API
import {
  createCronograma,
  deleteCronogramas,
  deleteCronogramaDiaHora,
} from "../../../services/cronograma";
import { getCronogramaByIdAlumno} from "../../../services/alumno_curso"
import { getCursos } from "../../../services/cursos";
import { getDias, getHoras } from "../../../services/dia";
import { getAulaById } from "@/services/aulas";
import{getAlumnoByCooki} from "../../../services/Alumno"

// Definimos una interfaz para los cursos para tipar correctamente los datos
interface Curso {
  id: number;
  nombre: string;
}

// Interfaz para las propiedades del componente, en este caso, el ID del aula
interface HorarioProps {
  idAula: number; // Recibir el id del aula como prop
}

// Componente principal Horario
export default function Horario({ idAula }: HorarioProps) {
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

        // Obtener información del aula según el ID'



        // Actualizar estados con las horas y días obtenidos
        setHoras(horasData || []);
        setDias(diasData ? diasData.map((dia) => dia.nombre) : []);

        // Inicializar la tabla con celdas vacías
        const tablaInicial = horasData
          ? horasData.map(() => Array(diasData.length).fill(""))
          : [];
        setTabla(tablaInicial);
        const alumno = await getAlumnoByCooki();
        // Obtener los cronogramas asignados al aula
        const cronogramas = await getCronogramaByIdAlumno(Number(alumno?.id)) || [];

        // Rellenar la tabla con los cursos asignados
        
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
          const cursosData = await getCursos(); // Obtener cursos desde la API
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



  // Renderizado condicional para mostrar una pantalla de carga mientras los datos se cargan
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-bold">Cargando datos...</div> {/* Mensaje de carga */}
      </div>
    );
  }

  // Renderizado condicional para mostrar un mensaje de error si ocurrió alguno
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-bold text-red-500">{error}</div> {/* Mensaje de error */}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full m-0 p-0 bg-transparent border-l-2 border-gray-500 ">
      {/* Tabla del cronograma */}
      <table className="table-auto w-full border-collapse border border-gray-500 text-sm md:text-base lg:text-lg bg-white">
        {/* Título de la tabla con el nombre del aula */}
        <caption className="text-lg font-bold mb-4">
          Mis horarios {aulaNombre}
        </caption>
        <thead>
          <tr>
            <th className="border border-gray-500 p-1 sm:p-2 text-center">Hora</th>
            {dias.length > 0 &&
              dias.map((dia) => (
                <th key={dia} className="border border-gray-500 p-1 sm:p-2 text-center">
                  {dia}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {horas.length > 0 &&
            horas.map((hora, rowIndex) => (
              <tr key={hora.id}>
                <td className="border border-gray-500 p-1 sm:p-2 text-center">
                  {hora.hora_inicio}
                </td>
                {tabla[rowIndex]?.map((content, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="border border-gray-500 p-1 sm:p-2 text-center relative"
                  >
                    {content ? (
                      <>
                        <span>{content}</span> {/* Mostrar el nombre del curso */}
                        {/* Botón para eliminar el curso en esta celda */}
                       
                      </>
                    ) : (
                      /* Botón para agregar un curso en esta celda */
                      <div className="text-white px-1 py-1 sm:px-2 sm:py-1 rounded text-xs sm:text-sm">
                        
                      </div>
                    
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Mensaje de error adicional, si lo hay */}
      {error && <div className="text-red-500 mt-4">{error}</div>}

      {/* Botones de acción: Limpiar todo y Volver */}
      <div className="flex justify-center mt-4">
       
        <a
          href="/usuario/principal"
          className="bg-gray-500 text-white px-4 py-2 rounded "
          aria-label="Volver"
        >
          Volver
        </a>
      </div>

      

    </div>
  );
}

