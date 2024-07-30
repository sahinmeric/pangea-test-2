import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../../API';
import { useMutation } from 'react-query';
import routes from '../../../Config/routes';
import SearchFilterSection from '../Search/leftColumnSearch';
import CampaignDetailsUI from './campaigndetailsUI';
import {
  Button,
  Divider,
  Paper,
  Drawer,
  Box,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  overflowY: "auto",
  padding: theme.spacing(0.9),
}));

const paperStyle = (theme) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
});

const classes = {
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    overflow: "hidden",
  },
  drawer: {
    width: '25vw',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '25vw',
    resize: "horizontal",
    overflow: "auto",
  },
};

const AddCreators = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectedCreatorsData, setSelectedCreatorsData] = useState([]);

  const { mutate: fetchCampaignDetails } = useMutation(client.campaigns.fetch, {
    onSuccess: (data) => {
      data.creators = JSON.parse(data.creators);
      setCampaignDetails(data);
    },
    onError: (error) => {
      if (error.response && error.response.data)
        alert(`Error fetching campaign: ${error.response.data.error}`);
      else alert(`Error fetching campaign: ${error.message}`);
    },
  });

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails(campaignId);
    }
  }, [campaignId]);

  const handleCreatorSelect = (creatorId, creatorData) => {
    setSelectedCreatorsData((prevCreators) => {
      const exists = prevCreators.some((creator) => creator.id === creatorId);
      if (exists) {
        return prevCreators.filter((creator) => creator.id !== creatorId);
      } else {
        return [...prevCreators, creatorData];
      }
    });
  };

  const { mutate: updateCreatorList } = useMutation(client.campaigns.updateCreatorList, {
    onSuccess: (data) => {
      console.log('Successfully updated campaign creators:', data);

      // Optionally, navigate to another route upon success
      navigate(routes.campaigns);
    },
    onError: (error) => {
      console.error('Error updating campaign creators:', error);
    },
  });

  const handleConfirmCreatorChanges = async () => {
    const newCreators = selectedCreatorsData.map((creator) => ({
      id: creator.id,
      name: creator.name,
      price: creator.price,
      following: creator.following,
      promotionPlatform: creator.promotionPlatform,
      promotionType: creator.promotionType,
      platformLink: creator.platformLink,
      pfphref: creator.pfphref
    }));

    const payload = {
      campaignId: parseInt(campaignId),
      newCreators: newCreators,
    };

    updateCreatorList(payload);
  };

  return (
    <>
      <Box sx={classes.root}>
        <Grid container>
          <Grid item xs={8.5}>
            <ContentBox>
              <SearchFilterSection onCreatorSelect={handleCreatorSelect} selectedItems={selectedItems} />
            </ContentBox>
          </Grid>
          <Grid item xs={5}>
            <Drawer
              sx={classes.drawer}
              variant="persistent"
              anchor="right"
              open={true}
              PaperProps={{
                sx: classes.drawerPaper,
              }}
            >
              <Paper sx={paperStyle} elevation={3}>
                <CampaignDetailsUI
                  campaignDetails={campaignDetails}
                  newCreators={selectedCreatorsData}
                />
                <Divider sx={{ margin: "20px 0" }} />

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleConfirmCreatorChanges}
                >
                  Confirm Creator Changes
                </Button>
              </Paper>
            </Drawer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AddCreators;
