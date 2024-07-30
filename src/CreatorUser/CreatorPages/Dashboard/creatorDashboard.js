import React from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Button, Grid } from '@mui/material';
import { useQuery } from 'react-query';
import { ConfigValue } from '../../../Config';

const CreatorDashboard = ({ username, setActiveComponent }) => {
  const fetchPayouts = async () => {
    const response = await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/creatorUsers/payouts_by_creator?username=${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const fetchCampaigns = async () => {
    const response = await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/creatorUsers/campaigns_by_creator?username=${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { isLoading: isLoadingPayouts, error: errorPayouts, data: payouts } = useQuery(['payouts', username], fetchPayouts, {
    keepPreviousData: true
  });

  const { isLoading: isLoadingCampaigns, error: errorCampaigns, data: campaigns } = useQuery(['campaigns', username], fetchCampaigns, {
    keepPreviousData: true
  });

  if (isLoadingPayouts || isLoadingCampaigns) return <CircularProgress sx={{ color: 'white' }} />;
  if (errorPayouts) return <Typography sx={{ color: 'error' }}>Error fetching payouts: {errorPayouts.message}</Typography>;
  if (errorCampaigns) return <Typography sx={{ color: 'error' }}>Error fetching campaigns: {errorCampaigns.message}</Typography>;

  const totalPayouts = payouts?.reduce((sum, payout) => sum + payout.amount, 0) || 0;
  const campaignCount = campaigns?.length || 0;

  const campaignStatusCounts = campaigns?.reduce((acc, campaign) => {
    acc[campaign.status] = (acc[campaign.status] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <Box sx={{ p: 2}}>
      <Typography variant="h6" gutterBottom>
        Dashboard Summary
      </Typography>
      <Typography variant="body1">
        Total Payout Amount: ${totalPayouts.toFixed(2)}
      </Typography>
      <Typography variant="body1">
        Total Number of Campaigns: {campaignCount}
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Campaign Status
        </Typography>
        {Object.entries(campaignStatusCounts).map(([status, count]) => (
          <Typography key={status} variant="body2">
            Total {status.charAt(0).toUpperCase() + status.slice(1)} Campaigns: {count}
          </Typography>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Payout Status
        </Typography>
        {payouts.map((payout) => (
          <Typography key={payout.id} variant="body2">
            {payout.description}: ${payout.amount.toFixed(2)} - {payout.status}
          </Typography>
        ))}
      </Box>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        {[
          { title: 'Payouts', component: 'Payouts Invoicing' },
          { title: 'Campaigns', component: 'Campaigns' },
          { title: 'Partnerships', component: 'Partnerships' },
          { title: 'Pitch', component: 'Pitch' },
          { title: 'Mediakit', component: 'Edit' }
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="body2">Learn more about {card.title.toLowerCase()}.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => setActiveComponent(card.component)}>
                  Go to {card.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CreatorDashboard;
