// pages/api/verificar.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function verificarProvLoc(req: NextApiRequest, res: NextApiResponse) {
  const { provincia, localidad } = req.query;

  if (!provincia && !localidad) {
    return res.status(400).json({ error: "Debe proporcionar 'provincia' o 'localidad'." });
  }

  // Validación combinada: provincia + localidad
  if (provincia && localidad) {
    try {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(localidad as string)}&provincia=${encodeURIComponent(provincia as string)}&max=1`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return res.status(500).json({ error: "Error al consultar la API para validar provincia y localidad." });
      }

      const data = await response.json();
      const existe = data.localidades?.length > 0;

      return res.status(200).json({
        tipo: "localidad_en_provincia",
        provincia,
        localidad,
        valida: existe
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "No se pudo conectar con la API de georreferencia." });
    }
  }

  // Validación individual de provincia
  if (provincia) {
    try {
      const url = `https://apis.datos.gob.ar/georef/api/provincias?nombre=${encodeURIComponent(provincia as string)}&max=1`;
      const response = await fetch(url);

      if (!response.ok) {
        return res.status(500).json({ error: "Error al consultar la API de provincias." });
      }

      const data = await response.json();
      const existe = data.provincias?.length > 0;

      return res.status(200).json({
        tipo: "provincia",
        nombre: provincia,
        valida: existe
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "No se pudo conectar con la API de provincias." });
    }
  }

  // Validación individual de localidad
  if (localidad) {
    try {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(localidad as string)}&max=1`;
      const response = await fetch(url);

      if (!response.ok) {
        return res.status(500).json({ error: "Error al consultar la API de localidades." });
      }

      const data = await response.json();
      const existe = data.localidades?.length > 0;

      return res.status(200).json({
        tipo: "localidad",
        nombre: localidad,
        valida: existe
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "No se pudo conectar con la API de localidades." });
    }
  }
}
