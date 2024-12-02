import { emailExists } from "@/services/Alumno";

export function validateDni(dni: string) {
    //console.log("dni",dni);

    dni = dni.trim(); // Eliminar espacios en blanco
    if(dni == null){
        return "El DNI no puede estar vacío.";
    }
    // Validar que sea solo números
    const dniRegex = /^\d+$/;
    if (!dniRegex.test(dni)) {
        return "El DNI debe contener solo números positivos y no puede estar vacio.";
    }

    // Validar longitud
    if (dni.length < 7 || dni.length > 8) {
        return "El DNI debe tener entre 7 y 8 dígitos.";
    }

    // Validar valores no válidos
    const invalidDnis = ["00000000", "11111111", "12345678"];
    if (invalidDnis.includes(dni)) {
        return "El DNI ingresado no es válido.";
    }

    // Validar rango
    const dniNumber = parseInt(dni, 10);
    if (dniNumber < 1000000 || dniNumber > 99999999) {
        return "El DNI ingresado está fuera del rango válido.";
    }
    return null; // Retornar null si no hay errores
}

export function validateEmail(email: string) {
    if (!email) {
        return "El email no puede estar vacío.";
    }

    email = email.trim(); // Eliminar espacios en blanco

    // Validar formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "El email no es válido (estructura mínima valida: A@B.C)";
    }
    if (email.length > 255) {
        return "El email no puede tener más de 255 caracteres.";
    }

    
    return null; // Retornar null si no hay errores
}

export function validatePasswordComplexity(password: string) {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const lengthRegex = /.{8,}/;

    if (!uppercaseRegex.test(password)) {
        return "La contraseña debe incluir al menos una letra mayúscula.";
    }

    if (!lowercaseRegex.test(password)) {
        return "La contraseña debe incluir al menos una letra minúscula.";
    }

    if (!numberRegex.test(password)) {
        return "La contraseña debe incluir al menos un número.";
    }
    if (!lengthRegex.test(password)) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }
    return null;
}

export function validateDireccion(pais?: string, provincia?: string, localidad?: string, calle?: string, numero?: number) {
    const caracEspeciales = /[!@#$%^&*(),.?":{}|<>]/;
    console.log(pais, provincia, localidad, calle, numero);
    if(!pais){
        return "El país no puede estar vacío";
    }
    if(!provincia){
        return "La provincia no puede estar vacía";
    }
    if(!localidad){
        return "La localidad no puede estar vacía";
    }
    if(!calle){
        return "La calle no puede estar vacía";
    }
    if(!numero){
        return "El número de la dirección no puede estar vacío";
    }
    if (pais && /\d/.test(pais)) {
        return "El país no debe contener números";
    }
    if (pais && caracEspeciales.test(pais)) {
        return "El país no puede contener caracteres especiales";
    }
    if (provincia && /\d/.test(provincia)) {
        return "La provincia no debe contener números";
    }
    if (provincia && caracEspeciales.test(provincia)) {
        return "La provincia no puede contener caracteres especiales";
    }
    if (localidad && /\d/.test(localidad)) {
        return "La localidad no debe contener números";
    }
    if (localidad && caracEspeciales.test(localidad)) {
        return "La localidad no puede contener caracteres especiales";
    }
    if (calle && caracEspeciales.test(calle)) {
        return "La calle no puede contener caracteres especiales";
    }
    if (numero && isNaN(numero)) {
        return "El número de la dirección debe ser un número";
    }
    if (numero && numero < 0) {
        return "El número de la dirección no puede ser negativo";
    }
    if (pais.length < 1) {
        return ("El país debe tener al menos 2 caracteres.");
    }
    if (provincia.length < 1) {
        return ("La provincia debe tener al menos 2 caracteres.");
    }
    if (localidad.length < 1 ) {
        return ("La localidad debe tener al menos 2 caracteres.");
    }
    if (calle.length < 1 ) {
        return ("La calle debe tener al menos 2 caracteres.");
    }
    return null;
}

export function validateNombre(nombre: string) {
    const caracEspeciales = /[!@#$%^&*(),.?":{}|<>]/;
    if (/\d/.test(nombre)) {
        return "El nombre no debe contener números";
    }
    if (nombre && caracEspeciales.test(nombre)) {
        return "El nombre no puede contener caracteres especiales";
    }
    if (nombre && nombre.length < 2) {
        return "El nombre debe tener al menos 2 caracteres";
    }
    if (!nombre) {
        return "El nombre no puede estar vacío";
    }
    return null;
}

export function validateApellido(apellido: string) {
    const caracEspeciales = /[!@#$%^&*(),.?":{}|<>]/;
    if (/\d/.test(apellido)) {
        return "El apellido no debe contener números";
    }
    if (apellido && caracEspeciales.test(apellido)) {
        return "El apellido no puede contener caracteres especiales";
    }
    if (apellido && apellido.length < 2) {
        return "El apellido debe tener al menos 2 caracteres";
    }
    if (!apellido) {
        return "El apellido no puede estar vacío";
    }
    return null;
}

export function validatePhoneNumber(phone: string) {
    // Expresión regular para validar teléfono en Argentina con formato internacional y nacional
    const phoneRegex = /^(?:\d{1,4})\d{4}\d{4}$/;
    const numberRegex = /^\d+$/;
    console.log("phone", phone);
    //si el teléfono es 0, no se valida, porque es nulo
    if (phone.length < 9 || phone.length > 12) {
        return ("El número de teléfono debe tener entre 9 y 12 dígitos.");
    }

    if (!phoneRegex.test(phone)) {
        return ("El número de teléfono no es válido.");
    }
    if (!numberRegex.test(phone)) {
        return ("El número de teléfono debe contener solo números.");
    }
    if(Number(phone) < 0){
        return ("El número de teléfono no puede ser negativo.");
    }
    return null;
}

