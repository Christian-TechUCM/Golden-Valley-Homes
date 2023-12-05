import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Collapse,
  TextField,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../components/AuthContext";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./Gcss.css";
import AddArea from "./AddArea";
function AgentHomes() {
  const { currentUser } = useAuth();
  const userId = currentUser.user_id;
  const [agentId, setAgentId] = useState("");
  const baseUrl = "http://127.0.0.1:5000";
  const [homes, setHomes] = useState([]);
  const [showHomes, setShowHomes] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState({});
  const [isAddHomeDialogOpen, setIsAddHomeDialogOpen] = useState(false);
  const [editHomeDetails, setEditHomeDetails] = useState({});
  const [newHomeDetails, setNewHomeDetails] = useState({
    address: "",
    price: 0,
    square_feet: 0,
    bedrooms: 0,
    bathrooms: 0,
    availability_status: "",
    area_id: 0,
    latitude: 0,
    longitude: 0,
    imageURL: "",
  });
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/areas`)
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch areas:", error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}/api/agents/user/${userId}`).then((response) => {
      setAgentId(response.data.id);
      console.log("agentId set:", response.data.id); // This will log the correct ID
    });
    // The empty dependency array means this effect will only run once after the component mounts
  }, []);

  useEffect(() => {
    if (agentId) {
      axios
        .get(`${baseUrl}/api/agents/${agentId}/homes`)
        .then((response) => {
          if (response.data.length === 0) {
            setError(
              "You are not representing any homes. Add a home to get started."
            );
            return;
          }

          const homePromises = response.data.map((home) =>
            axios.get(`${baseUrl}/api/homes/${home.id}`).then((homeRes) => {
              return axios
                .get(`${baseUrl}/api/homes/${home.id}/views_count`)
                .then((viewRes) => {
                  return {
                    ...homeRes.data,
                    viewCount: viewRes.data.view_count,
                  };
                });
            })
          );
          return Promise.all(homePromises);
        })
        .then((detailedHomesWithViews) => {
          setHomes(detailedHomesWithViews);
        })
        .catch((error) => {
          setError("Failed to fetch homes: " + error.message);
        });
    }
  }, [agentId, baseUrl]);

  const toggleHomes = () => {
    setShowHomes(!showHomes);
  };

  const handleAddHome = () => {
    axios
      .post(`${baseUrl}/api/homes`, newHomeDetails)
      .then((response) => {
        const newHome = response.data;
        setHomes([...homes, newHome]);
        setIsAddHomeDialogOpen(false);
        setNewHomeDetails({
          address: "",
          price: 0,
          square_feet: 0,
          bedrooms: 0,
          bathrooms: 0,
          availability_status: "",
          area_id: 0,
          latitude: 0,
          longitude: 0,
          imageURL: "",
        });

        return axios.post(`${baseUrl}/api/agent_represents_home`, {
          agent_id: agentId,
          home_id: newHome.id,
        });
      })
      .then((response) => {
        console.log("Agent home link added", response.data);
      })
      .catch((error) => {
        setError(
          "Failed to add home or link it with the agent: " + error.message
        );
      });
  };

  const handleEditHome = (homeId) => {
    const home = homes.find((h) => h.id === homeId);
    setEditHomeDetails({
      ...editHomeDetails,
      [homeId]: { ...home },
    });
    setEditMode({ ...editMode, [homeId]: true });
  };

  const handleInputChange = (homeId, field, value) => {
    setEditHomeDetails({
      ...editHomeDetails,
      [homeId]: {
        ...editHomeDetails[homeId],
        [field]: value,
      },
    });
  };

  const handleDeleteHome = (homeId) => {
    axios
      .delete(`${baseUrl}/api/homes/${homeId}`)
      .then(() => {
        setHomes((prevHomes) => prevHomes.filter((home) => home.id !== homeId));
      })
      .catch((error) => {
        setError("Failed to delete home: " + error.message);
      });
  };

  const handleSaveHome = (homeId) => {
    const homeToSave = editHomeDetails[homeId];
    console.log("Saving home:", homeToSave); // Log to verify data

    axios
      .put(`${baseUrl}/api/homes/${homeId}`, homeToSave)
      .then((response) => {
        // Update the local state with the saved home details
        setHomes(
          homes.map((home) => (home.id === homeId ? response.data : home))
        );
        setEditMode({ ...editMode, [homeId]: false });
        setEditHomeDetails((prev) => ({ ...prev, [homeId]: undefined }));
      })
      .catch((error) => {
        setError("Failed to save home: " + error.message);
      });
  };

  return (
    <Card className="outerCard">
      <CardContent>
        {/* Encapsulate the title in a div with className "titleBox" */}
        <div className="titleBox">
          <Typography
            variant="h5"
            component="h2"
            onClick={toggleHomes}
            style={{ cursor: "pointer" }}
          >
            Your Represented Homes
          </Typography>
        </div>
        <Box>
          <Collapse in={showHomes}>
            {homes.length > 0 ? (
              homes.map((home) => (
                <Box key={home.id} mb={2}>
                  <Typography variant="subtitle1">
                    Views: {home.viewCount}
                  </Typography>
                  {editMode[home.id] ? (
                    // If in edit mode, show editable fields
                    <div>
                      <TextField
                        label="Address"
                        value={editHomeDetails[home.id]?.address || ""}
                        onChange={(e) =>
                          handleInputChange(home.id, "address", e.target.value)
                        }
                      />
                      <TextField
                        label="Price"
                        value={editHomeDetails[home.id]?.price || ""}
                        onChange={(e) =>
                          handleInputChange(home.id, "price", e.target.value)
                        }
                      />
                      <TextField
                        label="Availability Status"
                        value={
                          editHomeDetails[home.id]?.availability_status || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            home.id,
                            "availability_status",
                            e.target.value
                          )
                        }
                      />
                      <TextField
                        label="Sq Ft"
                        value={editHomeDetails[home.id]?.square_feet || ""}
                        onChange={(e) =>
                          handleInputChange(
                            home.id,
                            "square_feet",
                            e.target.value
                          )
                        }
                      />
                      <TextField
                        label="Bedrooms"
                        value={editHomeDetails[home.id]?.bedrooms || ""}
                        onChange={(e) =>
                          handleInputChange(home.id, "bedrooms", e.target.value)
                        }
                      />
                      <TextField
                        label="Bathrooms"
                        value={editHomeDetails[home.id]?.bathrooms || ""}
                        onChange={(e) =>
                          handleInputChange(
                            home.id,
                            "bathrooms",
                            e.target.value
                          )
                        }
                      />
                      <TextField
                        label="Image URL"
                        value={editHomeDetails[home.id]?.imageURL || ""}
                        onChange={(e) =>
                          handleInputChange(home.id, "imageURL", e.target.value)
                        }
                      />

                      <Button
                        color="primary"
                        onClick={() => handleSaveHome(home.id)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    // If not in edit mode, show home details and edit/delete buttons
                    <div>
                      <Typography>
                        {home.address} - {home.availability_status}
                      </Typography>
                      <Button
                        color="primary"
                        onClick={() => handleEditHome(home.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => handleDeleteHome(home.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Box>
              ))
            ) : (
              <Typography>
                No homes are being represented. Add a new home.
              </Typography>
            )}
          </Collapse>
          {error && <Typography color="error">{error}</Typography>}
          <>
            <Box display="flex" alignItems="center">
              {/* Add Home Button */}
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddHomeDialogOpen(true)}
                className="addButton"
              >
                Add New Home
              </Button>

              {/* Add Area Component */}
              <AddArea />
            </Box>
            {/* Add Home Dialog */}
            <Dialog
              open={isAddHomeDialogOpen}
              onClose={() => setIsAddHomeDialogOpen(false)}
            >
              <DialogTitle>Add New Home</DialogTitle>
              <DialogContent>
                {/* Form fields for new home details */}
                <TextField
                  label="Address"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      address: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Price"
                  type="number"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      price: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Sq Ft"
                  type="number"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      square_feet: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Bedrooms"
                  type="number"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      bedrooms: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Bathrooms"
                  type="number"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      bathrooms: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Availability Status"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      availability_status: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Latitude"
                  type="real"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      latitude: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Longitude"
                  type="real"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      longitude: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Image URL"
                  type="real"
                  onChange={(e) =>
                    setNewHomeDetails({
                      ...newHomeDetails,
                      imageURL: e.target.value,
                    })
                  }
                />
                <FormControl
                  variant="outlined"
                  size="small"
                  margin="normal"
                  fullWidth
                >
                  <InputLabel id="area-id-label">Area</InputLabel>
                  <Select
                    labelId="area-id-label"
                    id="area-id-select"
                    label="Area"
                    value={newHomeDetails.area_id}
                    onChange={(e) =>
                      setNewHomeDetails({
                        ...newHomeDetails,
                        area_id: e.target.value,
                      })
                    }
                  >
                    {areas.map((area) => (
                      <MenuItem key={area.id} value={area.id}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => setIsAddHomeDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddHome}>Add</Button>
              </DialogActions>
            </Dialog>
          </>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AgentHomes;
