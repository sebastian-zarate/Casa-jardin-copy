"use client";
import Image from 'next/image';
import BackgroundLibrary from '../../../../public/Images/BookShell.jpg';
import Logo from '../../../../public/Images/LogoCasaJardin.png';
import { useState, useEffect } from "react";
import { createAlumno, getLocalidadesByProvincia, getPaises, getProvinciasByPais } from "../../../services/Alumno";

function Signup() {
  // Se crean los estados para los campos del formulario de registro
  // y se inicializan con un string vacio
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  
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
  const validateForm = () => {
    if (nombre.length < 2) return "El nombre debe tener al menos 2 caracteres";
    if (apellido.length < 2) return "El apellido debe tener al menos 2 caracteres";
    if (!email.includes('@')) return "El email debe ser válido";
    if (password !== confirmPassword) return "Las contraseñas no coinciden";
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    const passwordRegex = /^(?=.*[A-Z])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) return "La contraseña debe tener al menos una letra mayúscula y 8 caracteres";
    return "";
  };
  // en esta funsion se envian los datos del formulario de registro
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // se llama a la funcion validateForm
    const validationError = validateForm();
    // si hay un error en la validacion se muestra el mensaje de error
    if (validationError) {
      setError(validationError);
      return;
    }
    // se crea un objeto con los datos del formulario para luego enviarlos al servidor
    const data = {
      nombre,
      apellido,
      email,
      password,
      
    };
    // se envian los datos al servidor para registrar el usuario
    try {
      const response = await createAlumno(data);
      if (typeof response === "string") {
        setError(response);
      } else {
        // si el usuario se registro correctamente se redirige a la pagina de login
        window.location.href = "/start/login";
      }
    } catch (err) {
      // en caso de error se muestra un mensaje de error
      setError("Error al registrar el usuario");
    }
  };


 // se muestra el formulario de registro
  return (
    <div
      style={{ 
        backgroundImage: `url(${BackgroundLibrary.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1,
        }}
      />
      <div
        style={{
          backgroundColor: 'rgba(28, 171, 235, 1)',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          width: '90%',
          maxWidth: '600px',
          borderRadius: '50px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'left',
          alignItems: 'center',
        }}
      >
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Logo Casa Jardin" width={150} height={150} />
        </div>
        <div
          className="flex flex-col items-center block text-lg font-medium"
          style={{ marginBottom: '20px', marginTop: '10px' }}
        >
          <h2>Registrarte</h2>
        </div>
        { (
          <div className="mb-4 text-red-600">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-wrap justify-between">
            <div style={{ flexBasis: '48%' }}>
              <label className="block text-lg font-medium">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  padding: '3px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  width: '100%',
                }}
                required
              />
            </div>

            <div style={{ flexBasis: '48%' }}>
              <label className="block text-lg font-medium">Apellido</label>
              <input
                type="text"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                style={{
                  padding: '3px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  width: '100%',
                }}
                required
              />
            </div>
          </div>

          <label className="block text-lg font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '3px',
              borderRadius: '5px',
              marginBottom: '20px',
              width: '100%',
            }}
            required
          />

          <label className="block text-lg font-medium">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '3px',
              borderRadius: '5px',
              marginBottom: '20px',
              width: '100%',
            }}
            required
          />

          <label className="block text-lg font-medium">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              padding: '3px',
              borderRadius: '5px',
              marginBottom: '20px',
              width: '100%',
            }}
            required
          />


        <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff4d4d',
              color: '#fff',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              marginBottom: '20px',
              width: '400px',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e60000')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff4d4d')}
          >
            Registrarse
          </button>
        </form>

        <div className="mt-4">
          <span className="font-medium">¿Tienes cuenta?</span>
          <a href="/start/login" className="font-bold text-black ml-2">
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
