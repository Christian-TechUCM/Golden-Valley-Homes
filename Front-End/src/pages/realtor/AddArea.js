import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

function AddArea() {
  const [open, setOpen] = useState(false);
  const [newArea, setNewArea] = useState({ name: '', city: '', zip_code: '', state: '' });
  const baseUrl = 'http://127.0.0.1:5000'; // Adjust the base URL as needed

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setNewArea({ ...newArea, [e.target.name]: e.target.value });
  };

  const handleAddArea = () => {
    axios.post(`${baseUrl}/api/areas`, newArea)
      .then(response => {
        console.log('Area added successfully:', response.data);
        handleClose();
      })
      .catch(error => console.error('Error adding area:', error));
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add New Area
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Area</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="name" label="Area Name" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="city" label="City" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="zip_code" label="Zip Code" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="state" label="State" fullWidth onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddArea}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddArea;
