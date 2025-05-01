
import React, { use, useEffect, useRef, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';


interface ProvinciaPros {
    setprovincia: React.Dispatch<React.SetStateAction<string | null>>;
    provincia: string | null;
    register: UseFormRegister<{ direccion: { localidad: string; provincia: string; pais: "Argentina"; calle: string; numero: number; } }>
    
}
const Provincias: React.FC<ProvinciaPros> = ({register, setprovincia, provincia}) => {
    const [provinces, setProvinces] = useState([]);
    const [habilitarProv, setHabilitarProv] = useState<boolean>(false)

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch("https://apis.datos.gob.ar/georef/api/provincias")
                const responseJson = await response.json();
                setProvinces(responseJson.provincias);
            } catch (error) {
                console.error('Error al obtener las provincias:', error);
            }
        };
        if(provinces.length === 0) fetchProvinces();
        fetchProvinces();
    }, [provinces]);

    return (
        <div>
            <select onClick={()=> setHabilitarProv(true)} {...register("direccion.provincia")} onChange={(e) => {setprovincia(String(e.target.value)); console.log("Id de provincia seleccionada:"+ Number(e.target.value))}} className=' mt-1 border p-2 rounded w-full text-sm'>
                <option value="">{(!provincia || habilitarProv ) ? "Seleccione una provincia" :provincia }</option>
                {provinces.map((province: { id: string; nombre: number }) => (
                    <option key={province.id} value={province.nombre}>
                        {province.nombre}
                    </option>
                ))}
            </select>

        </div>

    );
};
export default Provincias;
