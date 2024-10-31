"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigate from "../../../components/Admin/navigate/page"; // Ajusta la ruta según tu estructura de carpetas
import Image from "next/image";
import Background from "../../../../public/Images/Background.jpeg"; // Ajusta la ruta según tu estructura de carpetas
import withAuth from "../../../components/Admin/adminAuth";
const Inicio: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado de carga



  return (
    <main className="relative min-h-screen w-screen">
      <Image
        src={Background}
        alt="Background"
        fill // Usando fill para que funcione correctamente con la clase min-h-screen
        style={{ objectFit: "cover" }} // Cambiado a style para ajustarse a la nueva sintaxis de Next.js
        quality={80}
        priority={true}
      />
      <div className="fixed justify-between w-full p-4" style={{ background: "#1CABEB" }}>
        <Navigate />
      </div>
    </main>
  );
};

export default withAuth(Inicio); 
