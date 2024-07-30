import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { useQuery } from 'react-query';
import CreatorCampaignDialog from './creatorcomponents/creatorcampaigndialog';
import { ConfigValue } from '../../../Config';

const CreatorCampaigns = ({ username }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(-1);

  const handleOpenDialog = (campaign) => {
    setCurrentCampaign(campaign);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchCampaigns = async () => {
    const response = await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/creatorUsers/campaigns_by_creator?username=${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { isLoading, error, data: campaigns } = useQuery(['campaigns', username], fetchCampaigns, {
    keepPreviousData: true
  });

  if (isLoading) return <CircularProgress sx={{ color: 'white' }} />;
  if (error) return <Typography sx={{ color: 'error' }}>Error fetching campaigns: {error.message}</Typography>;

  const getOffer = (campaign, username) => {
    const creators = campaign.creators;
    if (!creators || creators.length === 0) return 'N/A';
    const creator = creators.find(c => c.id === username); // Find the creator by username
    if (!creator) return 'N/A';
    const agencyRate = parseFloat(creator.agencyRate);
    const price = parseFloat(creator.price);
    return agencyRate ? `$${agencyRate.toFixed(2)}` : price ? `$${price.toFixed(2)}` : 'N/A';
  };

  const filteredCampaigns = campaigns ? campaigns.filter(campaign => campaign.status === 'Launched' || campaign.status === 'Completed') : [];

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          All Campaigns
        </Typography>
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{ minWidth: 300 }}>
            <TableHead>
              <TableRow>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Offer</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCampaigns && filteredCampaigns.length > 0 ? filteredCampaigns.map(campaign => (
                <TableRow key={campaign.id}>
                  <TableCell onClick={() => { handleOpenDialog(campaign.id) }}>{campaign.name}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>{getOffer(campaign, username)}</TableCell>
                  <TableCell>
                    <Button onClick={() => {/* handle share */}}>
                      <ShareIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No campaigns available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <CreatorCampaignDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} campaignId={currentCampaign} />
    </div>
  );
};

export default CreatorCampaigns;
