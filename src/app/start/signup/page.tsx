"use client";
import Image from 'next/image';
import BackgroundLibrary from '../../../../public/Images/BookShell.jpg';
import ImageSignup from '../../../../public/Images/ImageSignup.jpg';
import Logo from '../../../../public/Images/LogoCasaJardin.png';
import TituloCasaJardin from '../../../../public/Images/TituloCasaJardin.png';
import { useState, useEffect } from "react";
import { createAlumno, emailExists } from "../../../services/Alumno";
import { validateApellido, validateEmail, validateNombre, validatePasswordComplexity } from '@/helpers/validaciones';

function Signup() {
    // Se crean los estados para los campos del formulario de registro
    // y se inicializan con un string vacio
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState<Date>();
    const Hoy = new Date();
    const edadMinima = new Date(Hoy.getFullYear() - 3, Hoy.getMonth(), Hoy.getDate());
    const edadMaxima = new Date(Hoy.getFullYear() - 100, Hoy.getMonth(), Hoy.getDate());

    const [error, setError] = useState("");
    // en para los errores de registro se muestra un mensaje de error por 5 segundos
    // 
    useEffect(() => {
        if (error) {
            const intervalId = setInterval(() => setError(""), 5000);
            return () => clearInterval(intervalId);
        }
    }, [error]);




    // en esta funsion se valida el formulario de registro 
    // para que los datos sean correctos
    //region validateForm
    const validateForm = async (trimmedData: { nombre: string; apellido: string; email: string; password: string; fechaNacimiento: Date | undefined; }) => {
        const estado = await emailExists(email)
        if (estado) {
          return "El email ya está registrado.";
        }
        
        let validateInput;
        validateInput = validateNombre(nombre);
        if (typeof(validateInput) === "string") return validateInput;
    
        validateInput = validateApellido(apellido);
        if (validateInput) return validateInput;
    
        validateInput = validateEmail(email);
        if (validateInput) return validateInput;
     
    
        if (validateInput) return validateInput;
    
        validateInput = validatePasswordComplexity(password);
        if (validateInput) return validateInput;
        // fecha de nacimiento
       
       
        if(password !== confirmPassword) return "Las contraseñas no coinciden";
    
        return "";
    
    
      };
    // en esta funsion se envian los datos del formulario de registro
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Recortar espacios en blanco de cada campo antes de validar o enviar los datos
        const trimmedData = {
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          email: email.trim(),
          password: password.trim(),
          fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        };
      
        // Llamar a la función validateForm
        const validationError = await validateForm(trimmedData);
        // Si hay un error en la validación se muestra el mensaje de error
        if (validationError) {
          setError(validationError);
          return;
        }
      
        // Enviar los datos recortados al servidor
        try {
          const response = await createAlumno(trimmedData);
          if (typeof response === "string") {
            setError(response);
          } else {
            // Si el usuario se registró correctamente se redirige a la página de login
            window.location.href = "/start/login";
          }
        } catch (err) {
          // En caso de error se muestra un mensaje de error
          setError("Error al registrar el usuario");
        }
      };


    // se muestra el formulario de registro
    //region return
    return (
        /* From Uiverse.io by themrsami */
        <main style={{ backgroundColor: "#3f8df5" }}>
            <button
                className="bg-white text-center w-10 rounded-2xl top-20 md:left-20 lg:left-20 absolute text-black text-xl font-semibold group"
                type="button"
                onClick={() => window.location.href = "/start/Inicio"}
            >
                <div
                    className="bg-slate-300 rounded-xl h-12 w-10 flex items-center justify-center absolute left-1 top-[4px] hover:bg-slate-400 z-10 duration-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1024 1024"
                        height="20px"
                        width="20px"
                    >
                        <path
                            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                            fill="#000000"
                        ></path>
                        <path
                            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                            fill="#000000"
                        ></path>
                    </svg>
                </div>

            </button>
            <div className="relative  py-3 sm:max-w-xl sm:mx-auto top-20" >
                <div
                    className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow-2xl rounded-3xl sm:p-10"
                >

                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Registrate a Casa Jardín
                        </h1>
                        <div className="flex justify-center mb-6">
                            <Image src={Logo} alt="Logo Casa Jardin" width={150} height={150} />
                        </div>
                        {(
                            <div className="mb-4 text-red-600 mx-16">
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label
                                    className="font-semibold text-sm text-gray-600 pb-1 block"
                                    htmlFor="nombre"

                                >
                                    Nombre
                                </label>
                                <input
                                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    id="nombre"
                                    pattern = '[A-Za-zÀ-ÿ ]+'

                                    placeholder='Ej: Juan'
                                     maxLength={40 }
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="font-semibold text-sm text-gray-600 pb-1 block"
                                    htmlFor="apellido"
                                >
                                    Apellido
                                </label>
                                <input
                                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    type="text"
                                    id="apellido"
                                    
                                    pattern='[A-Za-zÀ-ÿ ]+'
                                    placeholder='Ej: Pérez'
                                    maxLength={40}

                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="font-semibold text-sm text-gray-600 pb-1 block"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <input
                                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    type="email"
                                    id="email"
                                    placeholder='Ej: dominio@email.com'
                                    maxLength={70}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="font-semibold text-sm text-gray-600 pb-1 block"
                                    htmlFor="password"
                                >
                                    Contraseña
                                </label>
                                <input
                                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    type="password"
                                    id="password"
                                    placeholder='Ingrese su contraseña'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="font-semibold text-sm text-gray-600 pb-1 block"
                                    htmlFor="Confirmpassword"
                                >
                                    Confirmar contraseña
                                </label>
                                <input
                                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    type="password"
                                    id="Confirmpassword"
                                    placeholder='Confirme su contraseña'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="font-semibold text-sm text-gray-600 pb-1 block"
                                    htmlFor="fechaNac"
                                >
                                    Fecha de nacimiento
                                </label>
                                <input
                                    className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    type="date"
                                    id="fechaNac"
                                    value={!fechaNacimiento ? "" : !isNaN(fechaNacimiento.getTime()) ? fechaNacimiento.toISOString().split('T')[0] : ""}
                                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]} // Set min to 100 years ago
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0]} // Set max to 3 years ago
                                    onChange={(e) => setFechaNacimiento(new Date(e.target.value))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <button
                                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                                type="submit"
                            >
                                Registrarse
                            </button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                            <span className='text-xs text-gray-500 '>Tienes una cuenta creada?</span>
                            <a
                                className="text-xs text-gray-500 hover:text-gray-600  dark:text-gray-400 hover:underline"
                                href="/start/login"
                            >
                                Inicie Sesión
                            </a>
                            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                        </div>
                    </form>
                </div>
            </div>
        </main>


    );
}

export default Signup;
