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
      <Navigate />
      <div className="relative h-[80vh]">
                <Image src={Background} className="h-[80hv]" alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
      </div>

    </main>
  );
};

export default withAuth(Inicio); 
