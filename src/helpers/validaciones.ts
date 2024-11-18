export function validateDni(dni: string) {
    if (!dni) {
        return "El DNI no puede estar vacío.";
    }

    dni = dni.trim(); // Eliminar espacios en blanco

    // Validar que sea solo números
    const dniRegex = /^\d+$/;
    if (!dniRegex.test(dni)) {
        return "El DNI debe contener solo números.";
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
    if(email.length > 255){
        return "El email no puede tener más de 255 caracteres.";
    }

    return null; // Retornar null si no hay errores
}

export function validatePasswordComplexity(password:string) {
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
    if(!lengthRegex.test(password)){
        return "La contraseña debe tener al menos 8 caracteres.";
    }
    return null;
}

export function validateDireccion(pais?:string, provincia?:string, localidad?:string, calle?:string, numero?:number){
    const caracEspeciales = /[!@#$%^&*(),.?":{}|<>]/;
    if (pais && /\d/.test(pais)) {
        return "El país no debe contener números";
    }
    if(pais && caracEspeciales.test(pais)){
        return "El país no puede contener caracteres especiales";
    }
    if (provincia && /\d/.test(provincia)) {
        return "La provincia no debe contener números";
    }
    if(provincia && caracEspeciales.test(provincia)){
        return "La provincia no puede contener caracteres especiales";
    }
    if (localidad && /\d/.test(localidad)) {
        return "La localidad no debe contener números";
    }
    if(localidad && caracEspeciales.test(localidad)){
        return "La localidad no puede contener caracteres especiales";
    }
    if (calle && /\d/.test(calle)) {
        return "La calle no debe contener números";
    }
    if(calle && caracEspeciales.test(calle)){
        return "La calle no puede contener caracteres especiales";
    }
    if (numero && isNaN(numero)) {
        return "El número de la dirección debe ser un número";
    }
    if(numero && numero < 0){
        return "El número de la dirección no puede ser negativo";
    }
    return null;
}

export function validateNombre(nombre:string){
    const caracEspeciales = /[!@#$%^&*(),.?":{}|<>]/;
    if (/\d/.test(nombre)) {
        return "El nombre no debe contener números";
    }
    if(nombre && caracEspeciales.test(nombre)){
        return "El nombre no puede contener caracteres especiales";
    }
    if (nombre && nombre.length < 2) {
        return "El nombre debe tener al menos 2 caracteres";
    }
    return null;
}

export function validateApellido(apellido:string){
    const caracEspeciales = /[!@#$%^&*(),.?":{}|<>]/;
    if (/\d/.test(apellido)) {
        return "El apellido no debe contener números";
    }
    if(apellido && caracEspeciales.test(apellido)){
        return "El apellido no puede contener caracteres especiales";
    }
    if (apellido && apellido.length < 2) {
        return "El apellido debe tener al menos 2 caracteres";
    }
    return null;
}

export function validatePhoneNumber(phone: string) {
    // Expresión regular para validar teléfono en Argentina con formato internacional y nacional
    const phoneRegex = /^(?:\+54|0054)(?:\d{1,4})\d{4}\d{4}$/;
  
    if (!phoneRegex.test(phone)) {
      throw new Error("El número de teléfono no es válido. Debe tener el formato correcto.");
    }
  }
