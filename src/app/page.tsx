"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSolicitudCompleta, getSolicitudesCompletas } from '@/services/Solicitud/Solicitud';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  /* useEffect(() => {
    // Redirige automáticamente a la página /start/Inicio después de 3 segundos
    router.push('/start/Inicio');
    const timer = setTimeout(() => {
      router.push('/start/Inicio');
    }, 3000);

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, [router]); */

  const handleCargarSolicitud = async (id: number) => {
    const solicitud = await getSolicitudCompleta(id);
    console.log(solicitud);

  }

  const handleCargarTodas = async () => {
    console.time('solicitudes');
    const solicitud = await getSolicitudesCompletas();
    console.log(solicitud);
    console.timeEnd('solicitudes');

  }

  return (
    <main>
      <h1>Home</h1>
      <button onClick={() => handleCargarSolicitud(93)}>Cargar solicitud</button>
      <button onClick={() => handleCargarTodas()} className='m-3 text-red-500'>bombastic</button>
    </main>
  );
}