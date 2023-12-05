import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import './Map.css';

function MapComponent({ filters, setSelectedHomeId }) { // Accept setSelectedHomeId prop
  const [homes, setHomes] = useState([]);
  const [selectedHome, setSelectedHome] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    fetchHomes();
    if (filters.city) {
      updateMapCenterToCity(filters.city);
    } else {
      requestUserLocation();
    }
  }, [filters]);

  const updateMapCenterToCity = async (city) => {
    const cityCoordinates = await getCityCoordinates(city);
    if (cityCoordinates) {
      setMapCenter(cityCoordinates);
      setMapKey(Date.now()); // Update the map key to force re-render
    }
  };

  const fetchHomes = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`http://localhost:5000/api/homes?${queryParams}`);
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0) {
        setHomes(data);
        setMapCenter({ lat: data[0].latitude, lng: data[0].longitude });
      } else {
        setHomes([]);
        if (!filters.city) {
          requestUserLocation();
        }
      }
    } catch (error) {
      console.error('Error fetching homes:', error);
    }
  };
  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching the user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

const getCityCoordinates = async (city) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${googleMapsApiKey}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      return null;
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      return null;
    }
  };
  const handleMarkerClick = (home) => {
    setSelectedHome(home); // Update local state for selected home
    setSelectedHomeId(home.id); // Update the selectedHomeId in the parent component
  };

  const handleInfoWindowClose = () => {
    setSelectedHome(null);
    setSelectedHomeId(null); // Reset the selectedHomeId in the parent component
  };
// Define a CSS class for the custom info window styling
const infoWindowStyles = {
  backgroundColor: '#ffffff', // a clean white background
  borderRadius: '8px', // slightly rounded corners for a softer look
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.18)', // a subtle shadow for depth
  padding: '15px', // more padding for a better content layout
  maxWidth: '200px', // Set a maximum width for the info window content
  fontFamily: "'Montserrat-Regular', sans-serif", // Use Montserrat as the base font
  color: '#333', // use a dark gray for text for better readability
  fontSize: '14px', // slightly larger font size for readability
  lineHeight: '1.4', // line height for better text flow
  overflow: 'hidden', // hide overflow
  textAlign: 'center', // align text to the left
};

 // Keep the width and height as per your requirement
 const width = 55; // width of the SVG
 const height = 30; // height of the SVG without the triangle
 const pointSize = 7; // size of the triangle
 const fillColor = '#007bff'; // fill color for the marker
const createCustomMarkerIcon = (price) => {
 
  
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + pointSize}" viewBox="0 0 ${width} ${height + pointSize}">
      <!-- Bubble rectangle -->
      <rect x="0" y="0" width="${width}" height="${height}" rx="20" ry="20" fill="${fillColor}" />
      <!-- Downward-pointing triangle -->
      <path d="M${width / 2 - pointSize / 2} ${height} l${pointSize / 2} ${pointSize} l${pointSize / 2} -${pointSize} z" fill="${fillColor}" />
      <!-- Price text -->
      <text x="${width / 2}" y="${height / 2 + 5}" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">
        $${Math.round(price / 1000)}K
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};




return (
  <div className="map-container">
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <Map 
        className="map-element" 
        center={mapCenter} 
        zoom={13} 
        key={mapKey} // Use the mapKey here to force re-render when the map center changes
      >
        {homes.map((home) => (
          <Marker
            key={home.id}
            position={{ lat: home.latitude, lng: home.longitude }}
            onClick={() => handleMarkerClick(home)}
            icon={{
              url: createCustomMarkerIcon(home.price),
              anchor: { x: width / 2, y: height + (pointSize / 2) } // Adjust anchor point to the tip of the triangle
            }}
          />
        ))}

        {selectedHome && (
          <InfoWindow
            position={{ lat: selectedHome.latitude, lng: selectedHome.longitude }}
            onCloseClick={handleInfoWindowClose}
          >
            <div style={infoWindowStyles}>
              <h2>{selectedHome.address}</h2>
              <p>Status: {selectedHome.availability_status}</p>
              <p>Price: ${selectedHome.price}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  </div>
);


}

export default React.memo(MapComponent);
