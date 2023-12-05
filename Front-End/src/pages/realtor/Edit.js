import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, TextField, Typography } from '@mui/material';
import { useAuth } from "../../components/AuthContext";

function AgentEdit() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const { currentUser } = useAuth();
  const userId = currentUser.user_id;
  const [agentId, setAgentId] = useState('');
  const baseUrl = 'http://127.0.0.1:5000';

  useEffect(() => {
    axios.get(`${baseUrl}/api/agents/user/${userId}`)
      .then(response => {
        setAgentId(response.data.id);
        axios.get(`${baseUrl}/api/agents/${response.data.id}`)
          .then(response => {
            setProfile({
              name: response.data.name,
              email: response.data.email,
              phone: response.data.contact_number
            });
          })
          .catch(error => console.error('Error fetching profile:', error));
      })
      .catch(error => console.error('Error fetching agent ID:', error));
  }, [userId, baseUrl]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    axios.put(`${baseUrl}/api/agents/${agentId}/edit_profile`, profile)
      .then(response => {
        setSuccessMessage('Profile updated successfully!');
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 2000);
      })
      .catch(error => setErrorMessage('Failed to update profile: ' + error.message));
  };

  return (
    <Card sx={{ maxWidth:300,m: 1, boxShadow: 2, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Edit Profile</Typography>
      <form onSubmit={handleProfileSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
          value={profile.name}
          onChange={handleInputChange}
          size="small"
          margin="dense"
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={profile.email}
          onChange={handleInputChange}
          size="small"
          margin="dense"
        />
        <TextField
          label="Phone"
          variant="outlined"
          fullWidth
          name="phone"
          value={profile.phone}
          onChange={handleInputChange}
          size="small"
          margin="dense"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, textTransform: 'none' }}>
          Update Profile
        </Button>
        <Typography variant="body2" color={successMessage ? "primary" : "error"} sx={{ mt: 1 }}>
          {successMessage || errorMessage}
        </Typography>
      </form>
    </Card>
  );
}

export default AgentEdit;
