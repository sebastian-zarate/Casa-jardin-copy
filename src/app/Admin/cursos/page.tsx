"use client";

import React, { useEffect, useState } from "react";
import Navigate from "../../../components/Admin/navigate/page";


import { updateCurso, getCursosCout, deleteCurso, createCurso, } from "../../../services/cursos";

import Background from "../../../../public/Images/Background.jpeg";

//imagen default si el curso no tiene imagen
import NoImage from "../../../../public/Images/default-no-image.png";
import { getImages_talleresAdmin } from "@/services/repoImage";
import withAuth from "../../../components/Admin/adminAuth";
import { autorizarAdmin } from "@/helpers/cookies";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loaders/loadingSave/page";
//para subir imagenes:
import { handleUploadCursoImage, handleDeleteCursoImage, mapearImagenes } from "@/helpers/repoImages";
import { Calendar, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { validateCursoDetails, validateFechaInicioModificacion, validateFechaInicio } from "@/helpers/validaciones";
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
      cantidadParticipantes: number;
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
    cantidadParticipantes: number;

  }>({
    nombre: "",
    descripcion: "",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    edadMinima: 0,
    edadMaxima: 0,
    imagen: null,
    cantidadParticipantes: 0,

  });
  // Estado para almacenar mensajes de error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  //Estado para almacenar las imagenes
  const [images, setImages] = useState<any[]>([]);
  const [downloadurls, setDownloadurls] = useState<any[]>([]);
  // Estado para almacenar si todos los cursos están seleccionados
  const [allCursosChecked, setAllCursosChecked] = useState<boolean>(false);

  // Estado para almacenar el término de búsqueda
  const [searchTerm, setSearchTerm] = useState<string>("");

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
  const [fechaInicioAnterior, setFechaInicioAnterior] = useState<Date | null>(null);

  //boolean para saber si estan cargando los cursos
  const [loading, setLoading] = useState<boolean>(true);
  // Estado para almacenar los detalles del curso seleccionado
  const [cursoDetails2, setCursoDetails2] = useState({
    nombre: "",
    descripcion: "",
    edadMinima: "",
    edadMaxima: "",
    fechaInicio: null,
    fechaInicioAnterior: null, // Fecha inicial previamente guardada
    fechaFin: null,
  });


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
          cantidadParticipantes: selectedCurso.cantidadParticipantes,
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
        cantidadParticipantes: 0,
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
      let curs = await getCursosCout(); // Obtén la lista de cursos
      curs.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordena los cursos por nombre
      setCursos(curs.map(curso => ({ ...curso, visible: true, selected: false, cantidadParticipantes: curso.cantidadAlumnos }))); // Actualiza el estado con la lista de cursos
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
  // Función para obtener los detalles del curso seleccionado
  // Función para obtener los detalles del curso seleccionado
  useEffect(() => {
    if (selectedCursoId !== -1) {
      setCursoDetails((prev) => ({
        ...prev,
        fechaInicioAnterior: new Date(prev.fechaInicio),
      }));
    }
  }, [selectedCursoId]);


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
    // Validar que la fecha de inicio no sea anterior a la fecha actual
    const validationErrorFechaInicio = fechaInicioAnterior 
      ? validateFechaInicioModificacion(trimmedCursoDetails.fechaInicio, fechaInicioAnterior, trimmedCursoDetails.fechaFin)
      : null;

    if (validationErrorFechaInicio) {
      setErrorMessage(validationErrorFechaInicio);
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
          cantidadParticipantes: 0,
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
    const validationErrorFechaInicio = validateFechaInicio(trimmedCursoDetails.fechaInicio);
    if (validationError || validationErrorFechaInicio) {
      setErrorMessage(validationError || validationErrorFechaInicio); // Muestra el mensaje de error si hay un error
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
        cantidadParticipantes: 0,
      });
      setSelectedFile(null); // Limpiar archivo seleccionado
      setImagesLoaded(false); // Recargar las imágenes
      setErrorMessage(""); // Limpiar mensaje de error si todo fue bien

    } catch (error) {
      console.error("Imposible crear el curso", error); // Manejo de errores
    }
  }

  const [filteredCursos, setFilteredCursos] = useState(cursos);

  useEffect(() => {
    setFilteredCursos(
      cursos.filter(curso =>
        curso.nombre.toLowerCase().includes(searchTerm) ||
        curso.descripcion.toLowerCase().includes(searchTerm)
      )
    );
  }, [searchTerm, cursos]);



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

      {cursoAEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <h2 className="text-lg mb-4">Confirmar Eliminación</h2>
            <p>
              ¿Estás seguro de que deseas eliminar el taller:{" "}
              <strong>{cursoAEliminar.nombre}</strong>?
            </p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => {
                  handleEliminarCurso(cursoAEliminar.id);
                }}
                disabled={isDeleting}
                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
              >
                {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
              </button>
              <button
                onClick={() => {
                  setCursoAEliminar(null);
                  setErrorMessage(null);
                }}
                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor Principal */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Talleres</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona los talleres del sistema
              </p>
            </div>
            <button
              onClick={() => setSelectedCursoId(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Nuevo Taller</span>
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, descripción..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          {/* Contenedor de talleres */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Encabezado de tabla */}
            <div className="hidden sm:grid grid-cols-12 bg-gray-50 py-4 px-6 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">Taller</div>
              <div className="col-span-4">Descripción</div>
              <div className="col-span-2 text-center">Participantes</div>
              <div className="col-span-1 text-center">Acciones</div>
            </div>

            {filteredCursos.length === 0 ? (
              // Mensaje de lista vacía
              <div className="py-12 px-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No hay talleres</h3>
                <p className="text-sm text-gray-500">
                  Comienza creando un taller
                </p>
              </div>
            ) : (
              filteredCursos.map((talleres: any) => (
                // Tarjetas responsivas
                <div
                  key={talleres.id}
                  className="flex flex-col sm:grid sm:grid-cols-12 items-center sm:items-start py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Imagen y Nombre */}
                  <div className="flex items-center gap-4 sm:col-span-5 mb-4 sm:mb-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={talleres.imageUrl || NoImage.src}
                        alt={talleres.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{talleres.nombre}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {talleres.fechaInicio &&
                          new Date(new Date(talleres.fechaInicio).setDate(new Date(talleres.fechaInicio).getDate() +1)).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="sm:col-span-4 text-sm text-gray-600 line-clamp-2 mb-4 sm:mb-0">
                    {talleres.descripcion}
                  </div>

                  {/* Participantes */}
                  <div className="sm:col-span-2 flex items-center justify-center gap-1.5 mb-4 sm:mb-0">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{talleres.cantidadParticipantes || 0}</span>
                  </div>

                  {/* Acciones */}
                  <div className="sm:col-span-1 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCursoId(talleres.id);
                        setFechaInicioAnterior(talleres.fechaInicio);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                      title="Editar taller"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCursoAEliminar(talleres)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      title="Eliminar taller"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
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
                cursoDetails.fechaInicio &&
                cursoDetails.fechaInicio instanceof Date &&
                !isNaN(cursoDetails.fechaInicio.getTime())
                ? cursoDetails.fechaInicio.toISOString().split('T')[0]
                : ""
              }
              // Ajusta el valor mínimo basado en si es edición o creación
              min={
                selectedCursoId !== -1 && fechaInicioAnterior
                ? new Date(fechaInicioAnterior).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
              }
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
                onClick={() => {
                  setSelectedCursoId(null);
                  setErrorMessage(null);
                }}
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
