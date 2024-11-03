"use server"
import bcrypt from 'bcrypt';
// genera un hash de la contraseña ingresada
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Número de rondas para el salt
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}
// compara que los datos ingresados sean iguales a los datos de la base de datos
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
