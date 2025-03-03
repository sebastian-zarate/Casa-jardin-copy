"use client";

import { date, string, z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, ImageIcon, Loader } from "lucide-react";
import { updateCurso, createCurso } from "../../services/cursos";
import { handleUploadCursoImage } from "@/helpers/repoImages";
import { validateFechaInicioModificacion, validateFechaInicio, validateCursoDetails } from "@/helpers/validaciones";
import { FileInput } from '@/components/ui/fileInput';

// Schema de validación para cursos
const cursoSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().trim(),
  descripcion: z.string().trim(),
  fechaInicio: z.date(),
  fechaFin: z.date(),
  edadMinima: z.number().min(1),
  edadMaxima: z.number().min(1),
  imagen: z.any().nullable().optional(),
  cantidadParticipantes: z.number().optional(),
});

export type CursoSchema = z.infer<typeof cursoSchema>;

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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fechaInicioAnterior, setFechaInicioAnterior] = useState<Date | string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const selectedCurso = selectedCursoId !== null && selectedCursoId !== -1
    ? cursos.find(curso => curso.id === selectedCursoId)
    : null;
    //para manejar los errores
    // para luego hacer error.nombre y error.descripcion y asi sucesivamente
    // para que se muestre en pantalla el error
    // para que se muestre en pantalla el error
    // para que se muestre en pantalla el error
    // para que se muestre en pantalla el error
    
  const methods = useForm<CursoSchema>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      id: selectedCurso?.id,
      nombre: selectedCurso?.nombre || "",
      descripcion: selectedCurso?.descripcion || "",
      fechaInicio: selectedCurso?.fechaInicio ? new Date(selectedCurso.fechaInicio) : new Date(),
      edadMinima: selectedCurso?.edadMinima || 0,
      edadMaxima: selectedCurso?.edadMaxima || 0,
      imagen: selectedCurso?.imagen || null,
      cantidadParticipantes: selectedCurso?.cantidadParticipantes || 0,
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = methods;

  useEffect(() => {
    if (selectedCursoId !== null && selectedCursoId !== -1) {
      const curso = cursos.find(c => c.id === selectedCursoId);
      if (curso) {
        reset({
          id: curso.id,
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          fechaInicio: new Date(curso.fechaInicio),
          fechaFin: new Date(curso.fechaFin),
          edadMinima: curso.edadMinima,
          edadMaxima: curso.edadMaxima,
          imagen: curso.imagen,
          cantidadParticipantes: curso.cantidadParticipantes,
        });
        setFechaInicioAnterior(new Date(curso.fechaInicio));
        setImagePreview(curso.imageUrl || "");
      }
    } else if (selectedCursoId === -1) {
      reset({
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
      setImagePreview("");
    }
    setGeneralError(null);
    setUploadError(null);
  }, [selectedCursoId, cursos, reset]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedFile(file);
      const fileName = file.name.split('.').slice(0, -1).join('.') + '.' + file.name.split('.').pop();
      setValue('imagen', fileName);
      setUploadError(null);
    } else {
      setImagePreview(selectedCurso?.imageUrl || "");
      setSelectedFile(null);
    }
  };

  const handleUploadAndFetchImages = async (file: File | null, imageName: string) => {
    const result = await handleUploadCursoImage(file, imageName);
    if (result.error) {
      setUploadError(result.error);
      return false;
    }
    setImagesLoaded(false);
    return true;
  };

 

  const onSubmit = async (data: CursoSchema) => {
   
     
      // Validar los datos del curso
      const validationErrors: { [key: string]: string } = validateCursoDetails(data);
      if (Object.keys(validationErrors).length > 0) {
       
        setValidationErrors(validationErrors);
        return;
         
        
      }
      
      // Validar fecha de inicio
    if (selectedCursoId !== -1) {
      const fechaInicioErrors: { [key: string]: string } = validateFechaInicioModificacion(data.fechaInicio, fechaInicioAnterior as Date, data.fechaFin);
      if (Object.keys(fechaInicioErrors).length > 0) {
      setValidationErrors(fechaInicioErrors);
      return;
      }
    } else {
      const fechaInicioErrors: { [key: string]: string } = validateFechaInicio(data.fechaInicio);
      if (Object.keys(fechaInicioErrors).length > 0) {
      setValidationErrors(fechaInicioErrors);
      return;
      }
    }
      

      // Crear o actualizar curso
      const cursoPayload = { ...data, imagen: data.imagen || null };
      const response = selectedCursoId === -1 
        ? await createCurso(cursoPayload) 
        : selectedCursoId !== null 
          ? await updateCurso(selectedCursoId, cursoPayload)
          : null;

      if (typeof response === "string") {
        setGeneralError(response);
        return;
      }
      try{
      // Subir imagen si es necesario
      if (selectedFile && data.imagen) {
        const imageUploaded = await handleUploadAndFetchImages(selectedFile, data.imagen);
        if (!imageUploaded) return;
      }
  
      // Resetear estados y recargar cursos
      await fetchCursos();
      resetState();
  
    } catch (error) {
      console.error("Error al guardar el curso:", error);
      setGeneralError("Error al guardar el curso. Inténtelo de nuevo.");
    }
  };
  
  // Función auxiliar para asignar errores de validación
  const setValidationErrors = (errors: Record<string, string>) => {
    Object.entries(errors).forEach(([key, message]) => {
      methods.setError(key as keyof CursoSchema, { type: "manual", message });
    });
  };
  
  // Función auxiliar para resetear estados después de guardar
  const resetState = () => {
    setSelectedCursoId(null);
    setImagesLoaded(false);
    reset();
    setSelectedFile(null);
    setGeneralError(null);
    setUploadError(null);
  };
  
  const handleCancel = () => resetState();
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative flex flex-col gap-6 h-auto overflow-y-auto max-h-[90vh]"
        >
          <Card>
            <CardHeader className="bg-blue-700 text-primary-foreground">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {selectedCursoId === -1 ? "Crear Taller" : "Editar Taller"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {generalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {generalError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="nombre" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Nombre del taller"
                    maxLength={50}
                    {...register("nombre")}
                    className="mt-1"
                  />
                  {errors.nombre && (
                    <p className="text-destructive text-sm mt-1">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="descripcion" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Descripción
                  </Label>
                  <textarea
                    id="descripcion"
                    placeholder="Descripción del taller"
                    rows={5}
                    {...register("descripcion")}
                    className="w-full p-2 border rounded-md mt-1"
                  />
                  {errors.descripcion && (
                    <p className="text-destructive text-sm mt-1">{errors.descripcion.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edadMinima" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Edad mínima
                    </Label>
                    <Input
                      id="edadMinima"
                      type="number"
                      placeholder="Ingrese la edad mínima"
                      min={1}
                      max={99}
                      {...register("edadMinima", { valueAsNumber: true })}
                      className="mt-1"
                    />
                    {errors.edadMinima && (
                      <p className="text-destructive text-sm mt-1">{errors.edadMinima.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="edadMaxima" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Edad máxima
                    </Label>
                    <Input
                      id="edadMaxima"
                      type="number"
                      placeholder="Ingrese la edad máxima"
                      min={1}
                      max={99}
                      {...register("edadMaxima", { valueAsNumber: true })}
                      className="mt-1"
                    />
                    {errors.edadMaxima && (
                      <p className="text-destructive text-sm mt-1">{errors.edadMaxima.message}</p>
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
                  watch('fechaInicio') &&
                    watch('fechaInicio') instanceof Date &&
                    !isNaN(watch('fechaInicio').getTime())
                    ? watch('fechaInicio').toISOString().split('T')[0]
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
                onChange={(e) => setValue('fechaInicio', new Date(e.target.value))}
                className={`p-2 w-full border rounded text-sm ${errors.fechaInicio ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fechaInicio && (
                <p className="mt-1 text-sm text-red-600">{errors.fechaInicio.message}</p>
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
                  watch('fechaFin') && 
                  watch('fechaFin') instanceof Date && 
                  !isNaN(watch('fechaFin').getTime())
                    ? watch('fechaFin').toISOString().split('T')[0]
                    : ""
                }
                min={new Date(new Date().setFullYear(new Date().getMonth() + 1))
                  .toISOString()
                  .split('T')[0]}
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                  .toISOString()
                  .split('T')[0]}
                onChange={(e) => setValue('fechaFin', new Date(e.target.value))}
                className={`p-2 w-full border rounded text-sm ${errors.fechaFin ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fechaFin && (
                <p className="mt-1 text-sm text-red-600">{errors.fechaFin.message}</p>
              )}
            </div>
          </div>
                

                <Label htmlFor="imagen" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagen
                </Label>
                <FileInput
                  id="imagen"
                  onImageChange={handleImageChange}
                  previewUrl={imagePreview}
                  className="mt-1"
                  buttonText="Seleccionar imagen del taller"
                />
                {uploadError && (
                  <p className="text-destructive text-sm mt-1">{uploadError}</p>
                )}
                {selectedFile && (
                  <p className="text-green-600 text-sm mt-1">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}
                {imagePreview && !selectedFile && (
                  <img src={imagePreview} alt="Imagen del taller" className="mt-4 w-full h-auto rounded-md" />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between px-6 pb-6">
            <Button
              type="button"
              onClick={handleCancel}
              variant="destructive"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CursoForm;