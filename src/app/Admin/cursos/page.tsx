"use client";

import React, { useEffect, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";
import Loader from "@/components/Loaders/loader/loader";

import { updateCurso, getCursos, deleteCurso, createCurso, } from "../../../services/cursos";
import Image from "next/image";
import DeleteIcon from "../../../../public/Images/DeleteIcon.png";
import EditIcon from "../../../../public/Images/EditIcon.png";
import Background from "../../../../public/Images/Background.jpeg";
import ButtonAdd from "../../../../public/Images/Button.png";
//imagen default si el curso no tiene imagen
import NoImage from "../../../../public/Images/default-no-image.png";
import { getImages_talleresAdmin } from "@/services/repoImage";
import withAuth from "../../../components/Admin/adminAuth";
import { autorizarAdmin } from "@/helpers/cookies";
import { useRouter } from "next/navigation";
//para subir imagenes:
import { handleUploadCursoImage, handleDeleteCursoImage, mapearImagenes } from "@/helpers/repoImages";
import { Trash2 } from "lucide-react";
const Cursos: React.FC = () => {
  // Estado para almacenar la lista de cursos
  const [cursos, setCursos] = useState<
    {
      visible: boolean;
      selected: boolean;
      id: number;
      nombre: string;
      descripcion: string;
      fechaInicio: Date;
      fechaFin: Date;
      edadMinima: number;
      edadMaxima: number;
      imagen: string | null;
      imageUrl?: string;
    }[]
  >([]);
  // Estado para almacenar el ID del curso seleccionado
  const [selectedCursoId, setSelectedCursoId] = useState<number | null>(null);
  // Estado para almacenar los detalles del curso seleccionado
  const [cursoDetails, setCursoDetails] = useState<{
    nombre: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    edadMinima: number;
    edadMaxima: number;
    imagen: string | null;
  }>({
    nombre: "",
    descripcion: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    edadMinima: 0,
    edadMaxima: 0,
    imagen: null,
  });
  // Estado para almacenar mensajes de error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //Estado para almacenar las imagenes
  const [images, setImages] = useState<any[]>([]);
  const [downloadurls, setDownloadurls] = useState<any[]>([]);
  // Estado para almacenar si todos los cursos están seleccionados
  const [allCursosChecked, setAllCursosChecked] = useState<boolean>(false);

  // Efecto para obtener la lista de cursos al montar el componente
  const [cursoAEliminar, setCursoAEliminar] = useState<{
    id: number;
    nombre: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  //para subir una imagen y asignarla al curso
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  //booleano para saber si las imagenes ya se cargaron
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  //boolean para saber si estan cargando los cursos
  const [loading, setLoading] = useState<boolean>(true);

  //region useEffect
  const router = useRouter();
  useEffect(() => {
    const authorize = async () => {
      await autorizarAdmin(router);
    };
    authorize();
  }, [router]);

  useEffect(() => {
    fetchCursos();
  }, []);

  useEffect(() => {
    // Llamar a fetchImages después de que los cursos se hayan cargado
    if (cursos.length > 0 && !imagesLoaded) {
      fetchImages();
    }
  }, [cursos]);

  // Efecto para actualizar los detalles del curso seleccionado cuando cambia el curso o el ID del curso
  useEffect(() => {
    if (selectedCursoId !== null && selectedCursoId !== -1) {
      const selectedCurso = cursos.find(
        (curso) => curso.id === selectedCursoId
      ); // Busca el curso seleccionado
      if (selectedCurso) {
        setCursoDetails({
          nombre: selectedCurso.nombre,
          descripcion: selectedCurso.descripcion,
          fechaInicio: selectedCurso.fechaInicio,
          fechaFin: selectedCurso.fechaFin,
          edadMinima: selectedCurso.edadMinima,
          edadMaxima: selectedCurso.edadMaxima,
          imagen: selectedCurso.imagen,
        }); // Actualiza los detalles del curso
      }
    } else if (selectedCursoId === -1) {
      // Reinicia los detalles del curso al crear un nuevo curso
      setCursoDetails({
        nombre: "",
        descripcion: "",
        fechaInicio: new Date(),
        fechaFin: new Date(),
        edadMinima: 0,
        edadMaxima: 0,
        imagen: null,
      });
    }
  }, [selectedCursoId, cursos]); // Efecto para actualizar los detalles del curso seleccionado cuando cambia el curso o el ID del curso
  useEffect(() => {
    if (errorMessage != null) {
      setInterval(() => {
        setErrorMessage("");
      }, 50000);
    }
  }, [errorMessage]);
  //endregion useEffect

  // region funciones
  // Función para obtener la lista de cursos
  async function fetchCursos() {
    try {
      let curs = await getCursos(); // Obtén la lista de cursos
      curs.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordena los cursos por nombre
      setCursos(curs.map(curso => ({ ...curso, visible: true, selected: false }))); // Actualiza el estado con la lista de cursos
    } catch (error) {

    } finally {
      setLoading(false); // Establece el estado de carga en falso
    }
  }

  // Función para manejar los cambios en los campos del formulario
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCursoDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name.includes("fecha") ? new Date(value) : value,
    }));
  }

  //Para manejar el cambio en el input de imagen
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    // Agrego el nombre de la imagen a cursoDetails
    if (file) {
      const fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf(".");
      const fileExtension =
        lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : ""; // Obtener la extensión del archivo
      const fileNameWithExtension = `${cursoDetails.nombre}.${fileExtension}`; // Concatenar nombre del curso con la extensión
      setCursoDetails({ ...cursoDetails, imagen: fileNameWithExtension });

    }
  };
  //para ver las imagenes agregadas sin refresh de pagina
  const handleUploadAndFetchImages = async (selectedFile: File | null) => {
    const result = await handleUploadCursoImage(
      selectedFile,
      cursoDetails.imagen || ""
    );
    if (result.error) {
      setUploadError(result.error);
    } else {

      setImagesLoaded(false); // Establecer en falso para que se vuelvan a cargar las imágenes
    }
  };

  // Método para obtener las imagenes
  const fetchImages = async () => {
    const result = await getImages_talleresAdmin();

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      console.log(result);
      setImages(result.images);
      setDownloadurls(result.downloadurls);

      // Mapear las imágenes con los cursos
      const updatedCursos = mapearImagenes(cursos, { images: result.images, downloadurls: result.downloadurls });

      // Ordenar los cursos alfabéticamente por nombre
      updatedCursos.sort((a, b) => a.nombre.localeCompare(b.nombre));

      // Actualiza el estado de los cursos
      setCursos(updatedCursos);

      // Marcar las imágenes como cargadas
      setImagesLoaded(true);

      // Hacer un console.log de las imageUrl después de actualizar el estado
      updatedCursos.forEach((curso) => {
        if (curso.imageUrl) {
          console.log(`Curso: ${curso.nombre}, Image URL: ${curso.imageUrl}`);
        }
      });
    }
  };

  // Función para validar los detalles del curso
  function validateCursoDetails(details: {
    nombre: string;
    descripcion: string;
    fechaInicio: Date;
    fechaFin: Date;
    edadMinima: number;
    edadMaxima: number;
  }) {
    const {
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      edadMinima,
      edadMaxima,
    } = details;

    // Validar que el nombre tenga entre 2 y 50 caracteres
    if (nombre.length < 2 || nombre.length > 50) {
      return "El nombre debe tener entre 2 y 50 caracteres.";
    }

    // Validar que la descripción tenga entre 5 y 300 palabras
    const descripcionWords = descripcion.trim().split(/\s+/).length;
    if (descripcionWords < 5) {
      return "La descripción debe tener al menos 5 palabras.";
    }
    if (descripcionWords > 300) {
      return "La descripción no puede exceder las 300 palabras.";
    }

    // Validar que el nombre y la descripción no contengan caracteres no permitidos
    const regex = /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\u00fc\u00dc\s.,:-]*$/;
    if (!regex.test(nombre)) {
      return "El nombre del curso solo puede contener letras, números, espacios, puntos, comas y guiones.";
    }
    if (!regex.test(descripcion)) {
      return "La descripción solo puede contener letras, números, espacios, puntos, comas y guiones.";
    }

    // Validar que la fecha de inicio sea anterior a la fecha de fin
    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      return "La fecha de inicio debe ser anterior a la fecha de fin.";
    }
    // el rango de fechas no puede ser menor a 7 días
    const diffTime = Math.abs(new Date(fechaFin).getTime() - new Date(fechaInicio).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return "El rango de fechas no puede ser menor a 7 días.";
    }

    // Validar rango de edades si ambos están definidos
    // Validar que la edad mínima sea un número entero positivo
    // Validar que la edad mínima sea un número entero positivo
    const minEdad = Number(edadMinima);
    const maxEdad = Number(edadMaxima);

    // Validar que los valores sean números válidos
    if (isNaN(minEdad) || isNaN(maxEdad)) {
      return "Las edades mínima y máxima deben ser números válidos.";
    }

    // Validar valores negativos
    if (minEdad < 0 || maxEdad < 0) {
      return "Las edades no pueden ser valores negativos.";
    }
    // edad minimia no puede puede menor a 2 años
    if (minEdad < 2) {
      return "La edad mínima no puede ser menor a 2 años.";
    }

    // Validar el rango de edades
    if (minEdad > maxEdad) {
      return "La edad mínima no puede ser mayor que la edad máxima.";
    }

    if (maxEdad > 100) {
      return "La edad máxima no puede ser mayor que 99 años.";
    }

    return null; // No hay errores
  }

  // Función para manejar el guardado de cambios en el curso
  async function handleSaveChanges() {
    // Elimina los espacios en blanco antes de guardar los detalles
    const trimmedCursoDetails = {
      ...cursoDetails,
      nombre: cursoDetails.nombre.trim(),
      descripcion: cursoDetails.descripcion.trim(),
    };

    const validationError = validateCursoDetails(trimmedCursoDetails);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }


    if (selectedCursoId !== null) {
      try {
        // Llama a la API para actualizar el curso con los detalles recortados
        const response = await updateCurso(selectedCursoId, trimmedCursoDetails);
        if (typeof response === "string") {
          setErrorMessage(response); // Muestra el mensaje de error si no se puede actualizar
          return;
        }

        // Si se sube una imagen, se maneja la subida de la imagen
        if (selectedFile && trimmedCursoDetails.imagen) {
          await handleUploadAndFetchImages(selectedFile);
        }

        // Actualizar la lista de cursos después de actualizar uno
        fetchCursos();
        setSelectedCursoId(null); // Cierra el formulario y resetea el curso seleccionado

        // Limpiar el formulario después de actualizar el curso
        setCursoDetails({
          nombre: "",
          descripcion: "",
          fechaInicio: new Date(),
          fechaFin: new Date(),
          edadMinima: 0,
          edadMaxima: 0,
          imagen: null,
        });
        setSelectedFile(null); // Limpiar archivo seleccionado
        setImagesLoaded(false); // Recargar las imágenes
        setErrorMessage(""); // Limpiar mensaje de error si todo fue bien

      } catch (error) {
        console.error("No se pudo actualizar el curso, intente de nuevo", error); // Manejo de errores
      }
    }
  }

  async function handleEliminarCurso(id: number) {
    try {
      //Ventana de confirmación para eliminar el curso

      const result = await deleteCurso(id); // Ahora devuelve un objeto con success y message
      //console.log("Curso eliminado con éxito:", id);
      //Actualizar la lista de cursos despues de eliminar alguno de ellos

      if (result.success === true) {
        console.log(result.message); // "Curso eliminado con éxito"
        setErrorMessage(null); // Limpiar mensaje de error en caso de éxito
        if (cursoDetails.imagen) {
          handleDeleteCursoImage(cursoDetails.imagen || ""); // Eliminar la imagen del repositorio
        }
        // Actualizar la lista de cursos, excluyendo el curso eliminado
        setCursos(cursos.filter((curso) => curso.id !== id));
        setCursoAEliminar(null); // Cerrar la ventana de confirmación
        setErrorMessage(""); // Limpiar mensaje de error si todo fue bien
      } else {
        // Si la eliminación falló, mostrar el mensaje de error devuelto
        setErrorMessage(result.message);

      }
    } catch (error) {
      setErrorMessage(
        "Hubo un error inesperado al intentar eliminar el curso."
      ); // Manejo de errores
    }
  }
  async function handleCreateCurso() {
    // Elimina los espacios en blanco antes de guardar los detalles
    const trimmedCursoDetails = {
      ...cursoDetails,
      nombre: cursoDetails.nombre.trim(),
      descripcion: cursoDetails.descripcion.trim(),
    };

    const validationError = validateCursoDetails(trimmedCursoDetails); // Llama a la función de validación con los detalles recortados
    if (validationError) {
      setErrorMessage(validationError); // Muestra el mensaje de error si hay un error
      return;
    }

    // Validar que el nombre del curso no esté duplicado
    try {
      // Llama a la API para crear el curso con los detalles recortados
      const response = await createCurso(trimmedCursoDetails); // Asegúrate de tener esta función para crear un curso
      if (typeof response === "string") {
        setErrorMessage(response); // Muestra el mensaje de error si no se puede crear
        return;
      }

      // Si se sube una imagen, se maneja la subida de la imagen
      if (selectedFile && trimmedCursoDetails.imagen) {
        await handleUploadAndFetchImages(selectedFile);
      }

      // Actualizar la lista de cursos después de crear uno nuevo
      fetchCursos();
      setSelectedCursoId(null); // Cierra el formulario y resetea el curso seleccionado

      // Limpiar el formulario después de crear el curso
      setCursoDetails({
        nombre: "",
        descripcion: "",
        fechaInicio: new Date(),
        fechaFin: new Date(),
        edadMinima: 0,
        edadMaxima: 0,
        imagen: null,
      });
      setSelectedFile(null); // Limpiar archivo seleccionado
      setImagesLoaded(false); // Recargar las imágenes
      setErrorMessage(""); // Limpiar mensaje de error si todo fue bien

    } catch (error) {
      console.error("Imposible crear el curso", error); // Manejo de errores
    }
  }



  function setAllCrusosSelected(cursos: { id: number; nombre: string; descripcion: string; fechaInicio: Date; fechaFin: Date; edadMinima: number; edadMaxima: number; imagen: string | null; imageUrl?: string; }[]) {
    throw new Error("Function not implemented.");
  }

  //region return
  return (
    <main
      className="relative bg-cover bg-center"
      style={{
      backgroundImage: `url(${Background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      }}
    >
      <Navigate />
      <div className="relative w-full">
      {/* Fondo Fijo */}
      <div className="fixed inset-0 z-[-1]">
      <Image
      src={Background}
      alt="Background"
      layout="fill"
      objectFit="cover"
      quality={80}
      priority={true}
      />
      </div>
      {cursoAEliminar && (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <h2 className="text-lg mb-4">Confirmar Eliminación</h2>
        {errorMessage && (
          <div className="mb-3 text-red-600 text-sm">{errorMessage}</div>
        )}
        <p>
        ¿Estás seguro de que deseas eliminar el curso{" "}
    
        </p>
        <p>
          ¿Estás seguro de que deseas eliminar los siguientes cursos:{" "}
          {cursos.filter(curso => curso.selected).map((curso, index) => (
            <span key={curso.id}>
              <strong>{curso.nombre}</strong>{index < cursos.filter(curso => curso.selected).length - 1 ? ', ' : ''}
            </span>
          ))}?
        </p>
        <div className="flex justify-end space-x-4 mt-4">
        <button
        onClick={() => handleEliminarCurso(cursoAEliminar.id)} // Se pasa el id del curso
        className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
        >
        Confirmar
        </button>
        <button
        onClick={() => {
          setCursoAEliminar(null);
          setErrorMessage(null);
        }} // Cierra el modal
        className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
        >
        Cancelar
        </button>
        </div>
      </div>
      </div>
      )}

      {/* Contenedor Principal */}
      <div className="relative mt-8 flex justify-center z-10">
      <div className="border p-4 max-w-[96vh] w-11/12 sm:w-2/3 md:w-4/5 lg:w-2/3 h-[62vh] bg-slate-50 overflow-y-auto rounded-lg">
      {/* Encabezado */}
      <div className="flex flex-col items-center z-10 p-2">
        <h1 className="text-2xl sm:text-2xl bg-slate-50 uppercase">Cursos</h1>
      </div>

      {/* Contenido */}
      <div className="flex flex-col space-y-4 bg-white"></div>
        {/* Contenido */}
        <div className="flex flex-col space-y-4 bg-white">
          <div className="relative overflow-x-auto shadow-lg sm:rounded-lg">
          <div className="flex justify-around px-auto bg-white p-2">
            {/* Acciones y Búsqueda */}
            <div className="flex justify-around">
            <button onClick={() => setSelectedCursoId(-1)} className="px-2 w-10 h-10">
              <Image src={ButtonAdd} alt="Agregar Taller" />
            </button>
            <button onClick={() => {
              const selectedCurso = cursos.find(curso => curso.selected);
              if (selectedCurso) {
                setCursoAEliminar({ id: selectedCurso.id, nombre: selectedCurso.nombre });
              }
            }} className="w-10 px-2 h-10">
              <Trash2 />
            </button>
            </div>
            <div className="relative">
            <div className="absolute inset-y-0 right-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"><svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"></path></svg></div>
            <input
              type="text"
              placeholder="Buscar..."
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-100 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              setCursos(cursos.map(curso => ({
                ...curso,
                visible: curso.nombre.toLowerCase().includes(searchTerm) || curso.descripcion.toLowerCase().includes(searchTerm)
              })));
              }}
            />
            </div>
          </div>

          {/* Tabla */}
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="p-4">
              <input
                type="checkbox"
                onChange={(e) => {
                const checked = e.target.checked;
                setCursos(cursos.map(curso => ({
                  ...curso,
                  selected: checked
                })));
                }}
              />
              </th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Descripción</th>
              <th scope="col" className="px-6 py-3">Acción</th>
            </tr>
            </thead>
            <tbody>
            {cursos.filter(curso => curso.visible !== false).map((curso) => (
              <tr className="bg-white border-b hover:bg-gray-50" key={curso.id}>
              <td className="w-4 p-4">
                <div className="flex items-center">
                <input
                  id={`checkbox-table-search-${curso.id}`}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={curso.selected || false}
                  onChange={(e) => {
                  const checked = e.target.checked;
                  setCursos(cursos.map(c => c.id === curso.id ? { ...c, selected: checked } : c));
                  }}
                />
                </div>
              </td>
              <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                <Image
                src={curso.imageUrl || NoImage}
                alt={`${curso.nombre} `}
                width={70}
                height={100}
                objectFit="cover"
                className="w-20 h-25 rounded-full pointer-events-none"
                />
                <div className="ps-3 min-w-64 max-w-96">
                <div className="text-base font-semibold">{curso.nombre}</div>
                </div>
              </th>
              <td className="px-6 py-4">{curso.descripcion}</td>
              <td className="px-6 py-4">
                <button
                onClick={() => setSelectedCursoId(curso.id)}
                className="font-medium text-blue-600 hover:underline w-full text-left"
                >
                Editar taller
                </button>
              </td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </div>
        </div>
      </div>
      </div>

      {selectedCursoId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative max-h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-3">
              {selectedCursoId === -1 ? "Crear Taller" : "Editar Taller"}
            </h2>
            {errorMessage && (
              <div className="mb-3 text-red-600 text-sm">{errorMessage}</div>
            )}
            <div className="mb-3">
              <label htmlFor="nombre" className="block text-sm font-medium">
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre del taller"
                maxLength={50}
                value={cursoDetails.nombre}
                onChange={handleChange}
                className="p-1 w-full border rounded text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcion" className="block text-sm font-medium">
                Descripción:
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                placeholder="Descripción del taller"
                value={cursoDetails.descripcion}
                onChange={handleChange}
                className="p-1 w-full border rounded text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="edadMinima" className="block text-sm font-medium">
                Edad mínima:
              </label>
              <input
                type="text"
                id="edadMinima"
                name="edadMinima"
                pattern="[0-9]+"
                placeholder="Ingrese la edad mínima"
                maxLength={2} // Limita a dos dígitos (si es necesario)
                value={cursoDetails.edadMinima}
                onChange={(e) => {
                  const regex = /^[0-9]*$/; // Permite solo números
                  if (regex.test(e.target.value)) {
                    handleChange(e); // Actualiza solo si es un número válido
                  }
                }}
                className="p-2 w-full border rounded text-sm"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="edadMaxima" className="block text-sm font-medium">
                Edad máxima:
              </label>
              <input
                type="text"
                id="edadMaxima"
                name="edadMaxima"
                placeholder="Ingrese la edad máxima"
                maxLength={2} // Limita la entrada a dos dígitos
                value={cursoDetails.edadMaxima}
                onChange={(e) => {
                  const regex = /^[0-9]*$/; // Solo permite números
                  if (regex.test(e.target.value)) {
                    handleChange(e); // Actualiza solo si el valor es válido
                  }
                }}
                className="p-1 w-full border rounded text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fechaInicio" className="block">
                Fecha de inicio del taller:
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={
                  cursoDetails.fechaInicio && cursoDetails.fechaInicio instanceof Date && !isNaN(cursoDetails.fechaInicio.getTime())
                    ? cursoDetails.fechaInicio.toISOString().split('T')[0]
                    : ""
                }
                min={new Date()
                  .toISOString()
                  .split('T')[0]} // El mínimo es hoy
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                  .toISOString()
                  .split('T')[0]} // Hasta un año desde hoy
                onChange={handleChange}
                className="p-2 w-full border rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fechaFin" className="block">
                Fecha de fin del taller:
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={
                  cursoDetails.fechaFin && cursoDetails.fechaFin instanceof Date && !isNaN(cursoDetails.fechaFin.getTime())
                    ? cursoDetails.fechaFin.toISOString().split('T')[0]
                    : ""
                }
                min={new Date(new Date().setFullYear(new Date().getMonth() + 1))
                  .toISOString()
                  .split('T')[0]} // Hasta un mes desde hoy
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                  .toISOString()
                  .split('T')[0]} // Hasta un año desde hoy
                onChange={handleChange}
                className="p-2 w-full border rounded"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="imagen" className="block text-sm font-medium">
                Imagen:
              </label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept=".png, .jpg, .jpeg, .avif"
                onChange={onFileChange}
                className="p-1 w-full border rounded text-sm"
              />
              {uploadError && (
                <div className="text-red-600 text-xs">{uploadError}</div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={
                  selectedCursoId === -1 ? handleCreateCurso : handleSaveChanges
                }
                className="bg-red-600 py-1 px-3 text-white rounded text-sm hover:bg-red-700"
                disabled={isSaving}
              >
                {isSaving ? <Loader /> : "Guardar"}
              </button>
              <button
                onClick={() => setSelectedCursoId(null)}
                disabled={isSaving}
                className="bg-gray-600 py-1 px-3 text-white rounded text-sm hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
     
    </main>
  );
};
export default withAuth(Cursos);
