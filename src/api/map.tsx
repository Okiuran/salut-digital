import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useLanguage } from '../idioma/preferencia-idioma.tsx';

const containerStyle = {
  width: '100%',
  height: '400px',
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

  const geocodePostalCode = async (postalCode: string) => {
    const geocoder = new google.maps.Geocoder();

    return new Promise<google.maps.LatLng>((resolve, reject) => {
      geocoder.geocode({ address: postalCode }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]?.geometry?.location) {
          resolve(results[0].geometry.location);
        } else {
          reject(
            results
              ? `Geocoding error: ${status}`
              : 'Geocoding error: No results returned'
          );
        }
      });
    });
  };

  const searchNearby = async (location: { lat: number; lng: number }) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location,
      radius: 5000,
      type: 'hospital',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setMarkers(
          results.map((place) => ({
            position: place.geometry?.location,
            name: place.name,
          }))
        );
      } else {
        console.error('Nearby search error:', status);
      }
    });
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

  return (
    <LoadScript googleMapsApiKey="AIzaSyDt5bbX4TNFbmTwIkw3v7upr41eK2ZB8so" libraries={['places']}>
      <div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder={
              language === 'es'
                ? 'Introduce el código postal'
                : 'Introdueix el codi postal'
            }
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <button onClick={handleSearch}>
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
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
