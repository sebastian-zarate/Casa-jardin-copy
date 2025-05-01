// components/LocalitiesSearch.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/helpers/Api';
import { UseFormRegister } from 'react-hook-form';


interface localidadProps {
    provinciaName: string | null
    setLocalidad: React.Dispatch<React.SetStateAction<string | null>>;
    localidad: string | null;
    register: UseFormRegister<{ direccion: { localidad: string; provincia: string; pais: "Argentina"; calle: string; numero: number; } }>
}

const Localidades: React.FC<localidadProps> = ({ provinciaName, setLocalidad, localidad, register }) => {
    const [localities, setLocalities] = useState([]);
    const [habilitarLocalidades, setHabilitarLocalidades]= useState<Boolean>(false)

    useEffect(() => {
        const handleProvinceChange = async () => {
            try {
                const response = await axios.get(API + `localidades?provincia=${provinciaName}&max=900`);
                const sortedLocalities = response.data.localidades.sort((a: { nombre: string }, b: { nombre: string }) => a.nombre.localeCompare(b.nombre));
                setLocalities(sortedLocalities);
                
            } catch (error) {
                console.error('Error al obtener las localidades:', error);
            }
        };
/*         if (localities.length === 0) {
            handleProvinceChange();
        } */
        handleProvinceChange();

    }, [localities, provinciaName]);

    return (
        <div>
            <select {...register("direccion.localidad")} onClick={()=>setHabilitarLocalidades(true)}  onChange={(e) => {setLocalidad(String(e.target.value)); }} className=' border p-2 rounded mt-1 text-sm w-full'>
                <option>{ (!habilitarLocalidades && localidad) ? localidad: "Seleccione una localidad"}</option>
                {localities.map((locality: { nombre: string, id: number }) => (
                    <option key={locality.id} value={locality.nombre}>
                        {habilitarLocalidades && locality.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Localidades;
