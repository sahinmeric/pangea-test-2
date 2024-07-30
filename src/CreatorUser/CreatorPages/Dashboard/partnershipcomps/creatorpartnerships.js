import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import { ConfigValue } from '../../../../Config';
import PartnershipConversationDialog from './creatorpartnershipconversationdialog';
import { useCreatorAuth } from '../../../../Hooks/creator-use-auth';

const CreatorPartnerships = ({ username }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPartnership, setCurrentPartnership] = useState(null);
  const { creatorToken } = useCreatorAuth();

  const fetchPartnerships = async () => {
    const response = await fetch(ConfigValue.PUBLIC_REST_API_ENDPOINT + `/creatorUsers/partnerships?username=${username}`, {
      headers: {
        'Authorization': `Bearer ${creatorToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched partnerships:', data);
    return data;
  };

  const { isLoading, error, data: partnerships } = useQuery(['partnerships', username], fetchPartnerships, {
    keepPreviousData: true
  });

  const handleOpenDialog = (partnership) => {
    setCurrentPartnership(partnership);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPartnership(null);
  };

  if (isLoading) return <CircularProgress sx={{ color: 'white' }} />;
  if (error) return <Typography sx={{ color: 'error' }}>Error fetching partnerships: {error.message}</Typography>;

  // Filter out partnerships with status 'DELETED'
  const filteredPartnerships = partnerships?.filter(partnership => partnership.status !== 'DELETED') || [];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        All Partnerships
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell>Partnership Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPartnerships.length > 0 ? filteredPartnerships.map(partnership => (
              <TableRow key={partnership.id} onClick={() => handleOpenDialog(partnership)}>
                <TableCell>{partnership.name}</TableCell>
                <TableCell>{partnership.description}</TableCell>
                <TableCell>{partnership.status}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No partnerships available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {currentPartnership && (
        <PartnershipConversationDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          partnership={currentPartnership}
        />
      )}
    </Box>
  );
};

export default CreatorPartnerships;
