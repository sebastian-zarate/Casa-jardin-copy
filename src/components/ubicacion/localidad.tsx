// components/LocalitiesSearch.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/helpers/Api';

interface localidadProps {
    provinciaId: number | null
    setLocalidadId: React.Dispatch<React.SetStateAction<number | null>>;
}

const Localidades: React.FC<localidadProps> = ({ provinciaId, setLocalidadId }) => {
    const [localities, setLocalities] = useState([]);
    useEffect(() => {
        const handleProvinceChange = async () => {
            try {
                const response = await axios.get(API + `localidades?provincia=${provinciaId}&max=900`);
                const sortedLocalities = response.data.localidades.sort((a: { nombre: string }, b: { nombre: string }) => a.nombre.localeCompare(b.nombre));
                setLocalities(sortedLocalities);
            } catch (error) {
                console.error('Error al obtener las localidades:', error);
            }
        };
        if (localities.length === 0) {
            handleProvinceChange();
        }

    }, [localities]);

    return (
        <div>
            <select onChange={(e) => setLocalidadId(Number(e.target.value))}>
                <option value="">Selecciona una localidad</option>
                {localities.map((locality: { nombre: string, id: number }) => (
                    <option key={locality.id} value={locality.id}>
                        {locality.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Localidades;
