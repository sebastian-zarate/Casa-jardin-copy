'use server'
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyJWT } from '@/helpers/jwt';
import { getAlumnoByEmail } from '@/services/Alumno';
import { getProfesionalByEmail } from '@/services/profesional';
import { getAdminByEmail } from '@/services/admin';

// Para obtener la información del usuario
export default async function userDataHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Obtener la cookie desde la solicitud
        const cookieHeader = req.headers.cookie;
        const token = cookieHeader?.split('; ').find(row => row.startsWith('user='))
            ?.split('=')[1];

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Verificar y decodificar el JWT
        const { payload } = await verifyJWT(token);

        // Obtener el usuario desde la base de datos utilizando el email del payload
        let user: any;
        //switch para saber en que tabla buscar el usuario
        switch (payload.rolId) {
            case 1:
                 user = await getAdminByEmail(String(payload.email));
                break;
            case 2:
                 user = await getAlumnoByEmail(String(payload.email));
                break;
            case 3:
                user = await getProfesionalByEmail(String(payload.email));
                break;
            default:
                user = null;
                break;
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Retornar la información del usuario
        console.log("User data:", user);
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error al verificar el JWT:", error);
        return res.status(500).json({ error: 'Error retrieving user data' });
    }
}


