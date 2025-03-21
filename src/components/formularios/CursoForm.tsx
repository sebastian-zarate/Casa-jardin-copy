"use client"

import { z } from "zod"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, ImageIcon, Loader } from "lucide-react"
import { updateCurso, createCurso } from "../../services/cursos"
import { handleUploadCursoImage } from "@/helpers/repoImages"
import { FileInput } from "@/components/ui/fileInput"
import { formDate } from "@/helpers/fechas"

// Schema de validación para cursos
const cursoSchema = z
  .object({
    id: z.number().optional(),
    nombre: z
    .string()
    .min(2, { message: "Debe completar el nombre" })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres" })
    .trim()
    .regex(/^[a-zA-Z0-9À-ÿ\u00f1\u00d1\u00fc\u00dc\s.,:-]*$/, {
      message: "El nombre contiene caracteres no permitidos",
    }),
    descripcion: z
    .string()
    .min(2, { message: "Debe completar la descripción" })
    .max(500, { message: "La descripción no puede tener más de 500 caracteres" })
    .trim()
   

    .regex(/^[a-zA-Z0-9À-ÿ\u00f1\u00d1\u00fc\u00dc\s.,:-]*$/, {
      message
      : "La descripción contiene caracteres no permitidos",
    })
    .refine((value) => value.length > 2, {
      message: "La descripción debe tener al menos 5 palabras",
    })
    .refine((value) => value.length < 500, {
      message: "La descripción no puede tener más de 500 caracteres",
    }),
    
    fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Debe ser una fecha válida" }),
    fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Debe ser una fecha válida" }),

    edadMinima: z
      .number({ message: "Inserte un número válido" })
      .min(2, { message: "La edad mínima no puede ser menor a 2 años" })
      .max(99, { message: "La edad mínima no puede superar los 99 años" }),
    edadMaxima: z
      .number({ message: "Inserte un número válido" })
      .min(2, { message: "La edad máxima no puede ser menor a 2 años" })
      .max(99, { message: "La edad máxima no puede superar los 99 años" }),

    imagen: z.any().nullable().optional(),
    cantidadParticipantes: z.number().optional(),
  })
  .refine((data) => Number(data.edadMinima) < Number(data.edadMaxima), {
    message: "La edad mínima debe ser menor que la edad máxima",
    path: ["edadMinima"], // This will attach the error message to the edadMinima field
  })
  // Validación personalizada para la diferencia de fechas (minimo 7 días)
  .refine((data) => {
    const fechaInicio = new Date(data.fechaInicio);
    const fechaFin = new Date(data.fechaFin);
    const diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
   //valide que sea menor a un año  
   
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 7;
  }, {
    message: "Debe haber al menos 7 días de diferencia entre la fecha de inicio y la fecha de fin",
    path: ["fechaInicio"],
  });

export type CursoSchema = z.infer<typeof cursoSchema>

interface CursoFormProps {
  selectedCursoId: number | null
  cursos: any[]
  setSelectedCursoId: React.Dispatch<React.SetStateAction<number | null>>
  fetchCursos: () => Promise<void>
  setImagesLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

const CursoForm: React.FC<CursoFormProps> = ({
  selectedCursoId,
  cursos,
  setSelectedCursoId,
  fetchCursos,
  setImagesLoaded,
}) => {
  const [imagePreview, setImagePreview] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)

  const selectedCurso =
    selectedCursoId !== null && selectedCursoId !== -1 ? cursos.find((curso) => curso.id === selectedCursoId) : null

  const methods = useForm<CursoSchema>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      id: selectedCurso?.id,
      nombre: selectedCurso?.nombre || "",
      descripcion: selectedCurso?.descripcion || "",
      fechaInicio: selectedCurso?.fechaInicio ? formDate(selectedCurso?.fechaInicio) : "",
      fechaFin: selectedCurso?.fechaFin ? formDate(selectedCurso?.fechaFin) : "",
      edadMinima: selectedCurso?.edadMinima || undefined,
      edadMaxima: selectedCurso?.edadMaxima || undefined,
      imagen: selectedCurso?.imagen || null,
      cantidadParticipantes: selectedCurso?.cantidadParticipantes || 0,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = methods

  useEffect(() => {
    //si es un curso existente
    if (selectedCursoId !== null && selectedCursoId !== -1) {
      const curso = cursos.find((c) => c.id === selectedCursoId)
      if (curso) {
        reset({
          id: curso.id,
          nombre: curso.nombre,
          descripcion: curso.descripcion,
          fechaInicio: curso.fechaInicio ? formDate(curso.fechaInicio) : "",
          fechaFin: curso.fechaFin ? formDate(curso.fechaFin) : "",
          edadMinima: curso.edadMinima,
          edadMaxima: curso.edadMaxima,
          imagen: curso.imagen,
          cantidadParticipantes: curso.cantidadParticipantes,
        })
        setImagePreview(curso.imageUrl || "")
      }
    }
    //si es un curso nuevo, resetea los valores del formulario
    else if (selectedCursoId === -1) {
      console.log("reset -1")
      reset({
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        edadMinima: undefined,
        edadMaxima: undefined,
        imagen: null,
        cantidadParticipantes: 0,
      })
      setImagePreview("")
    }
    setGeneralError(null)
    setUploadError(null)
  }, [selectedCursoId, cursos, reset]) 

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImagePreview(URL.createObjectURL(file))
      setSelectedFile(file)
      const fileName = file.name.split(".").slice(0, -1).join(".") + "." + file.name.split(".").pop()
      setValue("imagen", fileName)
      setUploadError(null)
    } else {
      setImagePreview(selectedCurso?.imageUrl || "")
      setSelectedFile(null)
    }
  }

  const handleUploadAndFetchImages = async (file: File | null, imageName: string) => {
    const result = await handleUploadCursoImage(file, imageName)
    if (result.error) {
      setUploadError(result.error)
      return false
    }
    setImagesLoaded(false)
    return true
  }

  const onSubmit = async (data: CursoSchema) => {
    // Crear o actualizar curso
    const cursoPayload = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      fechaInicio: new Date(data.fechaInicio)
      ,
      fechaFin: new Date(data.fechaFin),
      edadMinima: Number(data.edadMinima),
      edadMaxima: Number(data.edadMaxima),
      imagen: data.imagen || null,
    }

    const response =
      selectedCursoId === -1
        ? await createCurso(cursoPayload)
        : selectedCursoId !== null
          ? await updateCurso(selectedCursoId, cursoPayload)
          : null

    if (typeof response === "string") {
      setGeneralError(response)
      return
    }
    try {
      // Subir imagen si es necesario
      if (selectedFile && data.imagen) {
        const imageUploaded = await handleUploadAndFetchImages(selectedFile, data.imagen)
        if (!imageUploaded) return
      }

      // Resetear estados y recargar cursos
      await fetchCursos()
      resetState()
    } catch (error) {
      console.error("Error al guardar el curso:", error)
      setGeneralError("Error al guardar el curso. Inténtelo de nuevo.")
    }
  }

  // Función auxiliar para asignar errores de validación
  /* const setValidationErrors = (errors: Record<string, string>) => {
    Object.entries(errors).forEach(([key, message]) => {
      methods.setError(key as keyof CursoSchema, { type: "manual", message })
    })
  } */

  // Función auxiliar para resetear estados después de guardar
  const resetState = () => {
    setSelectedCursoId(null)
    setImagesLoaded(false)
    reset()
    setSelectedFile(null)
    setGeneralError(null)
    setUploadError(null)
  }

  const handleCancel = async () => {
   
    
    resetState()
  }

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
              {/* Debug section - remove after debugging */}
              {/*               {Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
                  <p>Errores de validación:</p>
                  <ul className="list-disc pl-5">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>
                        {field}: {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
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
                    maxLength={75}
                    {...register("nombre")}
                    className="mt-1"
                  />
                  {errors.nombre && <p className="text-destructive text-sm mt-1">{errors.nombre.message}</p>}
                </div>

                <div>
                  <Label htmlFor="descripcion" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Descripción
                  </Label>
                  <textarea
                    id="descripcion"
                    placeholder="Descripción del taller"
                    maxLength={500}
                    rows={5}
                    {...register("descripcion")}
                    className="w-full p-2 border rounded-md mt-1"
                  />
                  {errors.descripcion && <p className="text-destructive text-sm mt-1">{errors.descripcion.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edadMinima" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Edad mínima
                    </Label>
                    <Input
                      id="edadMinima"
                      type="text"
                      placeholder="Ingrese la edad mínima"
                      
                      {...register("edadMinima", { valueAsNumber: true })}
                      className="mt-1"
                    />
                    {errors.edadMinima && <p className="text-destructive text-sm mt-1">{errors.edadMinima.message}</p>}
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
                    {errors.edadMaxima && <p className="text-destructive text-sm mt-1">{errors.edadMaxima.message}</p>}
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
                    !isNaN(new Date(watch('fechaInicio')).getTime())
                      ? new Date(watch('fechaInicio')).toISOString().split('T')[0]
                      : ""
                    }
                    min={
                    selectedCursoId !== -1
                      ? new Date(selectedCurso?.fechaInicio || "").toISOString().split('T')[0]
                      : new Date().toISOString().split('T')[0]
                    }
                    max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                    .toISOString()
                    .split('T')[0]}
                    onChange={(e) => setValue('fechaInicio', new Date(e.target.value).toISOString().split('T')[0])}
                    className={`p-2 w-full border rounded text-sm ${errors.fechaInicio ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fechaInicio && (
                    <p className="text-destructive text-sm mt-1">{errors.fechaInicio.message}</p>
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
                      !isNaN(new Date(watch('fechaFin')).getTime())
                      ? new Date(watch('fechaFin')).toISOString().split('T')[0]
                      : ""
                    }
                    min={
                      selectedCursoId !== -1
                      ? new Date(new Date(watch('fechaInicio') || "").setDate(new Date(watch('fechaInicio') || "").getDate() + 7))
                        .toISOString()
                        .split('T')[0]
                      : new Date(new Date().setDate(new Date().getDate() + 7))
                        .toISOString()
                        .split('T')[0]
                    }
                    max={
                      selectedCursoId !== -1
                      ? new Date(new Date(watch('fechaInicio') || "").setFullYear(new Date(watch('fechaInicio') || "").getFullYear() + 1))
                        .toISOString()
                        .split('T')[0]
                      : new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                        .toISOString()
                        .split('T')[0]
                    }
                    onChange={(e) => setValue('fechaFin', new Date(e.target.value).toISOString().split('T')[0])}
                    className={`p-2 w-full border rounded text-sm ${errors.fechaFin ? 'border-red-500' : 'border-gray-300'}`}
                    />

                    {errors.fechaFin && <p className="text-destructive text-sm mt-1">{errors.fechaFin.message}</p>}
                    
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
                {uploadError && <p className="text-destructive text-sm mt-1">{uploadError}</p>}
                {selectedFile && (
                  <p className="text-green-600 text-sm mt-1">Archivo seleccionado: {selectedFile.name}</p>
                )}
                {imagePreview && !selectedFile && (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Imagen del taller"
                    className="mt-4 w-full h-auto rounded-md"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between px-6 pb-6">
            <Button type="button" onClick={handleCancel} variant="destructive" disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
  )
}

export default CursoForm

