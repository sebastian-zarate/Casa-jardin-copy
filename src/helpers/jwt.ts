import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";


const secret = process.env.SECRET;
const key = new TextEncoder().encode(secret);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(key)
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
    return payload;
}

export const verifyJWT = (token: string) => {
    return jwtVerify(token, key, { algorithms: ["HS256"] });
}

export async function getUserFromCookie() {
  try {
      // Obtener la cookie desde la solicitud
      const cookieStore = cookies();
      const token = cookieStore.get("user")?.value;

      if (!token) {
          return null; // No hay cookie o está vacía
      }

      // Verificar y decodificar el JWT
      const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });

      return payload; // Retorna la información decodificada del usuario
  } catch (error) {
      console.error("Error al verificar el JWT:", error);
      return null; // En caso de error, retorna null
  }
}