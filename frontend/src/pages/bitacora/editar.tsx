import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBitacora, updateBitacora } from '../../services/bitacoraService';
import { getCategorias } from '../../services/categoriaServices';
import { IBitacora } from '../../interfaces/Bitacora';
import { ICategoria } from '../../interfaces/Categoria';
import './editar.css';

const EditarBitacora: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bitacora, setBitacora] = useState<IBitacora | null>(null);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [fotosParaEliminar, setFotosParaEliminar] = useState<string[]>([]);
  const [fotosEspeciesParaEliminar, setFotosEspeciesParaEliminar] = useState<string[]>([]);
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

    const fetchCategorias = async () => {
      try {
        const response = await getCategorias();
        setCategorias(response);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchBitacora();
    fetchCategorias();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === 'checkbox' ? checked : value;
    setBitacora(prevState => prevState ? { ...prevState, [name]: newValue } : null);
  };

  const handleEliminarFoto = (foto: string) => {
    setFotosParaEliminar(prevState => 
      prevState.includes(foto) ? prevState.filter(f => f !== foto) : [...prevState, foto]
    );
  };

  const handleEliminarFotoEspecie = (foto: string) => {
    setFotosEspeciesParaEliminar(prevState => 
      prevState.includes(foto) ? prevState.filter(f => f !== foto) : [...prevState, foto]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bitacora) {
      const nuevasFotos = bitacora.fotografias.filter(foto => !fotosParaEliminar.includes(foto));
      const nuevasEspecies = bitacora.detalles_especies.map((especie) => {
        const nuevasFotosEspecie = especie.fotografias_especies.filter(foto => !fotosEspeciesParaEliminar.includes(foto));
        return { ...especie, fotografias_especies: nuevasFotosEspecie };
      });

      try {
        await updateBitacora(id!, { ...bitacora, fotografias: nuevasFotos, detalles_especies: nuevasEspecies });
        navigate(`/bitacora/${id}`);
      } catch (error) {
        console.error('Error al actualizar la bitácora:', error);
      }
    }
  };

  if (!bitacora) return <div>Cargando...</div>;

  return (
    <div className="container mt-2">
      <h1 className="mb-4">Editar Bitácora</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">Título</label>
              <input
                type="text"
                className="form-control"
                id="titulo"
                name="titulo"
                value={bitacora.titulo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fecha_y_hora" className="form-label">Fecha y Hora</label>
              <input
                type="datetime-local"
                className="form-control"
                id="fecha_y_hora"
                name="fecha_y_hora"
                value={new Date(bitacora.fecha_y_hora).toISOString().slice(0, 16)}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="latitud" className="form-label">Latitud</label>
              <input
                type="number"
                className="form-control"
                id="latitud"
                name="localizacion_geografica.latitud"
                value={bitacora.localizacion_geografica.latitud}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="longitud" className="form-label">Longitud</label>
              <input
                type="number"
                className="form-control"
                id="longitud"
                name="localizacion_geografica.longitud"
                value={bitacora.localizacion_geografica.longitud}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="condiciones_climaticas" className="form-label">Condiciones Climáticas</label>
              <input
                type="text"
                className="form-control"
                id="condiciones_climaticas"
                name="condiciones_climaticas"
                value={bitacora.condiciones_climaticas}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcion_habitat" className="form-label">Descripción del Hábitat</label>
              <textarea
                className="form-control"
                id="descripcion_habitat"
                name="descripcion_habitat"
                value={bitacora.descripcion_habitat}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="observaciones_adicionales" className="form-label">Observaciones Adicionales</label>
              <textarea
                className="form-control"
                id="observaciones_adicionales"
                name="observaciones_adicionales"
                value={bitacora.observaciones_adicionales}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">Categoría</label>
              <select
                className="form-control"
                id="categoria"
                name="categoria"
                value={bitacora.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria._id} value={categoria._id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Fotografías</label>
              <div className="d-flex flex-wrap">
                {bitacora.fotografias.map((foto, index) => (
                  <div key={index} className="position-relative m-1">
                    <img
                      src={foto}
                      alt={`Fotografía ${index + 1}`}
                      className={`img-thumbnail ${fotosParaEliminar.includes(foto) ? 'foto-eliminar' : ''}`}
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleEliminarFoto(foto)}>
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
          <div className="col-md-6">
            {bitacora.detalles_especies.map((especie, index) => (
              <div key={index} className="especie mb-4 p-3 border rounded">
                <h4 className="mb-4">Detalles de las Especies</h4>
                <div className="mb-3">
                  <label htmlFor={`nombre_cientifico_${index}`} className="form-label">Nombre Científico</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`nombre_cientifico_${index}`}
                    name={`detalles_especies[${index}].nombre_cientifico`}
                    value={especie.nombre_cientifico}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor={`nombre_comun_${index}`} className="form-label">Nombre Común</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`nombre_comun_${index}`}
                    name={`detalles_especies[${index}].nombre_comun`}
                    value={especie.nombre_comun}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor={`familia_${index}`} className="form-label">Familia</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`familia_${index}`}
                    name={`detalles_especies[${index}].familia`}
                    value={especie.familia}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor={`cantidad_muestras_${index}`} className="form-label">Cantidad de Muestras</label>
                  <input
                    type="number"
                    className="form-control"
                    id={`cantidad_muestras_${index}`}
                    name={`detalles_especies[${index}].cantidad_muestras`}
                    value={especie.cantidad_muestras}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor={`estado_planta_${index}`} className="form-label">Estado de la Planta</label>
                  <select
                    className="form-control"
                    id={`estado_planta_${index}`}
                    name={`detalles_especies[${index}].estado_planta`}
                    value={especie.estado_planta}
                    onChange={handleChange}
                    required
                  >
                    <option value="viva">Viva</option>
                    <option value="seca">Seca</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Fotografías de las Especies</label>
                  <div className="d-flex flex-wrap">
                    {especie.fotografias_especies.map((foto, index) => (
                      <div key={index} className="position-relative m-1">
                        <img
                          src={foto}
                          alt={`Fotografía Especie ${index + 1}`}
                          className={`img-thumbnail ${fotosEspeciesParaEliminar.includes(foto) ? 'foto-eliminar' : ''}`}
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleEliminarFotoEspecie(foto)}>
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="mb-3">
              <label htmlFor="notas_adicionales" className="form-label">Notas Adicionales</label>
              <textarea
                className="form-control"
                id="notas_adicionales"
                name="notas_adicionales"
                value={bitacora.notas_adicionales}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="nota_visible"
                name="nota_visible"
                checked={bitacora.nota_visible}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="nota_visible">Nota visible para colaboradores</label>
            </div>
            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditarBitacora;