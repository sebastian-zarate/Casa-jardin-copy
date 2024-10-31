"use client"; 
import React, { useState, useEffect } from "react";
import { getCronogramaByIdAlumno } from "../../../services/cronograma/alumno_cronograma";
import { getCursos } from "../../../services/cursos";
import { getDias, getHoras } from "../../../services/dia";
import {getAlumnoByCookie } from "../../../services/Alumno";
import withAuthUser from "../../../components/alumno/userAuth";
interface Curso {
  id: number;
  nombre: string;
}


function Horario() {
  const [horas, setHoras] = useState<{ id: number; hora_inicio: string }[]>([]);
  const [dias, setDias] = useState<string[]>([]);
  const [tabla, setTabla] = useState<(string | string[])[][]>([]);
  const [aulaNombres, setAulaNombres] = useState<{ [cursoNombre: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const horasData = await getHoras();
        const diasData = await getDias();

        setHoras(horasData || []);
        setDias(diasData ? diasData.map((dia) => dia.nombre) : []);

        const tablaInicial = horasData
          ? horasData.map(() => Array(diasData.length).fill([]))
          : [];
        setTabla(tablaInicial);

        const alumno = await getAlumnoByCookie();
        const cronogramas = await getCronogramaByIdAlumno(Number(alumno?.id)) || [];

        const aulaMap: { [cursoNombre: string]: string } = {};

        cronogramas.forEach((cronograma) => {
          const horaIndex = horasData.findIndex((hora) => hora.id === cronograma.horaId);
          const diaIndex = diasData.findIndex((dia) => dia.id === cronograma.diaId);

          if (horaIndex !== -1 && diaIndex !== -1) {
            const cursoNombre = cronograma.cronograma.curso.nombre;
            const aulaNombre = cronograma.cronograma.aula.nombre;

            // Asociar el curso con su aula específica en este cronograma
            aulaMap[`${cursoNombre}-${cronograma.cronogramaId}`] = aulaNombre;

            // Actualizar la tabla, guardando el curso con el ID específico del cronograma
            const currentCell = tablaInicial[horaIndex][diaIndex];
            if (Array.isArray(currentCell)) {
              tablaInicial[horaIndex][diaIndex] = [
                ...currentCell,
                `${cursoNombre}-${cronograma.cronogramaId}`,
              ];
            } else {
              tablaInicial[horaIndex][diaIndex] = [`${cursoNombre}-${cronograma.cronogramaId}`];
            }
          }
        });

        // Guardar el mapa de aulas en el estado
        setAulaNombres(aulaMap);
        setTabla(tablaInicial);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Hubo un problema al cargar los datos.");
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  // Renderizado condicional
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-bold">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-bold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full m-0 p-0 bg-transparent border-l-2 border-gray-500">
      <table className="table-auto w-full border-collapse border border-gray-500 text-sm md:text-base  bg-white">
        <caption className="text-lg font-bold mb-4">Mis horarios</caption>
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
                    className="border border-gray-500  sm:p text-center"
                  >
                    {content ? (
                      <>
                        {Array.isArray(content) ? (
                          content.map((cursoCronograma, idx) => {
                            const [curso, cronogramaId] = cursoCronograma.split("-");
                            return (
                              <div key={idx}>
                                {curso} (
                                  {aulaNombres[cursoCronograma] || "Aula no disponible"})
                              </div>
                            );
                          })
                        ) : (
                          <div>
                            {content} ({aulaNombres[content] || "Aula no disponible"})
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-500">No hay cursos programados</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <a
          href="/usuario/principal"
          className="bg-gray-500 text-white px-4 py-2 rounded"
          aria-label="Volver"
        >
          Volver
        </a>
      </div>
    </div>
  );
}

export default withAuthUser(Horario);