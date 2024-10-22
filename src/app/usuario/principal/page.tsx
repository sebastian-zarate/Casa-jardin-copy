"use client"
import React, { useEffect, useState } from 'react';
import Navigate from "../../../components/alumno/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getcursosByIdAlumno } from '@/services/alumno_curso';
import { getAlumnoByCooki } from '@/services/Alumno';
import { Curso } from '@/services/cursos';
import Image from "next/image";
import correoIcon from "../../../../public/Images/correoIcon.png";
import phoneIcon from "../../../../public/Images/phoneIcon.png";
import propuestasIcon from "../../../../public/Images/LogoCasaJardin.png";
import editCuentaIcon from "../../../../public/Images/PenIcon.png";

const principal: React.FC = () => {

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [userName, setUserName] = useState<string>('');

    async function getAllCursos() {
        const user = await getAlumnoByCooki();
        let talleres: Curso[] = [];
        if(user) {
            const result = await getcursosByIdAlumno(Number(user?.id)) ?? [];
            if (result.length > 0) {
                talleres = result as Curso[];
            }
        }
        console.log(user?.nombre);
        setUserName(String(user?.nombre));
        if(talleres.length > 0) setCursos(talleres);
    }

    useEffect(() => {
        if (cursos.length === 0)   getAllCursos();
    }, [cursos]);

    return (
        <main className='flex'>
            <Navigate /> 

            <div className='absolute top-20 p-10'>
                <h1 className=''>Bienvenido de regreso, {userName}</h1>
                <div className=' flex justify-center items-center mt-40 w-screen'>
                    <button className='m-4 flex flex-col items-center'/*  onClick={() => window.location.href = '/usuario/Contacto'} */>
                        <Image src={phoneIcon} alt="telefono" width={80} height={80} />
                        <span>Contacto</span>
                    </button>
                    <button className='m-4 flex flex-col items-center' /* onClick={() => window.location.href = '/usuario/Correo'} */>
                        <Image src={correoIcon} alt="correo" width={80} height={80} />
                        <span>Correo</span>
                    </button>
                    <button className='m-4 flex flex-col items-center'/*  onClick={() => window.location.href = '/usuario/Propuestas'} */>
                        <Image src={propuestasIcon} alt="propuestas" width={80} height={80} />
                        <span>Propuestas</span>
                    </button>
                    <button className='m-4 flex flex-col items-center' onClick={() => window.location.href = '/usuario/Cuenta'}>
                        <Image src={editCuentaIcon} alt="edit" width={80} height={80} />
                        <span>Mi cuenta</span>
                    </button>
                </div>
            
                <h1 className='mt-40 mb-10'>Mis Talleres</h1>
                <div className='flex ml-5 mt-5'>
                    {cursos.map((curso) => (
                        <div key={curso.id} className='m-4'>
                            <img src={""} alt={curso.nombre} />
                            <h2>{curso.nombre}</h2>

                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 py-5 border-t bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
        </main>
    )
}
export default principal;