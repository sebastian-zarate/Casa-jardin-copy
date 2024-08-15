"use client"
import React from "react";
import { createCurso } from "../services/cursos";

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
function Page() {
    return (
        <main>
            <button onClick={handleCreateCurso} className="bg-red-700">Crear Curso</button>
        </main>
    );
}
export default Page;