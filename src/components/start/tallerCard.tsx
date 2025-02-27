"use client";

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { TallerModal } from './tallerModal'; 

interface Taller {
  nombre: string;
  descripcion: string;
  imageUrl: string;
  edadMinima: number;
  edadMaxima: number;
  fechaFin: string;
}

interface TallerCardProps {
  taller: Taller;
  profesionales: any[] | undefined;
}

export default function TallerCard({ taller, profesionales }: TallerCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const opacityClass = taller.imageUrl ? "opacity-0" : "opacity-40";

  // Convertir fechaFin a una cadena de texto
  const fechaFin = new Date(taller.fechaFin).toLocaleDateString();

  return (
    <>
      <div className="group relative h-[400px] overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="absolute inset-0">
          {taller.imageUrl && (
            <Image
              src={taller.imageUrl}
              alt={taller.nombre}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-110"
            />
          )}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-blue-500 to-red-500 ${opacityClass} transition-opacity duration-300 group-hover:opacity-80`}
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white transition-all duration-300">
          <div className="transform transition-all duration-300 group-hover:-translate-y-16">
            <h2 className="text-xl font-bold mb-2">{taller.nombre}</h2>
          </div>

          <div className="transform transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-sm leading-relaxed mb-4">{taller.descripcion}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors duration-300"
            >
              Más información
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
      <TallerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">{taller.nombre}</h2>
        <p className="mb-4">{taller.descripcion}</p>
        <p>
          Rango de edades: {taller.edadMinima} - {taller.edadMaxima} años
        </p>
        <p>Vigente hasta: {fechaFin}</p>
        <h3 className="text-lg font-bold mt-4">Profesionales</h3>
        <ul>
          {profesionales ? (
            profesionales.length === 0 ? (
              <li>Aún no hay profesionales asignados</li>
            ) : (
              profesionales.map((profesional) => (
                <li key={profesional.id}>
                  {profesional.nombre} {profesional.apellido}
                </li>
              ))
            )
          ) : (
            <li>Aún no hay profesionales asignados</li>
          )}
        </ul>
        {/* <button 
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors duration-300"
        >
          Cerrar
        </button> */}
      </TallerModal>
    </>
  );
}