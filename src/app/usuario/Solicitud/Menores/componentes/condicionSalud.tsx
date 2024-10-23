"use client"
import React, { useState } from 'react';


interface Datos {
    setDatosSalud: React.Dispatch<React.SetStateAction<{
        enfermedad: string;
        alergia: string;
        tratamiento: string;
        terapia: string;
        consultasEspecialistas: string;
        motivoInscripcion: string;
    }>>;
}

const CondicionSalud: React.FC<Datos> = ({ setDatosSalud }) => {
    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [inputEnfermedad, setInputEnfermedad] = useState<boolean>(false)
    const [inputAlergia, setInputAlergia] = useState<boolean>(false)
    const [inputTratamiento, setInputTratamiento] = useState<boolean>(false)
    const [inputTerapia, setInputTerapia] = useState<boolean>(false)
    const [inputConsultasEspec, setInputConsultasEspec] = useState<boolean>(false)

    return (
        <div>
            <div className='p-4'>
                <h3 className='p-2 shadow-md w-60'>Inscripción a talleres - Menores</h3>
            </div>
            <div className='bg-green-200 flex flex-col p-5 items-center'>
                <h1 className='flex font-bold text-2xl'>Condición de salud</h1>
                <div className='flex bg-red-300 flex-col w-[80vh] justify-center items-center'>
                    <div className='border-b w-full p-2'>
                        <label htmlFor="enfermedad">¿Tiene o ha tenido alguna enfermedad?</label>
                        <div className='flex items-center '>
                            <input
                                id='enfermedad'
                                type="text"
                                className='w-[40vh] rounded-md border'
                                onChange={(e) => setDatosSalud(prev => ({ ...prev, enfermedad: e.target.value }))}
                                disabled={!inputEnfermedad}
                            />
                            <div className='space-x-5 mx-auto'>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, enfermedad: "" }));
                                    setInputEnfermedad(true);
                                }}>Si</button>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, enfermedad: "" }));
                                    setInputEnfermedad(false);
                                }}>No</button>
                            </div>
                        </div>
                    </div>
                    <div className='border-b w-full p-2'>
                        <label htmlFor="alergia">¿Presenta alguna alergia?</label>
                        <div className='flex items-center'>
                            <input
                                id='alergia'
                                type="text"
                                className='w-[40vh] rounded-md border'
                                onChange={(e) => setDatosSalud(prev => ({ ...prev, alergia: e.target.value }))}
                                disabled={!inputAlergia}
                            />
                            <div className='space-x-5 mx-auto'>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, alergia: "" }));
                                    setInputAlergia(true);
                                }}>Si</button>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, alergia: "" }));
                                    setInputAlergia(false);
                                }}>No</button>
                            </div>
                        </div>
                    </div>
                    <div className='border-b w-full p-2'>
                        <label htmlFor="tratamiento">¿Está actualmente con algún tratamiento y/o medicación?</label>
                        <div className='flex items-center'>
                            <input
                                id='tratamiento'
                                type="text"
                                className='w-[40vh] rounded-md border'
                                onChange={(e) => setDatosSalud(prev => ({ ...prev, tratamiento: e.target.value }))}
                                disabled={!inputTratamiento}
                            />
                            <div className='space-x-5 mx-auto'>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, tratamiento: "" }));
                                    setInputTratamiento(true);
                                }}>Si</button>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, tratamiento: "" }));
                                    setInputTratamiento(false);
                                }}>No</button>
                            </div>
                        </div>
                    </div>
                    <div className='border-b w-full p-2'>
                        <label htmlFor="terapia">¿Se encuentra realizando terapia/s?</label>
                        <div className='flex items-center'>
                            <input
                                id='terapia'
                                type="text"
                                className='w-[40vh] rounded-md border'
                                onChange={(e) => setDatosSalud(prev => ({ ...prev, terapia: e.target.value }))}
                                disabled={!inputTerapia}
                            />
                            <div className='space-x-5 mx-auto'>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, terapia: "" }));
                                    setInputTerapia(true);
                                }}>Si</button>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, terapia: "" }));
                                    setInputTerapia(false);
                                }}>No</button>
                            </div>
                        </div>
                    </div>
                    <div className='border-b w-full p-2'>
                        <label htmlFor="consultasEspecialistas">¿Ha llevado a cabo consultas con especialistas? (neurologo, cardiologo, fisioterapeuta, etc.)</label>
                        <div className='flex items-center '>
                            <input
                                id='consultasEspecialistas'
                                type="text"
                                className='w-[40vh] rounded-md border'
                                onChange={(e) => setDatosSalud(prev => ({ ...prev, consultasEspecialistas: e.target.value }))}
                                disabled={!inputConsultasEspec}
                            />
                            <div className='space-x-5 mx-auto'>
                            <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, consultasEspecialistas: "" }));
                                    setInputConsultasEspec(true);
                                }}>Si</button>
                                <button type="button" className="bg-black text-white rounded-full px-5 py-1" onClick={() => {
                                    setDatosSalud(prev => ({ ...prev, consultasEspecialistas: "" }));
                                    setInputConsultasEspec(false);
                                }}>No</button>
                            </div>
                        </div>
                    </div>

                    <div className=' w-full p-2'>
                        <label htmlFor="MotivoInscripcion">¿Cuál es el motivo de que su hijo/a asista a casa jardín? (ej. Recreación, aprendizaje, vínculos)</label>
                        <input
                            type="text"
                            className='w-[40vh] rounded-md border'
                            onChange={(e) => setDatosSalud(prev => ({ ...prev, motivoInscripcion: e.target.value }))} />
                    </div>
                </div>
            </div>


        </div>
    )
}
export default CondicionSalud;