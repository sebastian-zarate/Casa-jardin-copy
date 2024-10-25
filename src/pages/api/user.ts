import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import { getAlumnoByEmail } from '@/services/Alumno';

const secret = process.env.SECRET;
const key = new TextEncoder().encode(secret);

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Asegúrate de que este código se ejecute en el servidor

        // Obtener la cookie desde la solicitud
        const cookieHeader = req.headers.cookie;
        const token = cookieHeader?.split('; ').find(row => row.startsWith('user='))
            ?.split('=')[1];

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Verificar y decodificar el JWT
        const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });

        // Obtener el usuario desde la base de datos utilizando el email del payload
        const user = await getAlumnoByEmail(String(payload.email)); // Suponiendo que el payload tiene el email

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
