"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { autorizarAdmin, fetchUserData } from "../../helpers/cookies";// Asegúrate de que la ruta de importación sea correcta

const withAuthProfesional = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado de carga
    const [email, setEmail] = useState<string | null>(null); // Estado para almacenar el email

    useEffect(() => {
      const authorizeAndFetchData = async () => {

        setLoading(true); // El usuario está autenticado y hemos cargado los datos
        console.time("authorizeAndFetchData");
        // Verificar si el usuario está autorizado
        await autorizarAdmin(router);
        // Una vez autorizado obtengo los datos del user y seteo el email
        const user = await fetchUserData();
        if (user && user.email) {
            setEmail(user.email); // Solo establecer el email si existe
            setLoading(false); // El usuario está autenticado y hemos cargado los datos
          } else {
            // Redirigir a la página de login si el usuario no está logeado
            router.replace("/start/login");
          }
        
        console.timeEnd("authorizeAndFetchData");
      };

      authorizeAndFetchData();

      // Configurar intervalo para verificar la autenticación cada 15 minutos
      const interval = setInterval(async () => {
        await autorizarAdmin(router);
      }, 1800000); // 30 minutos en milisegundos (30 * 60 * 1000)

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, [router]);

    if (loading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          {/* Aquí puedes agregar un spinner o un mensaje de carga */}
        </div>
      );
    }

    // Puedes pasar el email al WrappedComponent si es necesario
    return <WrappedComponent {...props}  />;
  };

  return AuthenticatedComponent;
};

export default withAuthProfesional;
