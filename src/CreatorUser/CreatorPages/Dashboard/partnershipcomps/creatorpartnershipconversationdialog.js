import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import { useQuery } from 'react-query';
import { ConfigValue } from '../../../../Config';
import CreatorConversation from './pconvo';
import { useCreatorAuth } from '../../../../Hooks/creator-use-auth';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PartnershipConversationDialog = ({
  openDialog,
  handleCloseDialog,
  partnership,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="xl"
      fullWidth
    >
      <>
        <DialogTitle>
          <Grid container alignItems='center' spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h6'>Partnership Name: {partnership.name}</Typography>
              <Typography variant='h6'>Status: {partnership.status}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Tabs
                value={tabIndex}
                onChange={handleChangeTab}
                aria-label='partnership details tabs'
              >
                <Tab label='Overview' />
                <Tab label='Conversations' />
              </Tabs>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <TabPanel value={tabIndex} index={0}>
            <Typography variant='body1'>
              <strong>Description:</strong> {partnership.description}
            </Typography>
            <Typography variant='body1'>
              <strong>Email:</strong> {partnership.email}
            </Typography>
            <Typography variant='body1'>
              <strong>Proposal Date:</strong> {new Date(partnership.proposal_date).toLocaleDateString()}
            </Typography>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <CreatorConversation partnershipId={partnership.id} />
          </TabPanel>
        </DialogContent>
      </>

      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartnershipConversationDialog;
