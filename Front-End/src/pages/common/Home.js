import React, { useState, useCallback } from "react";
import Header from "../../components/Header/Header";
import MapComponent from "../../components/Map/Map";
import Listings from "../../components/Listings/Listings";
import FilterHeader from "../../components/FilterSubHeader/FilterHeader";
import LoginAlert from "../../components/Listings/LoginAlert";
import { useDisclosure } from "@chakra-ui/react"; // Import useDisclosure here
import { TypeAnimation } from 'react-type-animation';
import "./Home.css";
import { useAuth } from '../../components/AuthContext';

function Home() {
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    bedrooms: "",
    // Add more filter fields as needed
  });
  const { currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
 
  const handleLoginAlertClose = () => onClose();
  const handleLogin = () => {
    onClose();
    // Your login logic here
  };
  const [selectedHomeId, setSelectedHomeIdState] = useState(null); // Correctly defined selectedHomeId state

  const setSelectedHomeId = useCallback((id) => {
    setSelectedHomeIdState(id);
  }, []);

  const applyFilters = useCallback((filterData) => {
    setFilters(filterData);
  }, []);
  const handleLoginAlertOpen = () => {
    if (!currentUser) { // Only open if no user is logged in
      onOpen();
    }
  };
  return (
    <div className="home-container">
      <Header />
      <FilterHeader applyFilters={applyFilters} />
      <div className="content-container">
        <MapComponent 
          filters={filters} 
          setSelectedHomeId={setSelectedHomeId} 
        />
        
<Listings 
  filters={filters} 
  selectedHomeId={selectedHomeId} 
  setSelectedHomeId={setSelectedHomeId} 
  onLoginAlertOpen={handleLoginAlertOpen} // Ensure this is being passed
/>

      </div>
      <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20px',paddingBottom: '10px' }}>
      <TypeAnimation
          sequence={[
            'Proudly Engineered at the University of California Merced ♥️', 
            4000,
            'Engineered by',
            2000,
            'Christian Urbina & Luis Carillo',
            3000,
            () => {
              console.log('Sequence completed');
            },
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
          style={{ 
            fontSize: '0.7em', // Smaller font size
            fontFamily: "'Montserrat-Regular', sans-serif" // Font family
          }}
        />
      </div>
      <LoginAlert
        isOpen={!currentUser && isOpen} // Control visibility based on currentUser
        onClose={onClose}
        // onLogin={handleLogin} // Removed as this is handled in Header
      />
    </div>
  );
}

export default Home;
