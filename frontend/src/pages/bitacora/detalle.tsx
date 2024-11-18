/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBitacora, deleteBitacora } from '../../services/bitacoraService';
import { IBitacora } from '../../interfaces/Bitacora';
import { IUsuario } from '../../interfaces/Usuario';
import {jwtDecode} from 'jwt-decode';
import { getUser } from '../../services/usuarioService';
import { getCategorias } from '../../services/categoriaServices';
import MapaBitacora from '../../components/mapa/mapa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import './detalle.css';
import { ICategoria } from '../../interfaces/Categoria';
import Comentarios from '../../components/comentarios/comentario';

const DetalleBitacora: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bitacora, setBitacora] = useState<IBitacora>();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [autor, setAutor] = useState<IUsuario>(
    { _id: '', nombre: '', correo: '', rol: '', estado: false }
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        const data = await getBitacora(id!);
        setBitacora(data);
      } catch (error) {
        console.error('Error al obtener la bitácora:', error);
      }
    };

    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: any = jwtDecode(token);
          const userId = decoded.id;
          const usuario = await getUser(userId);
          setAutor(usuario);
        }
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await getCategorias();
        setCategorias(response);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchBitacora();
    fetchUsuario();
    fetchCategorias();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta bitácora?')) {
      try {
        await deleteBitacora(id!);
        navigate('/inicio');
      } catch (error) {
        console.error('Error al eliminar la bitácora:', error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/editar-bitacora/${id}`);
  };

  const exportToCSV = () => {
    if (!bitacora) return;

    const data = [
      { Campo: 'Autor', Valor: autor.nombre },
      { Campo: 'Fecha y Hora', Valor: new Date(bitacora.fecha_y_hora).toLocaleString() },
      { Campo: 'Latitud', Valor: bitacora.localizacion_geografica.latitud },
      { Campo: 'Longitud', Valor: bitacora.localizacion_geografica.longitud },
      { Campo: 'Condiciones Climáticas', Valor: bitacora.condiciones_climaticas || 'N/A' },
      { Campo: 'Descripción del Hábitat', Valor: bitacora.descripcion_habitat || 'N/A' },
      { Campo: 'Observaciones Adicionales', Valor: bitacora.observaciones_adicionales || 'N/A' },
    ];

    const csv = Papa.unparse(data);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${bitacora.titulo}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (!bitacora) return;

    const doc = new jsPDF();
    doc.text(bitacora.titulo, 10, 10);
    (doc as any).autoTable({
      head: [['Campo', 'Valor']],
      body: [
        ['Autor', autor.nombre],
        ['Fecha y Hora', new Date(bitacora.fecha_y_hora).toLocaleString()],
        ['Latitud', bitacora.localizacion_geografica.latitud],
        ['Longitud', bitacora.localizacion_geografica.longitud],
        ['Condiciones Climáticas', bitacora.condiciones_climaticas || 'N/A'],
        ['Descripción del Hábitat', bitacora.descripcion_habitat || 'N/A'],
        ['Observaciones Adicionales', bitacora.observaciones_adicionales || 'N/A'],
      ],
    });
    doc.save(`${bitacora.titulo}.pdf`);
  };

  if (!bitacora) return <div>Cargando...</div>;

  const canEditOrDelete = autor && (autor._id === bitacora.autor || autor.rol === 'administrador');
  const canViewNotes = autor && (autor.rol === 'administrador' || autor.rol === 'investigador' || (autor.rol === 'colaborador' && bitacora.nota_visible));
  const categoria = categorias.find(cat => cat._id === bitacora.categoria);

  return (
    <div className="container mt-2 mb-2">
      <h1 className="mb-4">{bitacora.titulo}</h1>
      <div className="row">
        <div className="col-md-6 mb-3">
          <p><strong>Autor:</strong> {autor.nombre}</p>
          <p><strong>Fecha y Hora:</strong> {new Date(bitacora.fecha_y_hora).toLocaleString()}</p>
          <p><strong>Localización Geográfica:</strong> {bitacora.localizacion_geografica.latitud}, {bitacora.localizacion_geografica.longitud}</p>
          <p><strong>Condiciones Climáticas:</strong> {bitacora.condiciones_climaticas}</p>
          <p><strong>Descripción del Hábitat:</strong> {bitacora.descripcion_habitat}</p>
          <p><strong>Categoría:</strong> {categoria ? categoria.nombre : 'N/A'}</p>
          <div className="mb-4">
            <p><strong>Fotografías:</strong></p>
            <div className="fotografias d-flex flex-wrap">
              {bitacora.fotografias.map((foto, index) => (
                <img key={index} src={foto} alt={`Fotografía ${index + 1}`} className="img-thumbnail m-1" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <MapaBitacora longitude={bitacora.localizacion_geografica.longitud} latitude={bitacora.localizacion_geografica.latitud} />
        </div>
      </div>
      <div className="mb-4">
        <p><strong>Observaciones Adicionales:</strong> {bitacora.observaciones_adicionales}</p>
      </div>
      <h2 className="mb-4">Detalles de las Especies</h2>
      {bitacora.detalles_especies.map((especie, index) => (
        <div key={index} className="especie mb-4 p-3 border rounded">
          <p><strong>Nombre Científico:</strong> {especie.nombre_cientifico}</p>
          <p><strong>Nombre Común:</strong> {especie.nombre_comun}</p>
          <p><strong>Familia:</strong> {especie.familia}</p>
          <p><strong>Cantidad de Muestras:</strong> {especie.cantidad_muestras}</p>
          <p><strong>Estado de la Planta:</strong> {especie.estado_planta}</p>
          <p><strong>Fotografías de las Especies:</strong></p>
          <div className="fotografias-especies d-flex flex-wrap">
            {especie.fotografias_especies.map((foto, index) => (
              <img key={index} src={foto} alt={`Fotografía Especie ${index + 1}`} className="img-thumbnail m-1" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
            ))}
          </div>
          {canViewNotes && (
            <div className="mt-3 p-3 border rounded">
              <p><strong>Notas Adicionales:</strong> {bitacora.notas_adicionales || 'N/A'}</p>
            </div>
          )}
        </div>
      ))}

      <Comentarios />

      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-secondary me-2" onClick={exportToCSV}>Exportar CSV</button>
        <button className="btn btn-secondary me-2" onClick={exportToPDF}>Exportar PDF</button>
        {canEditOrDelete && (
          <>
            <button className="btn btn-warning me-2" onClick={handleEdit}>Editar</button>
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default DetalleBitacora;