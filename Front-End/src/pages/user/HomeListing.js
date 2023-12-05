import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Link, Typography, Box, Button, Collapse } from '@mui/material';
import { useAuth } from "../../components/AuthContext";

function HomeSaved() {
  const { currentUser} = useAuth();
  const userId = currentUser.user_id;  // Replace with actual logged-in user's ID
  const baseUrl = 'http://127.0.0.1:5000'; // Assuming Flask runs on port 5000
  const [error, setError] = useState('');
  const [savedHomes, setSavedHomes] = useState([]);
  const [showSavedHomes, setShowSavedHomes] = useState(false);
  useEffect(() => {
    fetchSavedHomes();
  }, [userId, baseUrl]);

  const fetchSavedHomes = () => {
    axios.get(`${baseUrl}/api/users/${userId}/saved_homes`)
      .then(response => {
        // Get detailed information for each saved home
        const homePromises = response.data.map(savedHome =>
          axios.get(`${baseUrl}/api/homes/${savedHome.home_id}`)
        );
        return Promise.all(homePromises);
      })
      .then(homeResponses => {
        // Extract the data from each home response
        const detailedSavedHomes = homeResponses.map(res => res.data);
        setSavedHomes(detailedSavedHomes);
      })
      .catch(error => {
        console.error('Failed to fetch saved homes:', error);
        setError(error.message);
      });
  };

  const deleteSavedHome = (homeId) => {
    // Replace with the actual DELETE endpoint and home ID parameter as required by your backend
    axios.delete(`${baseUrl}/api/users/${userId}/saved_homes/${homeId}`)
      .then(() => {
        // Remove the deleted home from state
        setSavedHomes(prevHomes => prevHomes.filter(home => home.id !== homeId));
      })
      .catch(error => {
        console.error('Failed to delete saved home:', error);
        setError(error.message);
      });
  };

  const toggleSavedHomes = () => {
    setShowSavedHomes(!showSavedHomes);
  };
  

  return (
    <Card>
      <CardContent>
      <Typography className="collapsible" variant="h5" component="h2" onClick={toggleSavedHomes} style={{ cursor: 'pointer' }}>
  View Saved Homes
</Typography>
        <Collapse in={showSavedHomes}>
          {savedHomes.map(home => (
            <Box key={home.id} mb={2}>
              <Typography>
                {home.address} Availability: {home.availability_status}
              </Typography>
              <Link href={`/home/${home.id}`} variant="body2">
                More Info
              </Link>
              <Button color="secondary" onClick={() => deleteSavedHome(home.id)}>
                Delete
              </Button>
            </Box>
          ))}
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default HomeSaved;
