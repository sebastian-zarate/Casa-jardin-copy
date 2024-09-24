
import React, { use, useEffect, useRef, useState } from 'react';
import axios from 'axios';                  //libreria para hacer peticiones http
import { API } from '@/helpers/Api';

interface ProvinciaPros {
    setprovinciaId: React.Dispatch<React.SetStateAction<number | null>>;
}
const Provincias: React.FC<ProvinciaPros> = ({setprovinciaId}) => {
    const [provinces, setProvinces] = useState([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(API +'provincias');
                setProvinces(response.data.provincias);
            } catch (error) {
                console.error('Error al obtener las provincias:', error);
            }
        };
        if(provinces.length === 0) fetchProvinces();
        fetchProvinces();
    }, [provinces]);

    return (
        <div>
            <select onChange={(e) => {setprovinciaId(Number(e.target.value)); console.log("Id de provincia seleccionada:"+ Number(e.target.value))}}>
                <option value="" >Selecciona una provincia</option>
                {provinces.map((province: { id: string; nombre: number }) => (
                    <option key={province.id} value={province.id}>
                        {province.nombre}
                    </option>
                ))}
            </select>

        </div>

    );
};
export default Provincias;
