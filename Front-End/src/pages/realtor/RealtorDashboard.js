import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
// ... rest of your imports ...
import { Box } from '@mui/material';

import AgentEdit from "./Edit.js";
import AgentHomes from "./Homes.js";
import AddArea from "./AddArea.js"; // Import the new component
import Chat from "./Chat.js";
import { Typography } from '@mui/material';
import RealtorHeader from './RealtorHeader.js';
import HomeListings from '../user/HomeListing.js'
import HomeViewsChart from './HomeViewsChart.js';
import { useAuth } from '../../components/AuthContext.js';
import axios from 'axios';

function AgentDashboard() {
  const { currentUser } = useAuth();
  const userId = currentUser?.user_id;
  const [agentId, setAgentId] = useState('');
  
  useEffect(() => {
    const baseUrl = 'http://127.0.0.1:5000'; // Base URL for API
    if (userId) {
      axios.get(`${baseUrl}/api/agents/user/${userId}`)
        .then(response => {
          setAgentId(response.data.id);
        })
        .catch(error => console.error("Error fetching agent ID:", error));
    }
  }, [userId]);
  
  return (
    <Box className="agent-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <RealtorHeader />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, width: '100%' }}>
      
        <AgentHomes sx={{ flex: '1 1 calc(33% - 16px)', minHeight: '200px' }} /> {/* Adjust width and height as needed */}
        
       
        <HomeListings sx={{ flex: '1 1 calc(33% - 16px)', minHeight: '200px' }} /> {/* Adjust width and height as needed */}
        {agentId && <HomeViewsChart agentId={agentId} sx={{ flex: '1 1 calc(33% - 16px)', minHeight: '200px' }} />} {/* Render only when agentId is available and adjust width and height as needed */}
        <AgentEdit sx={{ flex: '1 1 calc(33% - 16px)', minHeight: '200px' }} /> {/* Adjust width and height as needed */}
        
      </Box>
      <Chat />
    </Box>
  );
}

export default AgentDashboard;
