import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Button } from '@mui/material';
import Layout from '../layout';
import UserInformationTable from '../adminComponents/userInfo';
import UpdateDialog from './sendUpdate';
import client from '../../../../../API';
import CRMInformationTable from './crmInfo';
import EmailCRMDialog from './sendEmailCRM';
import SharedWithTable from './sharedwith';
import AddCRMDialog from './addcrmdialog'; // Import the new dialog

const MarketingView = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddCRMDialog, setOpenAddCRMDialog] = useState(false); // State for AddCRMDialog
  const [userData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState({});
  const [selectedUserData, setSelectedUserData] = useState([]);
  const [openCRMDialog, setOpenCRMDialog] = useState(false);
  const [selectedCRMContacts, setSelectedCRMContacts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await client.users.userDetails();
        const usersWithSelection = data.map((user) => ({ ...user, selected: false }));
        setUserData(usersWithSelection);
        console.log('Fetched user data:', usersWithSelection);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleOpenDialog = () => {
    const selectedData = userData.filter((user) => selectedUsers[user.id]);
    setSelectedUserData(selectedData);
    setOpenDialog(true);
    console.log('Opening update dialog with selected data:', selectedData);
  };

  const handleOpenAddCRMDialog = () => {
    setOpenAddCRMDialog(true);
  };

  const handleOpenCRMDialog = () => {
    setOpenCRMDialog(true);
    console.log('Opening CRM dialog with selected data:', selectedCRMContacts);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    console.log('Update dialog closed');
  };

  const handleCloseAddCRMDialog = () => {
    setOpenAddCRMDialog(false);
  };

  const handleCloseCRMDialog = () => {
    setOpenCRMDialog(false);
    console.log('CRM dialog closed');
  };

  const handleSelectionChange = useCallback((newSelectedUsers) => {
    setSelectedUsers(newSelectedUsers);
    console.log('User selection changed:', newSelectedUsers);
  }, []);

  const handleCRMSelectionChange = useCallback((newSelectedCRMContacts) => {
    setSelectedCRMContacts(newSelectedCRMContacts);
    console.log('CRM selection changed:', newSelectedCRMContacts);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Marketing Dashboard
      </Typography>
      <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Send Update
      </Button>
      <UserInformationTable onSelectionChange={handleSelectionChange} />
      <Typography variant="h4" gutterBottom>
        Re-Engagement Marketing
      </Typography>
      <Button variant="contained" onClick={handleOpenCRMDialog} sx={{ mb: 2 }}>
        Send Promotional
      </Button>
      <SharedWithTable onSelectionChange={handleSelectionChange} />
      <Typography variant="h4" gutterBottom>
        CRM Dashboard
      </Typography>
      <Button variant="contained" onClick={handleOpenCRMDialog} sx={{ mb: 2 }}>
        Send Email
      </Button>
      <Button variant="contained" onClick={handleOpenAddCRMDialog} sx={{ mb: 2 }}> {/* Add this button */}
        Add to CRM
      </Button>
      <CRMInformationTable onSelectionChange={handleCRMSelectionChange} />
      <UpdateDialog open={openDialog} onClose={handleCloseDialog} userData={selectedUserData} />
      <EmailCRMDialog open={openCRMDialog} onClose={handleCloseCRMDialog} userData={selectedCRMContacts} />
      <AddCRMDialog open={openAddCRMDialog} onClose={handleCloseAddCRMDialog} /> {/* Add the dialog */}
    </Box>
  );
};

export default MarketingView;
