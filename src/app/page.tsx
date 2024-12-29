"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automáticamente a la página /start/Inicio después de 3 segundos
    router.push('/start/Inicio');
    const timer = setTimeout(() => {
      router.push('/start/Inicio');
    }, 3000);

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main>
      <h1>HOLA MUCHACHOS</h1>
    </main>
  );
}