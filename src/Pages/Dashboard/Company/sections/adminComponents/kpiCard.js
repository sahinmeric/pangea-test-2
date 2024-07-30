import React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';

const KpiCard = ({ title, goal, progress }) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, margin: 2, width: '30%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1">
        Goal: {goal}
      </Typography>
      <Typography variant="body1">
        Progress: {progress}
      </Typography>
      <LinearProgress variant="determinate" value={(progress / goal) * 100} />
    </Paper>
  );
};

export default KpiCard;
