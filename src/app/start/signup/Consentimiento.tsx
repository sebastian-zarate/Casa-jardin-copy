"use client"
import React, { useState } from 'react';
import { XCircle} from "lucide-react";
const Consentimiento: React.FC = () => {

    // Estado para almacenar mensajes de error
    const [alertaFinal, setAlertaFinal] = useState<boolean>(false);

    return (
        <div className='w-full'>
        {alertaFinal && <div className=" bg-slate-50 w-2/3 p-6 rounded-xl shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button className=" text-gray-700 rounded-full absolute right-2 top-2 hover:bg-red-400"
                    onClick={() => setAlertaFinal(false)}>
                    <XCircle className="" />
                </button>
            <h2 className="text-lg font-bold mb-2">Términos y condiciones</h2>
            <p className="text-sm text-gray-600 mb-4">
            Al registrarse y utilizar la plataforma de Casa Jardín, usted (Padre/Madre/Tutor o mayor de edad responsable) declara haber leído y aceptado estos Términos y Condiciones, así como nuestra Política de Privacidad.
                <strong> Si no está de acuerdo, por favor, absténgase de utilizar nuestros servicios.</strong>
            </p>
        </div>
        }
<div className='flex flex-col items-center mt-8 border-t p-4 text-center'>
    <p className="text-sm">
        Al hacer clic en Registrarse, usted está aceptando el&nbsp;
        <button className="text-red-500 underline font-medium" onClick={() => setAlertaFinal(true)}>
            Consentimiento
        </button>
    </p>
</div>
    </div>
    )
}
export default Consentimiento;