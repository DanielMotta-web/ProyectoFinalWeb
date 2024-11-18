/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBitacoras } from '../../services/bitacoraService';
import { getUser } from '../../services/usuarioService';
import './Inicio.css';

const Inicio: React.FC = () => {
  const [bitacoras, setBitacoras] = useState<any[]>([]);
  const [filteredBitacoras, setFilteredBitacoras] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTitleOrEspecie, setSearchTitleOrEspecie] = useState('');
  const [searchDateFrom, setSearchDateFrom] = useState('');
  const [searchDateTo, setSearchDateTo] = useState('');
  const [searchLatitud, setSearchLatitud] = useState('');
  const [searchLongitud, setSearchLongitud] = useState('');
  const [searchHabitat, setSearchHabitat] = useState('');
  const [searchClima, setSearchClima] = useState('');
  const [sortField, setSortField] = useState<string>('fecha_y_hora');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const data = await getBitacoras();
        const bitacorasWithAuthors = await Promise.all(
          data.map(async (bitacora) => {
            const autor = await getUser(bitacora.autor);
            return { ...bitacora, autor };
          })
        );
        setBitacoras(bitacorasWithAuthors);
        setFilteredBitacoras(bitacorasWithAuthors);
      } catch (error) {
        console.error('Error al obtener las bitácoras:', error);
      }
    };

    fetchBitacoras();
  }, []);

  const calculateRelevance = (bitacora: any, searchTerm: string) => {
    let relevance = 0;
    if (bitacora.titulo.toLowerCase().includes(searchTerm)) relevance++;
    if (bitacora.descripcion_habitat?.toLowerCase().includes(searchTerm)) relevance++;
    if (bitacora.condiciones_climaticas?.toLowerCase().includes(searchTerm)) relevance++;
    bitacora.detalles_especies.forEach((especie: any) => {
      if (especie.nombre_cientifico.toLowerCase().includes(searchTerm)) relevance++;
    });
    return relevance;
  };

  const handleSearch = () => {
    const filtered = bitacoras.filter(bitacora => {
      const searchTerm = searchTitleOrEspecie.toLowerCase();
      const titleMatch = bitacora.titulo.toLowerCase().includes(searchTerm);
      const especieMatch = bitacora.detalles_especies.some((especie: any) =>
        especie.nombre_cientifico.toLowerCase().includes(searchTerm)
      );
      const dateFromMatch = searchDateFrom ? new Date(bitacora.fecha_y_hora) >= new Date(searchDateFrom) : true;
      const dateToMatch = searchDateTo ? new Date(bitacora.fecha_y_hora) <= new Date(searchDateTo) : true;
      const latitudMatch = searchLatitud ? bitacora.localizacion_geografica.latitud.toString().includes(searchLatitud) : true;
      const longitudMatch = searchLongitud ? bitacora.localizacion_geografica.longitud.toString().includes(searchLongitud) : true;
      const habitatMatch = searchHabitat ? bitacora.descripcion_habitat?.toLowerCase().includes(searchHabitat.toLowerCase()) : true;
      const climaMatch = searchClima ? bitacora.condiciones_climaticas?.toLowerCase().includes(searchClima.toLowerCase()) : true;

      return (titleMatch || especieMatch) && dateFromMatch && dateToMatch && latitudMatch && longitudMatch && habitatMatch && climaMatch;
    });
    setFilteredBitacoras(filtered);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    const sorted = [...filteredBitacoras].sort((a, b) => {
      if (field === 'relevancia') {
        const searchTerm = searchTitleOrEspecie.toLowerCase();
        const aRelevance = calculateRelevance(a, searchTerm);
        const bRelevance = calculateRelevance(b, searchTerm);
        return sortOrder === 'asc' ? aRelevance - bRelevance : bRelevance - aRelevance;
      } else {
        const aValue = field.split('.').reduce((o, i) => (o as any)[i], a);
        const bValue = field.split('.').reduce((o, i) => (o as any)[i], b);
        if (aValue === undefined || bValue === undefined) {
          return 0;
        }
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
    });
    setFilteredBitacoras(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleAddBitacora = () => {
    navigate('/crear-bitacora');
  };

  const handleViewDetails = (id: string) => {
    navigate(`/bitacora/${id}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://capitalist.com.br/wp-content/uploads/2023/02/balsamo-scaled.jpg'; // Reemplaza con la ruta de tu imagen de reemplazo
  };

  return (
    <div className="container mt-2">
      <div className="row mb-2">
        <div className="col-md-8 mb-2">
          <input
            type="text"
            placeholder="Buscar por título o especie..."
            value={searchTitleOrEspecie}
            onChange={(e) => setSearchTitleOrEspecie(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-4 mb-2 d-flex">
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
              Ordenar por
            </button>
            <ul className="dropdown-menu w-100 p-3" aria-labelledby="dropdownMenuButton2">
              <li className="d-flex justify-content-between">
                <button className="btn btn-outline-primary" onClick={() => handleSort('fecha_y_hora')}>fecha</button>
                <button className="btn btn-outline-primary" onClick={() => handleSort('localizacion_geografica.latitud')}>Ubicación</button>
                <button className="btn btn-outline-primary" onClick={() => handleSort('relevancia')}>Relevancia</button>
              </li>
            </ul>
          </div>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle w-90  ms-2" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
              Filtros
            </button>
            <ul className="dropdown-menu w-100 p-3" aria-labelledby="dropdownMenuButton">
              <li className="mb-3">
                <input
                  type="datetime-local"
                  placeholder="Fecha desde..."
                  value={searchDateFrom}
                  onChange={(e) => setSearchDateFrom(e.target.value)}
                  className="form-control"
                />
              </li>
              <li className="mb-3">
                <input
                  type="datetime-local"
                  placeholder="Fecha hasta..."
                  value={searchDateTo}
                  onChange={(e) => setSearchDateTo(e.target.value)}
                  className="form-control"
                />
              </li>
              <li className="mb-3">
                <input
                  type="text"
                  placeholder="Latitud..."
                  value={searchLatitud}
                  onChange={(e) => setSearchLatitud(e.target.value)}
                  className="form-control"
                />
              </li>
              <li className="mb-3">
                <input
                  type="text"
                  placeholder="Longitud..."
                  value={searchLongitud}
                  onChange={(e) => setSearchLongitud(e.target.value)}
                  className="form-control"
                />
              </li>
              <li className="mb-3">
                <input
                  type="text"
                  placeholder="Hábitat..."
                  value={searchHabitat}
                  onChange={(e) => setSearchHabitat(e.target.value)}
                  className="form-control"
                />
              </li>
              <li className="mb-3">
                <input
                  type="text"
                  placeholder="Clima..."
                  value={searchClima}
                  onChange={(e) => setSearchClima(e.target.value)}
                  className="form-control"
                />
              </li>
            </ul>
          </div>
          <button className="btn btn-primary  ms-2" onClick={handleSearch}>Buscar</button>
        </div>
      </div>
      <div className="bitacoras-list row">
        {filteredBitacoras.map(bitacora => (
          <div key={bitacora._id} className="bitacora-item col-12 col-sm-6 col-md-4 mb-4" onClick={() => bitacora._id && handleViewDetails(bitacora._id)}>
            <div className="card h-100">
              {bitacora.fotografias.length > 0 ? (
                <img src={bitacora.fotografias[0]} className="card-img-top" alt="Imagen de la bitácora" onError={handleImageError} 
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}/>
              ) : (
                <img src="https://capitalist.com.br/wp-content/uploads/2023/02/balsamo-scaled.jpg" className="card-img-top" alt="Imagen de reemplazo" />
              )}
              <div className="card-body">
                <h5 className="card-title">{bitacora.titulo}</h5>
                <p className="card-text"><strong>Fecha: </strong>{new Date(bitacora.fecha_y_hora).toLocaleString()}</p>
                <p style={{ marginTop: '-18px', marginBottom: '-8px' }}><strong>Localización </strong></p>
                <span className="card-text">{bitacora.localizacion_geografica.latitud}, {bitacora.localizacion_geografica.longitud}</span>
                <p className="card-text"><strong>Autor:</strong> {bitacora.autor.nombre}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="floating-button" onClick={handleAddBitacora}>
        <div className="floating-button-icon">+</div>
        <div className="floating-button-text">Agregar Bitácora</div>
      </div>
    </div>
  );
};

export default Inicio;