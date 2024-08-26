"use client";
import Image from 'next/image';
import BackgroundLibrary from '../../../../public/Images/BookShell.jpg';
import Logo from '../../../../public/Images/LogoCasaJardin.png';
import { useState, useEffect } from "react";
import { createAlumno } from "../../../services/Alumno";
import { dir } from 'console';

function Signup() {
  // Estados para manejar los datos del formulario y errores
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [boxError, setBoxError] = useState(false);
  const [error, setError] = useState("");

  // Efecto para ocultar el mensaje de error después de 3 segundos
  useEffect(() => {
    if (boxError) {
      const intervalId = setInterval(() => {
        setBoxError(false);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [boxError]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const form = event.target as HTMLFormElement;
    const nombre = (form.nombre as HTMLInputElement).value;
    const apellido = (form.apellido as HTMLInputElement).value;
    const email = (form.email as HTMLInputElement).value;
    const password = (form.password as HTMLInputElement).value;
    const confirmPassword = (form.confirmPassword as HTMLInputElement).value;

    // Validaciones de contraseñas
    const MIN_PASSWORD_LENGTH = 8;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setBoxError(true);
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
      setBoxError(true);
      return;
    }

    

    // Preparar los datos para enviar
    const data = {
      nombre,
      apellido,
      email,
      password,
      telefono: 76512360,
      dni: 12345678,
      direccionId: 2,
    };

    try {
      // Intentar crear un nuevo usuario
      const response = await createAlumno(data);
      if (typeof response === "string") {
        // Si la respuesta es un string, es un mensaje de error
        setError(response);
        setBoxError(true);
      } else {
        // Si no hay error, redirigir al usuario a la página de inicio de sesión
        window.location.href = "/start/login";
      }
    } catch (err) {
      // Manejar cualquier error inesperado
      setError("Error al registrar el usuario");
      setBoxError(true);
    }
  };

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
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo con opacidad aplicada
          zIndex: 1,
        }}
      />

      <div
        style={{
          backgroundColor: 'rgba(28, 171, 235, 1)', // Fondo con opacidad aplicada
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          width: '90%',
          maxWidth: '600px',
          borderRadius: '50px', // Bordes redondeados
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Sombra para dar profundidad
          textAlign: 'left',
          alignItems: 'center',
        }}
      >
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="Logo Casa Jardin" width={150} height={150} />
        </div>
        <div className="flex flex-col items-center block text-lg font-medium" style={{ marginBottom: '20px', marginTop: '10px' }}>
          <h2>Registrarte</h2>
        </div>
        {boxError && (
          <div className="mb-4 text-red-600">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-lg font-medium">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ padding: '3px', borderRadius: '5px', marginBottom: '20px', width: '400px' }}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium">Apellido</label>
            <input
              type="text"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              style={{ padding: '3px', borderRadius: '5px', marginBottom: '20px', width: '400px' }}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '3px', borderRadius: '5px', marginBottom: '20px', width: '400px' }}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '3px', borderRadius: '5px', marginBottom: '20px', width: '400px' }}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ padding: '3px', borderRadius: '5px', marginBottom: '20px', width: '400px' }}
              required
            />
          </div>

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
