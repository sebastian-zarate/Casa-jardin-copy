import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DireccionSchemaType } from "@/helpers/direccion"
import Provincias from "../ubicacion/provincia"
import { useState } from "react"
import Localidades from "../ubicacion/localidad"
import { useEffect } from "react";



export const DireccionForm: React.FC = () => {

  const [provincia, setProvincia] = useState<string | null>("")
  const [localidad, setLocalidad] = useState<string | null>("")

  const {
    register,
    formState: { errors },
  } = useFormContext<{ direccion: DireccionSchemaType }>()
  const { getValues } = useFormContext<{ direccion: DireccionSchemaType }>();

  useEffect(() => {
    const provinciaRegistrada = getValues("direccion.provincia");
    if (provinciaRegistrada) {
      setProvincia(provinciaRegistrada);
    }
  }, [getValues]);

  useEffect(() => {
    const localidadRegistrada = getValues("direccion.localidad");
    if (localidadRegistrada) {
      setLocalidad(localidadRegistrada);
    }
  }, [getValues]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="pais">País</Label>
        <Input id="pais" type="text" {...register("direccion.pais")} className="mt-1" />
        {errors.direccion?.pais && <p className="text-destructive text-sm mt-1">{errors.direccion.pais.message}</p>}
      </div>
      <div >
        <Label htmlFor="provincia">Provincia</Label>
        <Provincias setprovincia={setProvincia} provincia={provincia} register={register} />
        {errors.direccion?.provincia && (
          <p className="text-destructive text-sm mt-1">{errors.direccion.provincia.message}</p>
        )}
      </div>

      <div >
        <Label htmlFor="localidad">Localidad</Label>
        <Localidades setLocalidad={setLocalidad} provinciaName={provincia} localidad={localidad} register={register} />       
        {errors.direccion?.localidad && (
          <p className="text-destructive text-sm mt-1">{errors.direccion.localidad.message}</p>
        )}
        
      </div>
      <div>
        <Label htmlFor="calle">Calle</Label>
        <Input id="calle" type="text" {...register("direccion.calle")} className="mt-1" />
        {errors.direccion?.calle && <p className="text-destructive text-sm mt-1">{errors.direccion.calle.message}</p>}
      </div>
      <div>
        <Label htmlFor="numero">Número</Label>
        <Input
          id="numero"
          type="number"
          {...register("direccion.numero", {
            valueAsNumber: true,
            setValueAs: (value) => (value === "" ? undefined : Number(value)),
          })}
          className="mt-1"
        />
        {errors.direccion?.numero && <p className="text-destructive text-sm mt-1">{errors.direccion.numero.message}</p>}
      </div>
    </div>
  )
}

