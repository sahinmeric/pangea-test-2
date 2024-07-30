import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, TextField, FormControl, Paper, InputLabel, Select, MenuItem, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox
} from '@mui/material';
import Layout from '../layout';
import IGDMView from './igdm';
import { StyleButton, StyleContent, StyleStickyButtonContainter } from '../../../../../Utils/ThemedStyles';
import API from '../../../../../API';
import client from '../../../../../API';

const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'outlook.com'];

const isFreeEmail = (email) => {
  if (!email) return false;
  const domain = email.split('@')[1];
  return freeEmailDomains.includes(domain);
};

const StyleActionBox = (theme) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
});

const StyleSearchBar = {
  minWidth: 120, 
}

const CreatorCRMView = () => {
  const [creatorCRMData, setCreatorCRMData] = useState([]);
  const [igdmData, setIgdmData] = useState([]);
  const [creatorDetailsData, setCreatorDetailsData] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [statusFilter, setStatusFilter] = useState('cold');
  const [newStatus, setNewStatus] = useState('EMAIL1');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [excludedEmails, setExcludedEmails] = useState([]);

  const fetchExcludedEmails = async () => {
    try {
      const data = await API.creators.emails();
      setExcludedEmails(data.emails);
    } catch (error) {
      console.error('Failed to fetch excluded emails:', error);
    }
  };

  const fetchCreatorCrmData = async (filter) => {
    try {
      await fetchExcludedEmails(); // Fetch excluded emails first
      let data = await API.crm.creator_creators();
      data = data.filter(creator => !excludedEmails.includes(creator.email)); // Exclude emails

      if (filter !== 'all') {
        data = data.filter(creator =>
          isFreeEmail(creator.email) &&
          (filter === '' || creator.status === filter) &&
          parseInt(String(creator.following).replace(/,/g, ''), 10) > 100000
        );
      }
      if (searchQuery) {
        data = data.filter(creator => creator.email.includes(searchQuery));
      }
      setCreatorCRMData(data);
      console.log('Fetched CRM data:', data);
    } catch (error) {
      console.error('Failed to fetch CRM data:', error);
    }
  };

  const fetchIgdmData = () => {
    return;
  };

  const fetchCreatorDetailsData = () => {
    console.error('Nonexisting endpoint https://blitz-backend-nine.vercel.app/api/crm/creator/list');
  };

  useEffect(() => {
    if (tabValue === 0) {
      fetchCreatorCrmData(statusFilter);
    } else if (tabValue === 1) {
      fetchIgdmData();
    } else if (tabValue === 2) {
      fetchCreatorDetailsData();
    } else if (tabValue === 3) {
      fetchCreatorCrmData('all');
      fetchIgdmData();
      fetchCreatorDetailsData();
    }
  }, [statusFilter, tabValue, searchQuery]);

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
    const updates = selectedCreators.map(id => {
      const creator = creatorCRMData.find(creator => creator.id === id);
      return {
        email: creator.email,
        subject: emailSubject.replace(/{first_name}/g, creator.username),
        body: emailBody.replace(/{first_name}/g, creator.username)
      };
    });

    try {
      const result = await client.crm.update(updates);
      console.log('Updates sent:', result);

      await client.crm.update_contacts({ updates, note: `last email - ${emailSubject}` });

      for (const id of selectedCreators) {
        await client.crm.creator_update_status({ id, status: 'EMAIL1' });
      }

      setDialogOpen(false);
      setSelectedCreators([]);
      setEmailSubject('');
      setEmailBody('');
    } catch (error) {
      console.error('Failed to send updates:', error);
    }
  };

  const handleChangeStatus = async () => {
    for (const id of selectedCreators) {
      await client.crm.creator_update_status({ id, status: newStatus === 'REMOVE' ? 'removed' : newStatus  });
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

  const mergedData = [...creatorCRMData, ...igdmData, ...creatorDetailsData];

  return (
    <Box>
      <Box sx={StyleContent}>
        <Typography variant="h4" gutterBottom>
          Creator CRM Dashboard
        </Typography>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="email and igdm tabs">
          <Tab label="Email" />
          <Tab label="IGDM" />
          <Tab label="ALL" />
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="EMAIL1">EMAIL1</MenuItem>
                  <MenuItem value="EMAIL2">EMAIL2</MenuItem>
                  <MenuItem value="EMAIL3">EMAIL3</MenuItem>
                  <MenuItem value="coldCRM">ColdCRM</MenuItem>
                  <MenuItem value="cold">Cold</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Search by Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              sx={StyleSearchBar}
            />
            <Box sx={StyleActionBox}>
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Set Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Set Status"
                >
                  <MenuItem value="EMAIL1">EMAIL1</MenuItem>
                  <MenuItem value="EMAIL2">EMAIL2</MenuItem>
                  <MenuItem value="EMAIL3">EMAIL3</MenuItem>
                  <MenuItem value="coldCRM">ColdCRM</MenuItem>
                  <MenuItem value="cold">Cold</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="REMOVE">REMOVE</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleChangeStatus}>
                Apply Status Change
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
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
                    <TableCell>Email</TableCell>
                    <TableCell>Bio Link</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {creatorCRMData.slice(0, creatorCRMData.length).map((creator) => (
                    <TableRow key={creator.id} selected={selectedCreators.includes(creator.id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedCreators.includes(creator.id)}
                          onChange={() => handleSelect(creator.id)}
                        />
                      </TableCell>
                      <TableCell><a href={creator.link} target="_blank" rel="noopener noreferrer">{creator.link}</a></TableCell>
                      <TableCell>{creator.username}</TableCell>
                      <TableCell>{creator.following}</TableCell>
                      <TableCell>{creator.likes}</TableCell>
                      <TableCell>{creator.avg_views}</TableCell>
                      <TableCell>{creator.date_sourced}</TableCell>
                      <TableCell>{creator.email}</TableCell>
                      <TableCell><a href={creator.bio_link} target="_blank" rel="noopener noreferrer">{creator.bio_link}</a></TableCell>
                      <TableCell>{creator.last_updated}</TableCell>
                      <TableCell>{creator.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {tabValue === 1 && (
          <IGDMView />
        )}
        {tabValue === 2 && (
          <>
            <Box sx={StyleStickyButtonContainter}>
              <Button variant="contained" onClick={downloadCSV} sx={StyleButton}>
                Download CSV
              </Button>
              <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)} sx={StyleButton}>
                Send Updates
              </Button>
              <FormControl variant="outlined" sx={StyleButton}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="EMAIL1">EMAIL1</MenuItem>
                  <MenuItem value="EMAIL2">EMAIL2</MenuItem>
                  <MenuItem value="EMAIL3">EMAIL3</MenuItem>
                  <MenuItem value="coldCRM">ColdCRM</MenuItem>
                  <MenuItem value="cold">Cold</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Search by Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              sx={(theme) => ({ marginBottom: theme.spacing(2) })}
            />
            <Box sx={StyleActionBox}>
              <FormControl variant="outlined" sx={StyleSearchBar}>
                <InputLabel>Set Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Set Status"
                >
                  <MenuItem value="EMAIL1">EMAIL1</MenuItem>
                  <MenuItem value="EMAIL2">EMAIL2</MenuItem>
                  <MenuItem value="EMAIL3">EMAIL3</MenuItem>
                  <MenuItem value="coldCRM">ColdCRM</MenuItem>
                  <MenuItem value="cold">Cold</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="REMOVE">REMOVE</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleChangeStatus}>
                Apply Status Change
              </Button>
            </Box>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        onChange={(event) => handleSelectAll(event)}
                        checked={selectedCreators.length === mergedData.slice(0, mergedData.length).length}
                        indeterminate={selectedCreators.length > 0 && selectedCreators.length < mergedData.slice(0, mergedData.length).length}
                      />
                    </TableCell>
                    <TableCell>Link</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Following</TableCell>
                    <TableCell>Likes</TableCell>
                    <TableCell>Avg Views</TableCell>
                    <TableCell>Date Sourced</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Bio Link</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mergedData.slice(0, mergedData.length).map((creator) => (
                    <TableRow key={creator.id} selected={selectedCreators.includes(creator.id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedCreators.includes(creator.id)}
                          onChange={() => handleSelect(creator.id)}
                        />
                      </TableCell>
                      <TableCell><a href={creator.link} target="_blank" rel="noopener noreferrer">{creator.link}</a></TableCell>
                      <TableCell>{creator.username}</TableCell>
                      <TableCell>{creator.following}</TableCell>
                      <TableCell>{creator.likes}</TableCell>
                      <TableCell>{creator.avg_views}</TableCell>
                      <TableCell>{creator.date_sourced}</TableCell>
                      <TableCell>{creator.email}</TableCell>
                      <TableCell><a href={creator.bio_link} target="_blank" rel="noopener noreferrer">{creator.bio_link}</a></TableCell>
                      <TableCell>{creator.last_updated}</TableCell>
                      <TableCell>{creator.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                const creator = mergedData.find(creator => creator.id === id);
                return (
                  <ListItem key={creator.id}>
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
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendUpdate} color="primary" variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatorCRMView;
