import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const HomeViewsChart = ({ agentId }) => {
  const [homes, setHomes] = useState([]);
  const [selectedHomeId, setSelectedHomeId] = useState('');
  const [viewData, setViewData] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/agents/${agentId}/homes`)
      .then(response => setHomes(response.data))
      .catch(error => console.error("Error fetching homes:", error));
  }, [agentId]);

  useEffect(() => {
    if (selectedHomeId) {
      axios.get(`http://127.0.0.1:5000/api/homes/${selectedHomeId}/views`)
        .then(response => {
          // Transform the data to the expected format for the chart
          const formattedData = response.data.map(item => ({
            date: item.date, // Make sure this key matches the key in your response
            views: item.count // Same here
          }));
          setViewData(formattedData);
        })
        .catch(error => console.error("Error fetching views:", error));
    } else {
      // Reset viewData when no home is selected
      setViewData([]);
    }
  }, [selectedHomeId]);
  

  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          <InputLabel id="select-home-label">Select Home</InputLabel>
          <Select
            labelId="select-home-label"
            id="select-home"
            value={selectedHomeId}
            label="Select Home"
            onChange={(e) => setSelectedHomeId(e.target.value)}
          >
            {homes.map((home) => (
              <MenuItem key={home.id} value={home.id}>{home.address}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <BarChart
          width={500}
          height={300}
          data={viewData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="views" fill="#8884d8" />
        </BarChart>
      </CardContent>
    </Card>
  );
};

export default HomeViewsChart;
