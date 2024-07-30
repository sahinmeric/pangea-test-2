import React from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from "../styles.module.css";

const CreatorHeader = ({ creatorDetails, setBookingDialogOpen, creatorInfo }) => {
  return (
    <Box className={styles.creatorHeader} sx={{ padding: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <img src={creatorDetails.pfphref} alt={creatorDetails.creator} className={styles.creatorImage} style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
        <Box sx={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4">@{creatorDetails.creator}</Typography>
          {creatorDetails.isVerified && (
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
              This creator is verified <CheckCircleIcon sx={{ marginLeft: '8px', color: 'green' }} />
            </Typography>
          )}
          <Typography variant="body2" sx={{ marginTop: '10px' }}>
            {creatorDetails.notes_content_style}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: 2, width: '100%' }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 2, width: '100%' }}>
            <CardContent>
              <Typography variant="h6">Creator Information</Typography>
              <Box className={styles.infoContainer} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, marginTop: '10px' }}>
                {creatorInfo && creatorInfo.map((creator) => (
                  <Typography key={creator.name} className={styles.info}>
                    {creator.name}: <i>{creator.link ? <Chip label={creator.value} component="a" href={creator.link} clickable style={{ backgroundColor: '#1976d2', color: 'white' }} /> : creator.value}</i>
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ padding: 2, width: '100%' }}>
            <CardContent>
              <Typography variant="h6">Region & Primary Market</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 2, marginTop: '10px' }}>
                <Chip label={`Region: ${creatorDetails.region}`} style={{ backgroundColor: '#1976d2', color: 'white' }} />
                <Chip label={`Primary Market: ${creatorDetails.primary_market}`} style={{ backgroundColor: '#1976d2', color: 'white' }} />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ padding: 2, width: '100%' }}>
            <CardContent>
              <Typography variant="h6">Book Me</Typography>
              <Typography variant="body2" sx={{ marginTop: '10px' }}>
                Learn how to book this creator for your next campaign. Click the "Book Me" button to start the booking process.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => setBookingDialogOpen(true)} sx={{ marginTop: '20px' }}>
                Book Me
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatorHeader;