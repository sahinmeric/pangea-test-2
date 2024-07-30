import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, TextField, FormControl, Paper, InputLabel, Select, MenuItem, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TablePagination,
  Link
} from '@mui/material';
import { StyleButton, StyleContent, StyleStickyButtonContainter } from '../../../Utils/ThemedStyles';
import API from '../../../API';

const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'outlook.com'];

const isFreeEmail = (email) => {
  if (!email) return false;
  const domain = email.split('@')[1];
  return freeEmailDomains.includes(domain);
};

const CreatorCRMViewPublic = () => {
  const [creatorCRMData, setCreatorCRMData] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [ccEmail, setCcEmail] = useState(''); // New state for ccEmail
  const [statusFilter, setStatusFilter] = useState('cold');
  const [newStatus, setNewStatus] = useState('EMAIL1');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [credits, setCredits] = useState(0); // New state for credits
  const [userId, setUserId] = useState(1); // Replace with actual logic to get current user's ID
  const [sortOrder, setSortOrder] = useState('newest'); // New state for sorting
  const [page, setPage] = useState(0); // New state for pagination
  const [rowsPerPage, setRowsPerPage] = useState(100); // New state for rows per page

  const fetchCreatorCrmData = async (filter) => {
    try {
      let data = await API.crm.creator_creators();
      
      // Filter data based on the status 'coldCRM' and exclude public email domains
      data = data.filter(creator =>
        !isFreeEmail(creator.email) &&  // Check that the email is not a free public email
        (creator.status === 'coldCRM' || creator.status === 'cold')    // Filter to only include creators with 'coldCRM' or 'cold' status
      );
  
      if (searchQuery) {
        data = data.filter(creator => creator.email.includes(searchQuery));
      }
  
      if (sortOrder === 'followers') {
        data = data.sort((a, b) => b.following - a.following);
      } else if (sortOrder === 'avg_views') {
        data = data.sort((a, b) => b.avg_views - a.avg_views);
      } else if (sortOrder === 'newest') {
        data = data.sort((a, b) => new Date(b.date_sourced) - new Date(a.date_sourced));
      }
  
      setCreatorCRMData(data);
      console.log('Fetched CRM data:', data);
    } catch (error) {
      console.error('Failed to fetch CRM data:', error);
    }
  };

  const fetchCredits = async () => {
    try {
      const data = await API.credx.credits({ user_id: userId });
      setCredits(data.credits);
      console.log('Fetched credits:', data);
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchCreatorCrmData(statusFilter);
    }
  }, [statusFilter, tabValue, searchQuery, sortOrder]);

  useEffect(() => {
    fetchCredits(); // Fetch credits on component mount
  }, []);

  const handleSelect = (id) => {
    setSelectedCreators(prevState =>
      prevState.includes(id) ? prevState.filter(creatorId => creatorId !== id) : [...prevState, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCreators(creatorCRMData.map(creator => creator.id));
    } else {
      setSelectedCreators([]);
    }
  };

  const handleSendUpdate = async () => {
    if (selectedCreators.length > credits) {
      alert('Not enough credits to send emails.');
      return;
    }

    const updates = selectedCreators.map(id => {
      const creator = creatorCRMData.find(creator => creator.id === id);
      return {
        email: creator.email,
        subject: emailSubject.replace(/{first_name}/g, creator.username),
        body: emailBody.replace(/{first_name}/g, creator.username),
        cc_email: ccEmail // Include cc_email in the update
      };
    });

    try {
      const result = await API.crm.update(updates);
      console.log('Updates sent:', result);

      await API.crm.update_contacts({ updates, note: `last email - ${emailSubject}` });

      for (const id of selectedCreators) {
        await API.crm.creator_update_status({ id, status: 'EMAIL1' });
      }

      const response = await API.credx.subtract_credx({
        user_id: userId,
        email_count: selectedCreators.length,
      });
    
      console.log('Subtract credits result:', response.data);
      setCredits(response.data.credits); // Update credits
  
      setDialogOpen(false);
      setSelectedCreators([]);
      setEmailSubject('');
      setEmailBody('');
      setCcEmail(''); // Reset ccEmail
    } catch (error) {
      console.error('Failed to send updates:', error);
      alert(`Failed to send updates: ${error.message}`);
    }
  };
  

  const handleChangeStatus = async () => {
    for (const id of selectedCreators) {
      await client.crm.creator_update_status({ id, status: newStatus === 'REMOVE' ? 'removed' : newStatus });
    }
    setSelectedCreators([]);
    if (tabValue === 0) {
      fetchCreatorCrmData(statusFilter);
    }
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Link', 'Username', 'Following', 'Likes', 'Avg Views', 'Date Sourced', 'Email', 'Bio Link', 'Date Added', 'Last Updated'];
    const csvRows = [headers.join(',')];

    creatorCRMData.forEach(creator => {
      const values = [
        creator.id,
        creator.link,
        creator.username,
        creator.following,
        creator.likes,
        creator.avg_views,
        creator.date_sourced,
        creator.email,
        creator.bio_link,
        creator.date_added,
        creator.last_updated
      ];
      csvRows.push(values.map(value => `${value}`).join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'creator_crm_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={StyleContent}>
        <Typography variant="h4" gutterBottom>
          Creator CRM Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your Credits: {credits} {/* Display the credits here */}
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="email and igdm tabs">
          <Tab label="Email" />
        </Tabs>
        {tabValue === 0 && (
          <>
            <Box sx={StyleStickyButtonContainter}>
              <Button variant="contained" onClick={downloadCSV} sx={StyleButton}>
                Download CSV
              </Button>
              <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)} sx={StyleButton}>
                Send Updates
              </Button>
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="newest">Newest to Oldest</MenuItem>
                  <MenuItem value="followers">Follower Count</MenuItem>
                  <MenuItem value="avg_views">Average Views</MenuItem>
                </Select>
              </FormControl>
            </Box>
           
            <TableContainer component={Paper} sx={{ mb: 3 }} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={(event) => handleSelectAll(event)}
                        checked={selectedCreators.length === creatorCRMData.slice(0, creatorCRMData.length).length}
                        indeterminate={selectedCreators.length > 0 && selectedCreators.length < creatorCRMData.slice(0, creatorCRMData.length).length}
                      />
                    </TableCell>
                    <TableCell>Link</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Following</TableCell>
                    <TableCell>Likes</TableCell>
                    <TableCell>Avg Views</TableCell>
                    <TableCell>Date Sourced</TableCell>
                    <TableCell>Bio Link</TableCell>
                    <TableCell>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {creatorCRMData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((creator) => (
                    <TableRow key={creator.id} selected={selectedCreators.includes(creator.id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedCreators.includes(creator.id)}
                          onChange={() => handleSelect(creator.id)}
                        />
                      </TableCell>
                      <TableCell><Link href={creator.link} target="_blank" rel="noopener noreferrer">{creator.link}</Link></TableCell>
                      <TableCell>{creator.username}</TableCell>
                      <TableCell>{creator.following}</TableCell>
                      <TableCell>{creator.likes}</TableCell>
                      <TableCell>{creator.avg_views}</TableCell>
                      <TableCell>{creator.date_sourced}</TableCell>
                      <TableCell><Link href={creator.bio_link} target="_blank" rel="noopener noreferrer">{creator.bio_link}</Link></TableCell>
                      <TableCell>{creator.last_updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={creatorCRMData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xl"
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '80vh' } }}
      >
        <DialogTitle>Send CRM</DialogTitle>
        <DialogContent>
          <FormGroup>
            <Typography variant="subtitle1" gutterBottom>Selected Users to Receive Updates:</Typography>
            <List dense>
              {selectedCreators.map(id => {
                const creator = creatorCRMData.find(creator => creator.id === id);
                return (
                  <ListItem key={id}>
                    {creator.email}
                  </ListItem>
                );
              })}
            </List>
            <TextField
              label="Email Subject"
              variant="outlined"
              fullWidth
              margin="normal"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <TextField
              label="Email Body"
              variant="outlined"
              multiline
              rows={8}
              fullWidth
              margin="normal"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
            <TextField
              label="CC Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendUpdate} color="primary" variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreatorCRMViewPublic;
