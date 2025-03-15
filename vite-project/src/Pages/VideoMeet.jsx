import React, { useContext } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { SocketContext } from './SocketContext.jsx';

const VideoMeet = () => {
  const { myVideo, userVideo } = useContext(SocketContext);
  

  return (
    <Grid container justifyContent="center" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
      <Paper sx={{ padding: 2, border: '2px solid black', margin: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            Name
          </Typography>
          <video playsInline muted ref={myVideo} autoPlay sx={{ width: { xs: '300px', md: '550px' } }} />
        </Grid>
      </Paper>

      <Paper sx={{ padding: 2, border: '2px solid black', margin: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            User Name
          </Typography>
         
          <video playsInline ref={userVideo} autoPlay sx={{ width: { xs: '300px', md: '550px' } }} />
        </Grid>
      </Paper>
    </Grid>
  );
};

export default VideoMeet;
