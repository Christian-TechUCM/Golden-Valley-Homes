import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, TextField, Typography } from '@mui/material';
import { useAuth } from "../../components/AuthContext";

function UserEdit() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState({ name: '', email: '' });
  const { currentUser} = useAuth();
  const userId = currentUser.user_id; 
  const baseUrl = 'http://127.0.0.1:5000'; // Assuming Flask runs on port 5000
  

  

  useEffect(() => {
    axios.get(`${baseUrl}/api/users/${userId}`)
      .then(response => {
        setProfile({ name: response.data.name, email: response.data.email });
        setErrorMessage('');
        setSuccessMessage('');
        console.log(currentUser.id);
      })
      .catch(error => {
        console.error('Failed to fetch user profile:', error);
        setErrorMessage('Failed to fetch profile: ' + error.message);
        setSuccessMessage('');
      });
  }, [userId, baseUrl]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    axios.put(`${baseUrl}/api/users/${userId}/edit_profile`, profile)
      .then(response => {
        console.log('Profile updated:', response.data);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);
        setErrorMessage('');
      })
      .catch(error => {
        console.error('Failed to update profile:', error);
        setErrorMessage('Failed to update profile: ' + error.message);
        setSuccessMessage('');
      });
  };

  const buttonStyle = {
    backgroundColor: '#1976d2', // Primary color
    color: 'white',
    padding: '10px 20px',
    textTransform: 'none', // If you want to keep the button text's case as is
    marginTop: '20px'
  };
  const cardStyle = {
    margin: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0', // Assuming this matches the border style of the other card
    borderRadius: '4px',
    padding: '20px'
  };

  return (
    <Card style={cardStyle}>
      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Edit Profile
      </Typography>
      <form onSubmit={handleProfileSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
          value={profile.name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={profile.email}
          onChange={handleInputChange}
          margin="normal"
        />
        <Button type="submit" style={buttonStyle}>
          Update Profile
        </Button>
      </form>
      {/* Display any success or error messages */}
      {successMessage && <Typography color="primary">{successMessage}</Typography>}
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
    </Card>
  );
}
export default UserEdit;
