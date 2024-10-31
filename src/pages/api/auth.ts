'use server'
import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';

// Para verificar que el usuario esté logeado, sino lo está lo redirige a la página de login
export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Obtener la cookie desde la solicitud
        const cookieHeader = req.headers.cookie;
        const token = cookieHeader?.split('; ').find(row => row.startsWith('user='))?.split('=')[1];

        if (!token) {
            return res.status(401).json({ error: 'Usuario no Autenticado' });
        }

        return res.status(200).end();
    } catch (error) {
        console.error("Error al verificar el JWT:", error);
        return res.status(500).json({ error: 'Error de server' });
    }
}
