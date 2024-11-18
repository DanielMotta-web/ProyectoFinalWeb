/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { createBitacora } from '../../services/bitacoraService';
import { IUsuario } from '../../interfaces/Usuario';
import { IEspecie } from '../../interfaces/Especie';
import { uploadImage } from '../../services/uploadImage';
import { ICategoria } from '../../interfaces/Categoria';
import { getCategorias } from '../../services/categoriaServices';
import './CrearBitacora.css';


const CrearBitacora: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [fechaYHora, setFechaYHora] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [condicionesClimaticas, setCondicionesClimaticas] = useState('');
  const [descripcionHabitat, setDescripcionHabitat] = useState('');
  const [fotografias, setFotografias] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fotografias2, setFotografias2] = useState<string[]>([]);
  const [selectedFiles2, setSelectedFiles2] = useState<File[]>([]);
  const [detallesEspecies, setDetallesEspecies] = useState<IEspecie[]>([]);
  const [observacionesAdicionales, setObservacionesAdicionales] = useState('');
  const [autor, setAutor] = useState<IUsuario['_id']>();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [categoria, setCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [especie, setEspecie] = useState<IEspecie>({
    nombre_cientifico: '',
    nombre_comun: '',
    familia: '',
    cantidad_muestras: 0,
    estado_planta: 'viva',
    fotografias_especies: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded: any = jwtDecode(token);
          const userId = decoded.id;
          setAutor(userId);
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

    fetchCurrentUser();
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor) {
      console.error('Usuario no autenticado');
      return;
    }
    try {
      const subirFotoBitacora = await Promise.all(
        selectedFiles.map(async (file) => {
          const imageUrl = await uploadImage(file);
          return imageUrl;
        })
      );

      const detallesEspeciesConFotos = await Promise.all(
        detallesEspecies.map(async (especie) => {
          const fotosEspecie = await Promise.all(
            selectedFiles2.map(async (file) => {
              const imageUrl = await uploadImage(file);
              return imageUrl;
            })
          );
          return { ...especie, fotografias_especies: fotosEspecie };
        })
      );

      await createBitacora({
        titulo,
        fecha_y_hora: new Date(fechaYHora),
        localizacion_geografica: {
          latitud: parseFloat(latitud),
          longitud: parseFloat(longitud),
        },
        condiciones_climaticas: condicionesClimaticas,
        descripcion_habitat: descripcionHabitat,
        fotografias: subirFotoBitacora,
        detalles_especies: detallesEspeciesConFotos,
        observaciones_adicionales: observacionesAdicionales,
        autor: autor,
        categoria: categoria,
      });
      navigate('/inicio');
    } catch (error) {
      console.error('Error al crear la bitácora:', error);
    }
  };

  const handleAddEspecie = () => {
    setDetallesEspecies([...detallesEspecies, especie]);
    setEspecie({
      nombre_cientifico: '',
      nombre_comun: '',
      familia: '',
      cantidad_muestras: 0,
      estado_planta: 'viva',
      fotografias_especies: []
    });
    setShowModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      const filePreviews = files.map(file => URL.createObjectURL(file));
      setFotografias(prevFotos => [...prevFotos, ...filePreviews]);
    }
  };

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles2(prevFiles => [...prevFiles, ...files]);
      const filePreviews = files.map(file => URL.createObjectURL(file));
      setFotografias2(prevFotos => [...prevFotos, ...filePreviews]);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitud(position.coords.latitude.toString());
          setLongitud(position.coords.longitude.toString());
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    } else {
      console.error('La geolocalización no es compatible con este navegador.');
    }
  };

  return (
    <div className="container mt-2">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <h1>Crear Bitácora</h1>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="titulo"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
              <label htmlFor="titulo">Título</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="datetime-local"
                className="form-control"
                id="fechaYHora"
                placeholder="Fecha y Hora"
                value={fechaYHora}
                onChange={(e) => setFechaYHora(e.target.value)}
                required
              />
              <label htmlFor="fechaYHora">Fecha y Hora</label>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="latitud"
                  placeholder="Latitud"
                  value={latitud}
                  onChange={(e) => setLatitud(e.target.value)}
                  required
                />
                <label htmlFor="latitud">Latitud</label>
              </div>
              <div className="form-floating ms-2">
                <input
                  type="text"
                  className="form-control"
                  id="longitud"
                  placeholder="Longitud"
                  value={longitud}
                  onChange={(e) => setLongitud(e.target.value)}
                  required
                />
                <label htmlFor="longitud">Longitud</label>
              </div>
              <div className="d-flex align-items-end ms-2">
                <button type="button" className="btn btn-secondary h-100 w-100" onClick={handleGetCurrentLocation}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="form-floating mb-3">
              <select
                className="form-control"
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Seleccionar Categoría</option>
                {categorias.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                ))}
              </select>
              <label htmlFor="categoria">Categoría</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="condicionesClimaticas"
                placeholder="Condiciones Climáticas"
                value={condicionesClimaticas}
                onChange={(e) => setCondicionesClimaticas(e.target.value)}
              />
              <label htmlFor="condicionesClimaticas">Condiciones Climáticas</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="descripcionHabitat"
                placeholder="Descripción del Hábitat"
                value={descripcionHabitat}
                onChange={(e) => setDescripcionHabitat(e.target.value)}
              />
              <label htmlFor="descripcionHabitat">Descripción del Hábitat</label>
            </div>
            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                id="observacionesAdicionales"
                placeholder="Observaciones Adicionales"
                value={observacionesAdicionales}
                onChange={(e) => setObservacionesAdicionales(e.target.value)}
              />
              <label htmlFor="observacionesAdicionales">Observaciones Adicionales</label>
            </div>
          </div>

          <div className="col-md-6 mt-2">
            <h2>Fotografías</h2>
            <input className="form-control" type="file" accept="image/*" multiple onChange={handleFileChange} />
            <div className="mt-3 d-flex flex-wrap">
              {fotografias.map((foto, index) => (
                <div key={index} className="m-1" style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                  <img src={foto} alt={`Fotografía ${index + 1}`} className="img-thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button type="button" className="btn btn-secondary me-3" onClick={() => setShowModal(true)}>Agregar Especie</button>
              <button className="btn btn-primary" type="submit">Crear Bitácora</button>
            </div>
          </div>
        </div>
        
      </form>

      {/* Modal para agregar especies */}
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex={-1} role="dialog" style={{ backgroundColor: showModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header justify-content-between">
              <h5 className="modal-title">Agregar Especie</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="nombre_cientifico"
                  placeholder="Nombre Científico"
                  value={especie.nombre_cientifico}
                  onChange={(e) => setEspecie({ ...especie, nombre_cientifico: e.target.value })}
                />
                <label htmlFor="nombre_cientifico">Nombre Científico</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="nombre_comun"
                  placeholder="Nombre Común"
                  value={especie.nombre_comun}
                  onChange={(e) => setEspecie({ ...especie, nombre_comun: e.target.value })}
                  required
                />
                <label htmlFor="nombre_comun">Nombre Común</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="familia"
                  placeholder="Familia"
                  value={especie.familia}
                  onChange={(e) => setEspecie({ ...especie, familia: e.target.value })}
                />
                <label htmlFor="familia">Familia</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="cantidad_muestras"
                  placeholder="Cantidad de Muestras"
                  value={especie.cantidad_muestras}
                  onChange={(e) => setEspecie({ ...especie, cantidad_muestras: parseInt(e.target.value) })}
                  required
                />
                <label htmlFor="cantidad_muestras">Cantidad de Muestras</label>
              </div>
              <div className="form-floating mb-3">
                <select
                  className="form-control"
                  id="estado_planta"
                  value={especie.estado_planta}
                  onChange={(e) => setEspecie({ ...especie, estado_planta: e.target.value as 'viva' | 'seca' | 'otro' })}
                  required
                >
                  <option value="viva">Viva</option>
                  <option value="seca">Seca</option>
                  <option value="otro">Otro</option>
                </select>
                <label htmlFor="estado_planta">Estado de la Planta</label>
              </div>
              <label htmlFor="fotografias_especies">Fotografías de las Especies</label>
              <input className="form-control" type="file" accept="image/*" multiple onChange={handleFileChange2} />
              <div className="mt-3 d-flex flex-wrap">
                {fotografias2.map((foto, index) => (
                  <div key={index} className="m-1" style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                    <img src={foto} alt={`Fotografía ${index + 1}`} className="img-thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-primary" onClick={handleAddEspecie}>Agregar Especie</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearBitacora;