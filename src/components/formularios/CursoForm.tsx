"use client";

import React, { useEffect, useState } from "react";
import { updateCurso, createCurso } from "../../services/cursos";
import { handleUploadCursoImage } from "@/helpers/repoImages";
import { Calendar, FileText, ImageIcon, Loader } from "lucide-react";
import { validateCursoDetails, validateFechaInicioModificacion, validateFechaInicio } from "@/helpers/validaciones";
import Loadere from "@/components/Loaders/loadingTalleres/page";
import { FileInput } from '../ui/fileInput';

interface CursoFormProps {
  selectedCursoId: number | null;
  cursos: any[];
  setCursos: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedCursoId: React.Dispatch<React.SetStateAction<number | null>>;
  fetchCursos: () => Promise<void>;
  setImagesLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const CursoForm: React.FC<CursoFormProps> = ({
  selectedCursoId,
  cursos,
  setCursos,
  setSelectedCursoId,
  fetchCursos,
  setImagesLoaded
}) => {
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

  // Estado para almacenar errores específicos por campo
  const [errors, setErrors] = useState<{
    nombre?: string;
    descripcion?: string;
    edadMinima?: string;
    edadMaxima?: string;
    fechaInicio?: string;
    fechaFin?: string;
    imagen?: string;
    general?: string;
  }>({});
  
  // Para subir una imagen y asignarla al curso
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Estado para controlar el guardado
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Fecha de inicio anterior (para validaciones)
  const [fechaInicioAnterior, setFechaInicioAnterior] = useState<Date | null>(null);

  // Efecto para actualizar los detalles del curso seleccionado cuando cambia el curso o el ID del curso
  useEffect(() => {
    if (selectedCursoId !== null && selectedCursoId !== -1) {
      const selectedCurso = cursos.find(
        (curso) => curso.id === selectedCursoId
      );
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
        });
        setFechaInicioAnterior(new Date(selectedCurso.fechaInicio));
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
      setFechaInicioAnterior(null);
    }
    // Limpiar errores al cambiar de curso
    setErrors({});
  }, [selectedCursoId, cursos]);



  // Función para manejar los cambios en los campos del formulario
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCursoDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name.includes("fecha") ? new Date(value) : value,
    }));
    
    // Limpiar el error específico del campo cuando el usuario comienza a editarlo
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }

  // Para manejar el cambio en el input de imagen
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    
    // Agrego el nombre de la imagen a cursoDetails
    if (file) {
      const fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf(".");
      const fileExtension =
        lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1) : "";
      const fileNameWithExtension = `${cursoDetails.nombre}.${fileExtension}`;
      setCursoDetails({ ...cursoDetails, imagen: fileNameWithExtension });
      
      // Limpiar error de imagen si existe
      if (errors.imagen) {
        setErrors(prev => ({
          ...prev,
          imagen: undefined
        }));
      }
    }
  };

  // Para ver las imagenes agregadas sin refresh de pagina
  const handleUploadAndFetchImages = async (selectedFile: File | null) => {
    const result = await handleUploadCursoImage(
      selectedFile,
      cursoDetails.imagen || ""
    );
    if (result.error) {
      setUploadError(result.error);
      setErrors(prev => ({
        ...prev,
        imagen: result.error
      }));
    } else {
      setImagesLoaded(false); // Establecer en falso para que se vuelvan a cargar las imágenes
    }
  };

  // Validar todos los campos y devolver un objeto con los errores
  const validateFields = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validar los detalles del curso
    const cursoErrors = validateCursoDetails(cursoDetails);
    if (cursoErrors) {
      Object.assign(newErrors, cursoErrors);
    }
    return newErrors;
  };

  // Función para manejar el guardado de cambios en el curso
  async function handleSaveChanges() {
    setIsSaving(true);
    
    // Elimina los espacios en blanco antes de guardar los detalles
    const trimmedCursoDetails = {
      ...cursoDetails,
      nombre: cursoDetails.nombre.trim(),
      descripcion: cursoDetails.descripcion.trim(),
    };

    // Validar todos los campos
    const fieldErrors = validateFields();
    
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
 
      return;
    }
   
    if (selectedCursoId !== null) {
      try {
        // Llama a la API para actualizar el curso con los detalles recortados
        const response = await updateCurso(selectedCursoId, trimmedCursoDetails);
        if (typeof response === "string") {
          setErrors({ general: response });
          setIsSaving(false);
          return;
        }

        // Si se sube una imagen, se maneja la subida de la imagen
        if (selectedFile && trimmedCursoDetails.imagen) {
          await handleUploadAndFetchImages(selectedFile);
          
        }
        const validationErrorFechaInicio = fechaInicioAnterior
          ? validateFechaInicioModificacion(trimmedCursoDetails.fechaInicio, fechaInicioAnterior, trimmedCursoDetails.fechaFin)
          : null;

        if (validationErrorFechaInicio) {
          setErrors({ fechaInicio: validationErrorFechaInicio.fechaInicio });
          setIsSaving(false);
          return;
        }
        // Actualizar la lista de cursos después de actualizar uno
        await fetchCursos();
        

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
        setSelectedFile(null);
        setImagesLoaded(false);
        setErrors({});
        //cerrar el modal
        setSelectedCursoId(null);
        setErrors({});
        setIsSaving(false);
        //window.location.href = "/cursos";
        // no me redirige a la pagina de cursos pero cuando cancelo si
        

      } catch (error) {
        console.error("No se pudo actualizar el curso, intente de nuevo", error);
        setErrors({ general: "Error al actualizar el curso. Inténtelo de nuevo." });
        setIsSaving(false);
      }

    }
  }

  // Función para crear un nuevo curso
  async function handleCreateCurso() {
    setIsSaving(true);
    
    // Elimina los espacios en blanco antes de guardar los detalles
    const trimmedCursoDetails = {
      ...cursoDetails,
      nombre: cursoDetails.nombre.trim(),
      descripcion: cursoDetails.descripcion.trim(),
    };

    // Validar todos los campos
    const fieldErrors = validateFields();
    
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setIsSaving(false);
      return;
    }
    // Validar la fecha de inicio
    const validationErrorFechaInicio = validateFechaInicio(trimmedCursoDetails.fechaInicio);
    if (validationErrorFechaInicio) {
      setErrors({ fechaInicio: validationErrorFechaInicio.fechaInicio });
      setIsSaving(false);
      return;
    }
    try {
      // Llama a la API para crear el curso con los detalles recortados
      const response = await createCurso(trimmedCursoDetails);
      if (typeof response === "string") {
        setErrors({ general: response });
        setIsSaving(false);
        return;
      }

      // Si se sube una imagen, se maneja la subida de la imagen
      if (selectedFile && trimmedCursoDetails.imagen) {
        await handleUploadAndFetchImages(selectedFile);
      }

      // Actualizar la lista de cursos después de crear uno nuevo
       fetchCursos();
    
      setSelectedCursoId(null);

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
      setSelectedFile(null);
      setImagesLoaded(false);
      setErrors({});
      

    } catch (error) {
      console.error("Imposible crear el curso", error);
      setErrors({ general: "Error al crear el curso. Inténtelo de nuevo." });
      setIsSaving(false);
    }
    
    
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative max-h-full overflow-y-auto">
        <div className="bg-blue-700 p-4 rounded-t-lg mb-3">
          <h2 className="text-xl font-semibold mb-3 text-white">
            {selectedCursoId === -1 ? "Crear Taller" : "Editar Taller"}
          </h2>
        </div>
        <div className="p-4">
          {errors.general && (
            <div className="mb-4 text-red-600 text-sm p-2 bg-red-50 rounded border border-red-200">
              {errors.general}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium mb-2">
              <FileText className="w-4 h-4 inline-block mr-2" />Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre del taller"
              maxLength={50}
              value={cursoDetails.nombre}
              onChange={handleChange}
              className={`p-2 w-full border rounded text-sm ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Descripción
              </span>
            </label>
            <textarea
              rows={5}
              placeholder="Descripción del taller"
              value={cursoDetails.descripcion}
              onChange={(e) => {
                setCursoDetails({ ...cursoDetails, descripcion: e.target.value });
                if (errors.descripcion) {
                  setErrors(prev => ({ ...prev, descripcion: undefined }));
                }
              }}
              className={`p-2 w-full border rounded text-sm ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
          </div>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label htmlFor="edadMinima" className="block text-sm font-medium mb-2">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Edad mínima:
                </span>
              </label>
              <input
                type="text"
                id="edadMinima"
                name="edadMinima"
                pattern="[0-9]+"
                placeholder="Ingrese la edad mínima"
                maxLength={2}
                value={cursoDetails.edadMinima}
                onChange={(e) => {
                  const regex = /^[0-9]*$/;
                  if (regex.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                className={`p-2 w-full border rounded text-sm ${errors.edadMinima ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.edadMinima && (
                <p className="mt-1 text-sm text-red-600">{errors.edadMinima}</p>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="edadMaxima" className="block text-sm font-medium mb-2">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Edad máxima:
                </span>
              </label>
              <input
                type="text"
                id="edadMaxima"
                name="edadMaxima"
                placeholder="Ingrese la edad máxima"
                maxLength={2}
                value={cursoDetails.edadMaxima}
                onChange={(e) => {
                  const regex = /^[0-9]*$/;
                  if (regex.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                className={`p-2 w-full border rounded text-sm ${errors.edadMaxima ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.edadMaxima && (
                <p className="mt-1 text-sm text-red-600">{errors.edadMaxima}</p>
              )}
            </div>
          </div>

          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label htmlFor="fechaInicio" className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline-block mr-2" />
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
                min={
                  selectedCursoId !== -1 && fechaInicioAnterior
                    ? new Date(fechaInicioAnterior).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0]
                }
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                  .toISOString()
                  .split('T')[0]}
                onChange={handleChange}
                className={`p-2 w-full border rounded text-sm ${errors.fechaInicio ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fechaInicio && (
                <p className="mt-1 text-sm text-red-600">{errors.fechaInicio}</p>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="fechaFin" className="block text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Fecha de fin del taller:
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={
                  cursoDetails.fechaFin && 
                  cursoDetails.fechaFin instanceof Date && 
                  !isNaN(cursoDetails.fechaFin.getTime())
                    ? cursoDetails.fechaFin.toISOString().split('T')[0]
                    : ""
                }
                min={new Date(new Date().setFullYear(new Date().getMonth() + 1))
                  .toISOString()
                  .split('T')[0]}
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                  .toISOString()
                  .split('T')[0]}
                onChange={handleChange}
                className={`p-2 w-full border rounded text-sm ${errors.fechaFin ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fechaFin && (
                <p className="mt-1 text-sm text-red-600">{errors.fechaFin}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <span className="flex items-center text-sm font-medium mb-2">
              <ImageIcon className="w-4 h-4 mr-2" />
              Imagen
            </span>
            <div
              className={`mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                errors.imagen || uploadError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <div className="space-y-1 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex flex-col sm:flex-row items-center text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Subir archivo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".png, .jpg, .jpeg, .avif"
                      onChange={onFileChange}
                    />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG, AVIF hasta 10MB</p>
                {selectedFile && (
                  <p className="text-xs text-green-600 mt-2">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
            {(errors.imagen || uploadError) && (
              <p className="mt-1 text-sm text-red-600">{errors.imagen || uploadError}</p>
            )}

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
              <button
                onClick={() => {
                  setSelectedCursoId(null);
                  setErrors({});
                }}
                disabled={isSaving}
                className="bg-gray-600 py-2 px-4 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50"
              >
                Cancelar
              </button>
                <button
                onClick={selectedCursoId === -1 ? handleCreateCurso : handleSaveChanges }
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 "
                disabled={isSaving}
                >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                  <Loader className="w-4 h-4" />
                  <span className="ml-2">Guardando...</span>
                  </div>
                ) : (
                  "Guardar"
                )}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursoForm;