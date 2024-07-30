import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Button, Toolbar, Typography, Box, Paper, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CRMDialog from '../../Misc/crmComponents/crmPopup';
import styles from "./styles.module.css";
import BlitzHeader from '../../../Components/BlitzHeader';

const TempCreatorPage = () => {
  const { creatorId } = useParams();
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCRMDialog, setShowCRMDialog] = useState(true);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    const fetchCreatorDetails = async () => {
      try {
        const response = await fetch(`https://blitz-backend-nine.vercel.app/api/crm/creator/${creatorId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCreatorDetails(data);
        setIsLoading(false);
        calculateRates(data);
      } catch (error) {
        console.error("Failed to fetch creator details:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchCreatorDetails();
  }, [creatorId]);

  const calculateRates = (data) => {
    const link = data.link;
    let multiplier = 0;
    let platform = '';

    if (link.includes('instagram')) {
      multiplier = 0.01;
      platform = 'Instagram';
    } else if (link.includes('tiktok')) {
      multiplier = 0.008;
      platform = 'TikTok';
    } else if (link.includes('youtube')) {
      multiplier = 0.012;
      platform = 'YouTube';
    }

    const newRates = [
      { platform: 'Instagram', rate: data.following * 0.01 },
      { platform: 'TikTok', rate: data.following * 0.008 },
      { platform: 'YouTube', rate: data.following * 0.012 }
    ];

    setRates(newRates.filter(rate => rate.platform === platform));
  };

  if (isLoading) return 'Loading creator details';
  if (error || !creatorDetails) return 'No creator details found';

  const handleCloseCRMDialog = () => {
    setShowCRMDialog(false);
  };

  return (
    <>
      <BlitzHeader />
      <Box className={styles.main}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3}}>
          <Box className={styles.profile} component='section'>
            <Box>
              <Typography variant='h5' className='title'>@{creatorDetails.username}</Typography>
              {creatorDetails.status === 'verified' && (
                <Typography variant="body1" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  This creator is verified <CheckCircleIcon sx={{ ml: 1, color: 'green' }} />
                </Typography>
              )}
            </Box>
            <Box className={styles.infoContainer}>
              <p className={styles.info}>Link: <i><a href={creatorDetails.link}>{creatorDetails.link}</a></i></p>
              <p className={styles.info}>Following: <i>{creatorDetails.following}</i></p>
              <p className={styles.info}>Likes: <i>{creatorDetails.likes}</i></p>
              <p className={styles.info}>Average Views: <i>{creatorDetails.avg_views}</i></p>
              <p className={styles.info}>Email: <i>{creatorDetails.email}</i></p>
            </Box>
            <Box className={styles.ratesContainer} sx={{ mt: 3 }}>
          <Typography variant="h6">Suggested Rate</Typography>
          {rates.map((rate) => (
            <Box key={rate.platform} sx={{ mt: 2 }}>
              <Typography variant="body1">{rate.platform}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ width: 50 }}>${(rate.rate * 0.8).toFixed(2)}</Typography>
                <LinearProgress variant="determinate" value={(rate.rate * 0.8)} sx={{ flex: 1, mx: 2 }} />
                <Typography variant="body2" sx={{ width: 50 }}>${rate.rate.toFixed(2)}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
          </Box>
        </Box>
        
        
      </Box>
    </>
  );
};

export default TempCreatorPage;
