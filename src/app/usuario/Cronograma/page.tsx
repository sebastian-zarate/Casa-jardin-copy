"use client";
import React, { useState, useEffect } from "react";
import { getCronogramaByIdAlumno } from "../../../services/cronograma/alumno_cronograma";
import { getCursos } from "../../../services/cursos";
import { getDias, getHoras } from "../../../services/dia";
import { getAlumnoByCookie } from "../../../services/Alumno";
import withAuthUser from "../../../components/alumno/userAuth";
import Navigate from "../../../components/alumno/navigate/page";
import Background from "../../../../public/Images/Background.jpeg";
import Loader from "@/components/Loaders/loader/loader";
import But_aside from "@/components/but_aside/page";
import { Calendar, Clock } from "lucide-react";
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
      <main className=" flex-col items-center justify-center min-h-screen bg-gray-100">
        <Navigate />
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader />
          <p className="text-gray-700">Cargando el cronograma</p>
        </div>

        <div className="w-full  py-2">
          <But_aside />
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
        <div className="w-full bg-sky-600 py-2">
          <But_aside />
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-[90rem] mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-900 flex items-center justify-center gap-2">
            <Calendar className="w-8 h-8 text-indigo-600" />
            Horario Académico
          </h1>
          <p className="text-gray-600 mt-2">Gestión de horarios y aulas</p>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-indigo-100">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 bg-indigo-600 text-white">
            <div className="p-4 flex items-center justify-center font-semibold">
              <Clock className="w-5 h-5 mr-2" />
              Hora
            </div>
            {dias.map((dia) => (
              <div key={dia} className={`p-4 text-center font-semibold }`}>
                {dia}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          {horas.map((hora, rowIndex) => (
            <div
              key={hora.id}
              className={`grid grid-cols-8 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-indigo-50'
                }`}
            >
              <div className="p-4 border-r border-indigo-100 flex items-center justify-center font-medium text-indigo-900">
                {hora.hora_inicio}
              </div>
              {tabla[rowIndex]?.map((content, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`p-4 border-r border-indigo-100 relative group hover:bg-indigo-50 transition-colors ${colIndex >= 6 ? 'bg-gray-50' : ''
                    }`}
                >
                  {Array.isArray(content) && content.length > 0 ? (
                    content.map((cursoCronograma, idx) => {
                      const [curso] = cursoCronograma.split("-");
                      return (
                        <div
                        key={idx}
                        className="mb-2 last:mb-0 overflow-hidden bg-indigo-100 rounded-lg py-4 px-1   hover:overflow-auto   hover:bg-indigo-200 cursor-default group"
                      >
                        <div className="font-medium text-indigo-900 overflow-hidden whitespace-nowrap text-ellipsis group-hover:whitespace-normal group-hover:text-clip group-hover:overflow-visible">
                          {curso}
                        </div>
                        <div className="text-xs text-indigo-600 overflow-hidden whitespace-nowrap text-ellipsis group-hover:whitespace-normal group-hover:text-clip group-hover:overflow-visible">
                          {aulaNombres[cursoCronograma] || "Aula no disponible"}
                        </div>
                      </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-400 text-sm text-center italic">
                      Disponible
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );

}

export default withAuthUser(Horario);