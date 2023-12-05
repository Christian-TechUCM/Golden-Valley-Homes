import React from 'react';
import Grid from '@mui/material/Grid';
import Chat from "./Chat.js";
import HomeSaved from "./HomeListing.js";
import UserEdit from "./EditUser.js";
import UserHeader from './UserHeader.js';
import './dash.css';

function Home() {
  return (
    <div className="home-container">
      <UserHeader />
    
      <Grid container spacing={3}> {/* This is where you can adjust the spacing */}
        <Grid item xs={12} sm={6} lg={4}>
          <UserEdit />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} style={{ marginTop: '20px' }}>
          <HomeSaved />
        </Grid>
        <Grid item xs={12} sm={6} lg={4} style={{ marginTop: '20px' }}>
  <Chat />
</Grid>
      </Grid>
    </div> 
  );
}


export default Home;
