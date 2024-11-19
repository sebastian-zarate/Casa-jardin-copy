//import {uploadImageCursos, deleteImageCursos, uploadImageProfesionales, deleteImageProfesionales} from "@/services/repoImage";
import {uploadImageCursos, deleteImageCursos, uploadImageProfesionales, deleteImageProfesionales} from "@/services/repoImage";
// Convertir el archivo a Base64 antes de enviarlo al servidor
export const toBase64 = (file: File): Promise<string> => {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = () => resolve(reader.result as string);
     reader.onerror = error => reject(error);
   });
 };

 //helper para mapear las imagenes de los cursos / profesionales
type MappableEntity = {
  imagen: string | null;
  [key: string]: any;
};

type ImageResult = {
  images: string[];
  downloadurls: string[];
};

export function mapearImagenes<T extends MappableEntity>(
  entities: T[],
  imageResult: ImageResult
): T[] {
  const { images, downloadurls } = imageResult;

  return entities.map((entity) => {
    const entityImage = entity.imagen || "";
    const imageIndex = images.findIndex((image) => image === entityImage);

    if (imageIndex !== -1) {
      return { ...entity, imageUrl: downloadurls[imageIndex] };
    }
    return entity; // Si no hay coincidencia, devuelve la entidad sin cambios
  });
}

// #region Curso
export const handleUploadCursoImage = async (selectedFile: File | null, fileName: string) => {
   if (selectedFile) {
     try {
       // Convertir a Base64 antes de enviar al servidor
       const base64File = await toBase64(selectedFile);
       const result = await uploadImageCursos(base64File, fileName); // Enviar Base64 en lugar de File
       if (result.error) {
         return { error: result.error };
       } else {
         // Más acciones después de la subida
         console.log("Image uploaded successfully:", result);
         return { result };
       }
     } catch (err) {
       return { error: "Error converting file to Base64." };
     }
   } else {
     return { error: "Please select a file first." };
   }
 };

export const handleDeleteCursoImage = async (fileName: string) => {
   console.log("...Deleting image:", fileName);
   const result = await deleteImageCursos(fileName);
   if (result.error) {
     return { error: result.error };
   } else {
     // Más acciones después de la eliminación
     console.log("Image deleted successfully:", result);
     return { result };
   }
}
//#endregion

// #region Profesional
export const handleUploadProfesionalImage = async (selectedFile: File | null, fileName: string) => {
  console.log("...Uploading image:", selectedFile);
  if (selectedFile) {
    try {
      // Convertir a Base64 antes de enviar al servidor
      const base64File = await toBase64(selectedFile);
      const result = await uploadImageProfesionales(base64File, fileName); // Enviar Base64 en lugar de File
      if (result.error) {
        console.log("Error uploading image:", result.error);
        return { error: result.error };
      } else {
        // Más acciones después de la subida
        console.log("Image uploaded successfully:", result);
        return { result };
      }
    } catch (err) {
      console.log("Error converting file to Base64.", err);
      return { error: "Error converting file to Base64." };
    }
  } else {
    console.log("Please select a file first.");
    return { error: "Please select a file first." };
  }
}

export const handleDeleteProfesionalImage = async (fileName: string) => {
  console.log("...Deleting image:", fileName);
  const result = await deleteImageProfesionales(fileName);
  if (result.error) {
    return { error: result.error };
  } else {
    // Más acciones después de la eliminación
    console.log("Image deleted successfully:", result);
    return { result };
  }
}
//#endregion