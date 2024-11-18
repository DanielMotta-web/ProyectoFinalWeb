import { AzureMap, AzureMapsProvider, IAzureMapOptions, ControlOptions, AzureMapHtmlMarker } from 'react-azure-maps';
import { AuthenticationType } from 'azure-maps-control';

interface MapaBitacoraProps {
  longitude: number;
  latitude: number;
}

const MapaBitacora: React.FC<MapaBitacoraProps> = ({ longitude, latitude }) => {
  const option: IAzureMapOptions = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: 'AcJEZeHqb7j8R2SdpTxy2YaqmKV1C22dQHARbc3O8TncdsZNQTiuJQQJ99AKACYeBjF264gtAAAgAZMP3k09',
    },
    view: 'Auto',
    center: [longitude, latitude],
    zoom: 10,
  };

  return (
    <AzureMapsProvider>
      <div className="map-container">
        <AzureMap options={option}
          controls={[
            {
              controlName: 'ZoomControl',
              options: { position: 'top-right' } as ControlOptions,
            },
            {
              controlName: 'CompassControl',
              controlOptions: { rotationDegreesDelta: 10 },
              options: { position: 'bottom-right' } as ControlOptions,
            },
          ]}>
          <AzureMapHtmlMarker
            options={{
              color: 'DodgerBlue',
              text: '',
              position: [longitude, latitude],
            }}>
          </AzureMapHtmlMarker>
        </AzureMap>
      </div>
    </AzureMapsProvider>
  );
};

export default MapaBitacora;