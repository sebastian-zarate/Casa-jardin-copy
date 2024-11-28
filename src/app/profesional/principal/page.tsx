"use client"
import React, { useEffect, useState } from 'react';
import Navigate from "../../../components/profesional//navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getCursosByIdAlumno } from '@/services/alumno_curso';
import Background from "../../../../public/Images/BackProfesionales.jpg"
import { Curso, getCursoById } from '@/services/cursos';
import Image from "next/image";
import correoIcon from "../../../../public/Images/correoIcon.png";
import phoneIcon from "../../../../public/Images/phoneIcon.png";
import propuestasIcon from "../../../../public/Images/LogoCasaJardin.png";
import editCuentaIcon from "../../../../public/Images/PenIcon.png";
import { useRouter } from 'next/navigation';
import { autorizarUser, fetchUserData } from '@/helpers/cookies';
import { getAlumnoByEmail } from '@/services/Alumno';
import withAuthUser from "../../../components/alumno/userAuth";
import { getDireccionCompleta } from '@/services/ubicacion/direccion';
import { getCursosByIdProfesional } from '@/services/profesional_curso';
import { Profesional } from '@/services/profesional';
type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    telefono: number;
    email: string;
    direccionId: number;
    rolId: number;
};


const principal: React.FC = () => {

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [userName, setUserName] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [usuario, setUsuario] = useState<Usuario>();

    const router = useRouter();
    // Para cambiar al usuario de página si no está logeado
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
        authorizeAndFetchData();
    }, [router]);

    const authorizeAndFetchData = async () => {
        console.time("authorizeAndFetchData");
        // Primero verifico que el user esté logeado
        //console.log("router", router);
        await autorizarUser(router);
        // Una vez autorizado obtengo los datos del user y seteo el email
        const user = await fetchUserData();
        //console.log("user", user);
        setUsuario(user)
        if (!user) return;
        let talleres = await getCursosByIdProfesional(Number(user?.id));
        console.log("talleres", talleres, usuario?.id);
        setCursos([])

        talleres.map((curso) => {
            setCursos(prev => (prev ? [...prev, curso as Curso] : [curso as Curso]));
        })
        //console.timeEnd("authorizeAndFetchData");
    };

    const handleWhatsAppClick = () => {
        const phoneNumber = '3435008302'; // Número de teléfono de Casa Jardín
        const message = encodeURIComponent('¡Hola! Estoy interesado en tu producto.');
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(url, '_blank'); // Abre en una nueva pestaña
    };
    return (
        <main className='' style={{ fontFamily: "Cursive" }}>
            <Navigate />
            <div className="relative h-[88vh]">
                <Image src={Background} className="h-[88hv]" alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} style={{ opacity: 0.66 }} />
            </div>
            <div className='absolute top-20'>
                <h1 className='absolute top-20 left-10 text-xl'>Bienvenido de regreso, {usuario?.nombre} {usuario?.apellido}</h1>
                <div className=' flex   justify-center items-center mt-40 w-screen'>
                    <button className='m-4 flex flex-col items-center' onClick={handleWhatsAppClick}>
                        <Image src={phoneIcon} alt="telefono" width={80} height={80} />
                        <span>Contacto</span>
                    </button>

                    <button className='m-4 flex flex-col items-center'/*  onClick={() => window.location.href = '/usuario/Propuestas'} */>
                        <Image src={propuestasIcon} alt="propuestas" width={80} height={80} />
                        <span>Propuestas</span>
                    </button>
                    <button className='m-4 flex flex-col items-center' onClick={() => window.location.href = '/profesional/Cuenta'}>
                        <Image src={editCuentaIcon} alt="edit" width={80} height={80} />
                        <span>Mi cuenta</span>
                    </button>
                </div>
                <div className=' mt-40 mb-10 p-5'>
                <h1 className='text-xl ml-10'>Mis Talleres</h1>
                    <div className='flex ml-5 mt-5 border'>
                        {cursos.map((curso, index) => (
                            <div key={index} className='m-4'>
                                <img src={""} alt={String(curso.id)} />
                                <h2>{curso.nombre}</h2>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 py-1 border-t bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
        </main>
    )
}
export default (principal);
