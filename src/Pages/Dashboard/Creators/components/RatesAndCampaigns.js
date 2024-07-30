import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import styles from "../styles.module.css";

const getRandomCampaigns = (campaigns, count) => {
  const shuffled = [...campaigns].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const RatesAndCampaigns = ({ promotionData, maxValue, campaigns }) => {
  const randomCampaigns = getRandomCampaigns(campaigns.filter(campaign => campaign.status === 'Completed'), 5);

  return (
    <Box className={styles.ratesAndCampaigns} sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box className={styles.promotionRatesContainer} sx={{ width: '100%' }}>
            <Typography className={styles.title} variant="h5">Promotion Rates ($)</Typography>
            <Box className={styles.promotionRates} sx={{ width: '100%' }}>
              {promotionData.map((data) => (
                <Card key={data.name} className={styles.promotionRatesData} sx={{ margin: '1rem 0', padding: '1rem', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Typography variant='h6' style={{ marginBlock: '0.125rem' }}>{data.name}</Typography>
                    <progress className='bar' id='file' max={maxValue} value={data.highest.value} style={{ width: '100%' }} />
                    <Typography variant='body2'>{data.lowest.name} ${data.lowest.value.toFixed(2)} - {data.highest.name} ${data.highest.value.toFixed(2)}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className={styles.actionCards} sx={{ width: '100%' }}>
            <Typography variant='h5'>Completed Campaigns</Typography>
            {randomCampaigns.map(campaign => (
              <Card key={campaign.id} className={styles.card} sx={{ margin: '1rem 0', padding: '1rem', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant='h6'>{campaign.name}</Typography>
                  <Typography variant='body2'>Status: {campaign.status}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RatesAndCampaigns;
