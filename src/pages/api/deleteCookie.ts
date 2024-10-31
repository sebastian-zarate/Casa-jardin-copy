import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Verifica que sea una solicitud POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Establece la cookie con una fecha de expiración en el pasado para eliminarla
    res.setHeader('Set-Cookie', 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict');

    // Envía una respuesta indicando que la cookie ha sido eliminada
    return res.status(200).json({ message: 'Cookie eliminada correctamente' });
}
