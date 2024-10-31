
'use server'
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyJWT } from '@/helpers/jwt';


//llamada a la api para verificar que el usuario logeado sea un admin
export default async function userDataHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Obtener la cookie desde la solicitud
        const cookieHeader = req.headers.cookie;
        const token = cookieHeader?.split('; ').find(row => row.startsWith('user='))
            ?.split('=')[1];

        if (!token) {
            return res.status(401).json({ error: 'Usuario no logeado' });
        }

        // Verificar y decodificar el JWT
        const { payload } = await verifyJWT(token);

        //Verificar si el usuario es admin o profesional (osea que no es un alumno)
        if(payload.rolId === 2){
            return res.status(401).json({ error: 'La cuenta logeada no tiene Acceso de administarador' });
        }
        return res.status(200).end();
    } catch (error) {
        console.error("Error al verificar el JWT:", error);
        return res.status(500).json({ error: 'Error retrieving user data' });
    }
}
