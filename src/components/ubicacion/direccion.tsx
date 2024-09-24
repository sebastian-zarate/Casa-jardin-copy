// components/LocalitiesSearch.tsx
import React, { useState, useEffect } from 'react';

interface direccionProps {
    setCalle: React.Dispatch<React.SetStateAction<string | null>>;
    setNumero: React.Dispatch<React.SetStateAction<number | null>>;
}


const Direcciones: React.FC<direccionProps> = ({ setCalle, setNumero }) => {


    return (
        <div>
            <div>
                <label htmlFor="calle" className="block">Calle:</label>
                <input
                    type="calle"
                    id="calle"
                    name="calle"
                    onChange={e => setCalle(e.target.value)}
                    className="p-2 w-full border rounded"
                />
            </div>
            <div>
                <label htmlFor="numero" className="block">Número:</label>
                <input
                    type="numero"
                    id="numero"
                    name="numero"
                    onChange={e => setNumero(Number(e.target.value))}
                    className="p-2 w-full border rounded"
                />
            </div>
        </div>

    );
};

export default Direcciones;
