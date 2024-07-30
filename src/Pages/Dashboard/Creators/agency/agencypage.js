import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import NavBar from './agencynavbar';  // Corrected import path for NavBar
import blitzLogo from "../../../../Components/globalAssets/platty.png";
import { API_ENDPOINTS } from '../../../../API/endpoints';
import { drawerWidth } from "../../../../Utils/constants";
import { StyleContent } from '../../../../Utils/ThemedStyles';

const AgencyCreatorRoster = () => {
  const { manager } = useParams();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch(`https://blitz-backend-nine.vercel.app/api${API_ENDPOINTS.CREATORS_MANAGER}${manager}`);
        const data = await response.json();
        console.log(response);
        console.log(data);
        setCreators(data.creators || []);
      } catch (err) {
        console.error('Failed to fetch creators:', err);
        setError('Failed to load data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (manager) {
      fetchCreators();
    }
  }, [manager]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <NavBar />

      <Grid container sx={StyleContent} spacing={4}>
        <Typography gutterBottom variant="h3" >AGENCY ROSTER PRESENTED BY {manager}</Typography>
        {creators.map((creator) => (
          <Grid item xs={12} sm={6} md={4} key={creator.creator}>
            <Card sx={(theme) => ({
              maxWidth: 345,
              margin: theme.spacing(2),
            })}>
              <CardMedia
                sx={{height: 200}}
                image={creator.pfphref || blitzLogo}
                title={`${creator.creator}'s profile image`}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {creator.creator}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Platform: {creator.tiktok_following}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Followers: {creator.tiktok}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  <a href={creator.platform_link} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AgencyCreatorRoster;
