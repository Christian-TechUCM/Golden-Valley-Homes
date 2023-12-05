import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Listings.css";
import { Skeleton } from '@chakra-ui/react';
import LoginAlert from './LoginAlert';
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../components/AuthContext';
function Listings({ filters, selectedHomeId, setSelectedHomeId, onLoginAlertOpen }) { // Add onLoginAlertOpen her
  const [properties, setProperties] = useState([]);
  const [imageLoaded, setImageLoaded] = useState({});
  const [statusMessage, setStatusMessage] = useState(""); // State for status messages
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const cancelRef = useRef(); // We will pass this to the LoginAlert component
  const { currentUser } = useAuth();

  // Replace the following line with your actual authentication logic
  const isLoggedIn = false; // Placeholder for authentication logic
 
  const fetchProperties = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/homes", {
        params: filters,
      });

      if (Array.isArray(response.data)) {
        setProperties(response.data);
        setStatusMessage(""); // Reset message when valid data is received
      } else {
        console.error("API did not return an array. Response:", response.data);
        setProperties([]); // Set properties to an empty array if response is not an array
        if (response.data.message && filters.city) {
          // Use the city from the filters in the message
          setStatusMessage(`No homes found in ${filters.city}`);
        } else {
          setStatusMessage("No properties found"); // Default message
        }
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
      setStatusMessage("Error fetching properties"); // Set error message
    }
  };

  useEffect(() => {
    fetchProperties(); // Fetch properties when component mounts and when filters change
  }, [filters]);

  useEffect(() => {
    if (selectedHomeId) {
      setProperties((prevProperties) => {
        const selectedProperty = prevProperties.find(p => p.id === selectedHomeId);
        const otherProperties = prevProperties.filter(p => p.id !== selectedHomeId);
        return [selectedProperty, ...otherProperties];
      });
    }
  }, [selectedHomeId]);

  const handleImageLoaded = (propertyId) => {
    setImageLoaded(prevState => ({ ...prevState, [propertyId]: true }));
  };
  
  const handleLogin = () => {
    onClose(); // Close the dialog first
    navigate('/login'); // Then navigate to the login page
  };
  const handleLearnMore = async (propertyId) => {
    if (!currentUser) { // Check if the user is logged in
      onLoginAlertOpen(); // Open login alert if not logged in
    } else {
      // Record the view in the database
      try {
        await axios.post('http://127.0.0.1:5000/api/record_view', {
          user_id: currentUser.user_id,
          home_id: propertyId
        });
      } catch (error) {
        console.error('Error recording view:', error);
      }

      navigate(`/home/${propertyId}`); // Navigate to home-info page if logged in
    }
  };
  return (
    <div className="listings-container">
      {properties.map((property) => (
        <div key={property.id} className={`property ${property.id === selectedHomeId ? 'highlighted' : ''}`}>
          <div className="home-image-wrapper">
            {!imageLoaded[property.id] ? (
              <Skeleton height="200px" width="100%" fadeDuration={0.6} startColor="#ddd" endColor="#eee" />
            ) : null}
            <img
              src={property.imageURL}
              alt="House"
              className={`home-image ${!imageLoaded[property.id] ? 'hidden' : ''}`}
              onLoad={() => handleImageLoaded(property.id)}
              style={{ display: imageLoaded[property.id] ? 'block' : 'none' }}
            />
          </div>
          <div className="property-details">
            <h2 className="price">${property.price.toLocaleString()}</h2>
            <div className="property-meta">
              <span>{property.bedrooms} bd</span> |
              <span>{property.bathrooms} ba</span> |
              <span>{property.square_feet} sqft</span>
            </div>
            <p className="address">{property.address}</p>
            <button className="learn-more-button" onClick={() => handleLearnMore(property.id)}>
              Learn More
            </button>
          </div>
        </div>
      ))}
      {properties.length === 0 && <p>{statusMessage}</p>}
      
      <LoginAlert
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default Listings;
