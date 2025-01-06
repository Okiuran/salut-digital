import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useLanguage } from '../idioma/preferencia-idioma.tsx';
import '../map.css';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 40.416775,
  lng: -3.70379,
};

const MapComponent: React.FC = () => {
  const { language } = useLanguage();
  const [markers, setMarkers] = useState<any[]>([]);
  const [postalCode, setPostalCode] = useState('');
  const [mapCenter, setMapCenter] = useState(center);
  const [selectedMarker, setSelectedMarker] = useState<any>(null); // Marcador seleccionado

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDt5bbX4TNFbmTwIkw3v7upr41eK2ZB8so',
    libraries: ['places'],
  });

  const geocodePostalCode = async (postalCode: string) => {
    const geocoder = new google.maps.Geocoder();
    return new Promise<google.maps.LatLng>((resolve, reject) => {
      geocoder.geocode(
        {
          address: postalCode,
          componentRestrictions: { country: 'ES' },
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results && results[0]?.geometry?.location) {
            resolve(results[0].geometry.location);
          } else {
            reject(
              results
                ? `Geocoding error: ${status}`
                : 'Geocoding error: No results returned'
            );
          }
        }
      );
    });
  };

  const searchNearby = async (location: { lat: number; lng: number }) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const types = ['hospital', 'doctor', 'clinic'];
    const results: any[] = [];

    for (const type of types) {
      const request = {
        location,
        radius: 5000,
        type,
      };

      await new Promise<void>((resolve) => {
        service.nearbySearch(request, (places, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && places) {
            results.push(
              ...places
                .map((place) => ({
                  position: place.geometry?.location,
                  name: place.name,
                  address: place.vicinity,
                  types: place.types,
                }))
                .filter((place) => {
                  const relevantKeywords = ['hospital', 'clinic', 'doctor'];
                  return (
                    relevantKeywords.some((keyword) =>
                      place.types?.includes(keyword)
                    ) || relevantKeywords.some((keyword) =>
                      place.name.toLowerCase().includes(keyword)
                    )
                  );
                })
            );
          } else {
            console.error(`Error buscando con tipo ${type}:`, status);
          }
          resolve();
        });
      });
    }

    setMarkers(results);
  };

  const handleSearch = async () => {
    try {
      const location = await geocodePostalCode(postalCode);
      const newCenter = { lat: location.lat(), lng: location.lng() };
      setMapCenter(newCenter);
      searchNearby(newCenter);
    } catch (error) {
      console.error(error);
    }
  };

  return isLoaded ? (
    <div>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder={
            language === 'es'
              ? 'Introduce el código postal'
              : 'Introdueix el codi postal'
          }
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          {language === 'es' ? 'Buscar' : 'Cercar'}
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.name}
            onClick={() => setSelectedMarker(marker)} // Seleccionar marcador
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)} // Cerrar ventana
          >
            <div>
              <h3>{selectedMarker.name}</h3>
              <p>{language === 'es' ? 'Dirección:' : 'Adreça:'} {selectedMarker.address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <div>{language === 'es' ? 'Cargando mapa...' : 'Carregant mapa...'}</div>
  );
};

export default MapComponent;
