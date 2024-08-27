"use client";

import React, { useEffect, useState } from "react";
import Navigate from "../../../helpers/Admin/navigate/page";
import But_aside from "../../../helpers/Admin/but_aside/page";
import { updateCurso, getCursos, deleteCurso, createCurso } from "../../../services/cursos";
import Image from "next/image";
import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import EditIcon from "../../../../public/Images/EditIcon.png";
import Background from "../../../../public/Images/Background.jpg";
import ButtonAdd from "../../../../public/Images/Button.png";
import { getImages } from "@/services/repoImage";

const Cursos: React.FC = () => {
    // Estado para almacenar la lista de cursos
    const [cursos, setCursos] = useState<{ id: number; nombre: string; year: number; descripcion: string}[]>([]);
    // Estado para almacenar el ID del curso seleccionado
    const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
    // Estado para almacenar los detalles del curso seleccionado
    const [cursoDetails, setCursoDetails] = useState<{ nombre: string; year: number; descripcion: string; }>({
        nombre: '',
        year: 2024,
        descripcion: ''
    });
    // Estado para almacenar mensajes de error
    const [errorMessage, setErrorMessage] = useState<string>("");

    //Estado para almacenar las imagenes
    const [images, setImages] = useState<any []>([]);
    // Efecto para obtener la lista de cursos al montar el componente
    useEffect(() => {
        fetchCursos(); // Llama a la función para obtener cursos
        fetchImages();
    }, []);

    // Efecto para actualizar los detalles del curso seleccionado cuando cambia el curso o el ID del curso
    useEffect(() => {
        if (selectedCursoId !== null) {
            const selectedCurso = cursos.find(curso => curso.id === selectedCursoId); // Busca el curso seleccionado
            if (selectedCurso) {
                setCursoDetails({
                    nombre: selectedCurso.nombre,
                    year: selectedCurso.year,
                    descripcion: selectedCurso.descripcion
                }); // Actualiza los detalles del curso
            }
        }
    }, [selectedCursoId, cursos]);

    // Función para obtener la lista de cursos
    async function fetchCursos() {
        try {
            let curs = await getCursos(); // Obtén la lista de cursos
            setCursos(curs); // Actualiza el estado con la lista de cursos
        } catch (error) {
            console.error("Imposible obtener cursos", error); // Manejo de errores
        }
    }

    // Función para manejar los cambios en los campos del formulario
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setCursoDetails(prevDetails => ({
            ...prevDetails,
            [name]: name === 'year' ? parseInt(value, 10) : value // Convierte `year` a número entero
        }));
    }

    // Función para validar los detalles del curso
    function validateCursoDetails() {
        const { nombre, year, descripcion } = cursoDetails;

        // Validar que el nombre tenga al menos 4 caracteres
        if (nombre.length < 4) {
            return "El nombre debe tener al menos 4 caracteres.";
        }
        // Validar que el año sea mayor o igual a 2024 y que tenga hasta 4 dígitos
        if (year < 2024 || year > 9999) {
            return "El año debe ser mayor o igual a 2024.";
        }
        // Validar que la descripción tenga al menos 10 palabras
        const descripcionWords = descripcion.trim().split(/\s+/).length;
        if (descripcionWords < 10) {
            return "La descripción debe tener al menos 10 palabras.";
        }
        // Validar que la descripción no tenga más de 300 palabras
        if (descripcionWords > 300) {
            return "La descripción no puede exceder las 300 palabras.";
        }
        return null; // Retorna null si no hay errores
    }


    // Función para manejar el guardado de cambios en el curso
    async function handleSaveChanges() {
        const validationError = validateCursoDetails(); // Llama a la función de validación
        if (validationError) {
            setErrorMessage(validationError); // Muestra el mensaje de error si hay un error
            return;
        }

        if (selectedCursoId !== null) {
            try {
                await updateCurso(selectedCursoId, cursoDetails); // Actualiza el curso
                setSelectedCursoId(null); // Resetea el curso seleccionado
                fetchCursos(); // Refresca la lista de cursos
                setErrorMessage(""); // Limpiar mensaje de error si todo fue bien
            } catch (error) {
                console.error("Imposible actualizar curso", error); // Manejo de errores
            }
        }
    }
    async function handleEliminarCurso(id: number) {
        try {
            //Ventana de confirmación para eliminar el curso
            if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
                await deleteCurso(id);
                console.log("Curso eliminado con éxito:", id);
                //Actualizar la lista de cursos despues de eliminar alguno de ellos
                setCursos(cursos.filter((curso) => curso.id !== id));
            }
        } catch (error) {
            console.error("Imposible eliminar", error); //Manejo de errores
        }
    }
    async function handleCreateCurso() {
        try {
            const validationError = validateCursoDetails(); // Valida los detalles del curso antes de crear

            if (validationError) {
                setErrorMessage(validationError); // Muestra el mensaje de error si la validación falla
                return;
            }
            const newCurso = await createCurso(cursoDetails);
            console.log("Curso creado!!:", newCurso);
            setCursos([...cursos, newCurso]);
            setSelectedCursoId(newCurso.id); // Cierra el formulario y resetea el curso seleccionado
            setCursoDetails({
                nombre: '',
                year: 2024,
                descripcion: ''
            });
            setErrorMessage(''); // Limpia el mensaje de error si todo sale bien
        } catch (error) {
            console.error("Imposible crear", error);
        }
    }

    // Método para obtener las imagenes
    const fetchImages = async () => {
        const result = await getImages();
        if (result.error) {
          setErrorMessage(result.error)
        } else {
          console.log(result)
          setImages(result.images);
          
        }
      };
      

    return (
        <main className="relative min-h-screen ">
            <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={100} priority={true}/>
            
            <div className="fixed bg-blue-400  justify-between w-full p-4" >
                <Navigate />
            </div>                  
            
            <h1  className="relative top-40 left-60 mb-5 text-3xl" >Talleres</h1>
           
            <div className="top-60 border p-1 absolute left-40 h-90 max-h-90" style={{background: "#D9D9D9"}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-4">
                    {cursos.map((curso, key) => (
                        <div key={curso.id} className="border p-4 mx-2 relative w-47 h-47 justify-center items-center" >
                            <div className="relative w-30 h-20">
                             {<Image 
                                    src={images[0]} 
                                    alt="Background Image" 
                                    objectFit="cover"  
                                    className="w-full h-full"
                                    layout="fill"
                                />}	

                                <button 
                                    onClick={() => handleEliminarCurso(curso.id)} 
                                    className="absolute top-0 right-0 text-red-600 font-bold">
                                    <Image src={DeleteIcon} alt="Eliminar" width={27} height={27}/>
                                </button>
                                <button 
                                    onClick={() => setSelectedCursoId(/*curso.id*/ -1)} 
                                    className="absolute top-0 right-8 text-red-600 font-bold">
                                    <Image src={EditIcon} alt="Editar" width={27} height={27}/>
                                </button>   
                            </div>
                            <h3 className="flex  bottom-0 text-black z-1">{curso.nombre}</h3>                                                           
                        </div>
                    ))}
                </div>
                <button onClick={handleCreateCurso} className="mt-6 mx-4">
                    <Image src={ButtonAdd} className="mx-3" alt="Image Alt Text" width={70} height={70}/>
                </button>
            </div>

            <div className="fixed bottom-0 mt-20 bg-white w-full" style={{opacity: 0.66}}>
                <But_aside />
            </div>


            {selectedCursoId !== null && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                      <h2 className="text-2xl font-bold mb-4">
                          {selectedCursoId === -1 ? "Crear Talleres" : "Editar Talleres"}
                      </h2>
                      {errorMessage && (
                          <div className="mb-4 text-red-600">
                              {errorMessage} {/* Muestra el mensaje de error */}
                          </div>
                      )}
                      <div className="mb-4">
                          <label htmlFor="nombre" className="block">Nombre:</label>
                          <input
                              type="text"
                              id="nombre"
                              name="nombre"
                              value={cursoDetails.nombre}
                              onChange={handleChange}
                              className="p-2 w-full border rounded"
                          />
                      </div>
                      <div className="mb-4">
                          <label htmlFor="year" className="block">Año:</label>
                          <input
                              type="number"
                              id="year"
                              name="year"
                              value={cursoDetails.year}
                              onChange={handleChange}
                              className="p-2 w-full border rounded"
                          />
                      </div>
                      <div className="mb-4">
                          <label htmlFor="descripcion" className="block">Descripción:</label>
                          <input
                              type="text"
                              id="descripcion"
                              name="descripcion"
                              value={cursoDetails.descripcion}
                              onChange={handleChange}
                              className="p-2 w-full border rounded"
                          />
                      </div>
                      <div className="flex justify-end space-x-4">
                          <button 
                              onClick={selectedCursoId === -1 ? handleCreateCurso : handleSaveChanges} 
                              className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                          >
                              Guardar
                          </button>
                          <button 
                              onClick={() => setSelectedCursoId(null)} 
                              className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                          >
                              Cancelar
                          </button>
                      </div>
                  </div>
              </div>
          )}
        </main>
    );
}

export default Cursos;