"use client"
import React, {useState, useEffect} from 'react';
import { Smile, User, Phone, MapPin, Heart, BookOpen, Camera, FileSignature } from 'lucide-react';
import { getDireccionCompleta } from '@/services/ubicacion/direccion';
import { getCursoById } from '@/services/cursos';
import InfoSection from './info-section';



interface SolicitudData {
  id: number;
  cursoSolicitud: [{
    id: number,
    solicitudId: number,
    cursoId: number,
  }],
  solicitudMenores: {
    alumno: {
      nombre: string;
      apellido: string;
      dni: number;
      direccionId: number;
      email: string;
      fechaNacimiento: Date;
      responsable: {
        nombre: string;
        apellido: string;
        direccionId: number;
        dni: number;
        email: string;
        telefono: string;
      };
    };
    alergia: string;
    enfermedad: string;
    especialista: string;
    medicacion: string;
    terapia: string;
    firmaReglamento: string;
    firmaSalidas: string;
    firmaUsoImagenes: string;
    observacionesSalidas: string;
    observacionesUsoImagenes: string;
    motivoAsistencia: string;
  };
}

interface SolicitudCardProps {
  data: {
    id: number;
    cursoSolicitud:{
      id: number,
      solicitudId: number,
      cursoId: number,
      curso:{
        id: number,
        nombre: string,
      }
    }[],
    solicitudMenores: {
      alumno: {
        nombre: string;
        apellido: string;
        dni: number;
        direccionId: number;
        email: string;
        fechaNacimiento: Date;
        responsable: {
          nombre: string;
          apellido: string;
          direccionId: number;
          dni: number;
          email: string;
          telefono: string;
        };
      };
      alergia: string;
      enfermedad: string;
      especialista: string;
      medicacion: string;
      motivoAsistencia: string;
      terapia: string;
      firmaReglamento: string;
      firmaSalidas: string;
      firmaUsoImagenes: string;
      observacionesSalidas: string;
      observacionesUsoImagenes: string;
    };
  }
}

const SolicitudCard: React.FC<SolicitudCardProps> = ({ data }) => {
  const [cursos, setCursos] = useState<any>(["No se pudo cargar los cursos"]);
  const [direccionAlumno, setDireccionAlumno] = useState<any>("No se pudo cargar la dirección");
  const [direccionResponsable, setDireccionResponsable] = useState<any>("No se pudo cargar la dirección");
  const [loaded, setLoaded] = useState(false);
  const alumno = data.solicitudMenores.alumno;
  const responsable = alumno.responsable


  useEffect(() => {
    console.log('Fetching data...');
    fetchData();
  }, [data, alumno, responsable]);

  const fetchData = async () => {
    console.log('Flag 1');
    try {
      console.log('Flag 2');
      const [direccionAlumnoData, direccionResponsableData] = await Promise.all([
        getDireccionCompleta(alumno.direccionId),
        getDireccionCompleta(responsable.direccionId),
      ]);
  
      console.log('Dirección Alumno:', direccionAlumnoData);
      console.log('Dirección Responsable:', direccionResponsableData);
      
      const cur = data.cursoSolicitud.map(curso => ({
        cursoId: curso.cursoId,
        nombre: curso.curso.nombre
      }));
      setCursos(cur);
  
      
      const direccionAlumnoStr = `${direccionAlumnoData?.calle} ${direccionAlumnoData?.numero}, ${direccionAlumnoData?.localidad.nombre}, ${direccionAlumnoData?.localidad.provincia.nombre}, ${direccionAlumnoData?.localidad.provincia.nacionalidad.nombre}`;
      const direccionResponsableStr = `${direccionResponsableData?.calle} ${direccionResponsableData?.numero}, ${direccionResponsableData?.localidad.nombre}, ${direccionResponsableData?.localidad.provincia.nombre}, ${direccionResponsableData?.localidad.provincia.nacionalidad.nombre}`;
      
      setDireccionAlumno(direccionAlumnoStr);
      setDireccionResponsable(direccionResponsableStr);
      setLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {loaded ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Información Solicitud {data.id}
            </h2>
          </div>
          
          <div className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">
                <User className="w-5 h-5" />
                Datos Personales</h3>
              
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nombre:</span> {alumno.nombre} {alumno.apellido}</p>
                <p><span className="font-medium">DNI:</span> {alumno.dni}</p>
                <p><span className="font-medium">Email:</span> {alumno.email}</p>
                <p><span className="font-medium">Fecha de Nacimiento:</span> {new Date(alumno.fechaNacimiento).toLocaleDateString()}</p>
                <p><span className="font-medium">Dirección:</span> {direccionAlumno}</p>
              </div>
            </div>
  
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Información del Responsable
              </h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nombre:</span> {responsable.nombre} {responsable.apellido}</p>
                <p><span className="font-medium">DNI:</span> {responsable.dni}</p>
                <p><span className="font-medium">Email:</span> {responsable.email}</p>
                <p><span className="font-medium">Teléfono:</span> {responsable.telefono}</p>
                 <p><span className="font-medium">Dirección:</span> {direccionResponsable}</p>
              </div>
            </div>
          </div>
  
          <div className="border-t">
            <div className="bg-green-50 p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                Información Médica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p><span className="font-medium">Alergias:</span> {data.solicitudMenores.alergia || 'No reportadas'}</p>
                  <p><span className="font-medium">Enfermedades:</span> {data.solicitudMenores.enfermedad || 'No reportadas'}</p>
                  <p><span className="font-medium">Medicación:</span> {data.solicitudMenores.medicacion || 'No reportada'}</p>
                </div>
                <div>
                  <p><span className="font-medium">Especialista:</span> {data.solicitudMenores.especialista || 'No reportado'}</p>
                  <p><span className="font-medium">Terapia:</span> {data.solicitudMenores.terapia || 'No reportada'}</p>
                  <p><span className="font-medium">Motivo de Asistencia:</span> {data.solicitudMenores.motivoAsistencia || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>
  
           <div className="border-t">
            <div className="bg-indigo-50 p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Cursos seleccionados
              </h3>
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cursos.map((course: any) => (
                  <div key={course.id}>
                    <p><span className="font-medium"> - </span> {course.nombre}</p>
                  </div>
                ))}
              </div>
            </div>
          </div> 
  
          <div className="border-t">
            <div className="bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <FileSignature className="w-6 h-6" />
                Autorizaciones y Observaciones
              </h3>
              <div className="mt-2 space-y-2">
              <p className="text-gray-600">Firma Reglamento: <span className="font-semibold">{data.solicitudMenores.firmaReglamento? 'De acuerdo' : 'Rechazado'}</span></p>
              <p className="text-gray-600">Firma Salidas: <span className="font-semibold">{data.solicitudMenores.firmaSalidas? 'De acuerdo' : 'Rechazado'}</span></p>
              <p className="text-gray-600">Firma Uso de Imágenes: <span className="font-semibold">{data.solicitudMenores.firmaUsoImagenes? 'De acuerdo' : 'Rechazado'}</span></p>
              <p className="text-gray-600">Observaciones Salidas: <span className="font-semibold">{data.solicitudMenores.observacionesSalidas || 'Sin observaciones'}</span></p>
              <p className="text-gray-600">Observaciones Uso de Imágenes: <span className="font-semibold">{data.solicitudMenores.observacionesUsoImagenes || 'Sin observaciones'}</span></p>
            </div>
            </div>
          </div>
        </div>) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6" />
                Información Solicitud {data.id}
              </h2>
            </div>
            <div className="p-6">
              <p>Cargando...</p>
            </div>
          </div>
        )}
      </div>
  );
};

export default SolicitudCard;

