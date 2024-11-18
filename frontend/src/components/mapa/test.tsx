import React, { useState } from 'react';
import MapaBitacora from './mapa';

const Test: React.FC = () => {
  const [longitude, setLongitude] = useState(-74.006);
  const [latitude, setLatitude] = useState(1.7128);
  const [mapKey, setMapKey] = useState(0);

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(parseFloat(e.target.value));
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(parseFloat(e.target.value));
  };

  const handleSearchClick = () => {
    setMapKey(prevKey => prevKey + 1); // Cambia la clave del mapa para forzar la actualización
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude);
          setLatitude(position.coords.latitude);
          setMapKey(prevKey => prevKey + 1); // Forzar la actualización del mapa
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
    <div className="container mt-2 mb-2">
      <h1 className="mb-4">Prueba del Mapa de la Bitácora</h1>
      <div className="mb-4">
        <h2>Mapa de la Bitácora</h2>
        <div className="mb-2">
          <label>
            Longitud:
            <input type="number" value={longitude} onChange={handleLongitudeChange} />
          </label>
          <label>
            Latitud:
            <input type="number" value={latitude} onChange={handleLatitudeChange} />
          </label>
          <button onClick={handleSearchClick}>Buscar</button>
          <button onClick={handleGetCurrentLocation}>Usar mi ubicación actual</button>
        </div>
        <MapaBitacora key={mapKey} longitude={longitude} latitude={latitude} />
      </div>
    </div>
  );
};

export default Test;