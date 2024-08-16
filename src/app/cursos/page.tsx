"use client"
import React, {useEffect, useState } from "react";
import Navigate from "../../helpers/navigate/page";
import But_aside from "../../helpers/but_aside/page";
import { createCurso, getCursos } from "../../services/cursos";

async function handleCreateCurso() {
    try {
        const newCurso = await createCurso({
            nombre: "Curso de React",
            year: 2099,
            descripcion: "Curso de React para principiantes"
        });
        console.log("Curso creado!!:", newCurso);
    } catch (error) {
        console.error("Imposible crear", error);
    }
}


const cursos: React.FC = () => {
    const [cursos, setCursos] = useState<{ id: number; nombre: string; year: number; descripcion: string; }[]>([]);

    async function handleGetCurso() {
        try {
            const curs = await getCursos();
            setCursos(curs);
        } catch (error) {
            console.error("Imposible obtener cursos", error);
        }
    }
    if (cursos.length === 0) {
        handleGetCurso();
    }
   /* useEffect(() => {
        handleGetCurso();
    }, [cursos]);*/

    return (
        <main>
            <Navigate />
           <h1 className="flex mt-10 ml-20 text-3xl">Talleres</h1>
            <div className="mt-5 border bg-slate-400 p-1 absolute left-1/3">
                <div className="grid grid-cols-5 gap-4 mt-4">
                    {cursos.map((curso) => (
                        <div key={curso.id} className="border p-2 mx-4">
                            <h3>{curso.nombre}</h3>
                        </div>
                    ))}
                </div>
                <button onClick={handleCreateCurso} className="bg-red-700 m-4 py-2 px-5">Crear Curso</button>
            </div>
            <div >
                <But_aside />
            </div>

        </main>
    );
}
export default cursos;