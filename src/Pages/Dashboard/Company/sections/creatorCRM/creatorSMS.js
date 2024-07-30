import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import client from '../../../../../API';
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, List, ListItem, Box
} from '@mui/material';
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CreatorUpdate from './creatorupdate';
import { StyleContent, StyleContentWithNavBar } from '../../../../../Utils/ThemedStyles';
import API from '../../../../../API';

const StyleTableHeader = (theme) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
});

const CreatorSMS = () => {
  const [creators, setCreators] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [isCreatorDialogOpen, setCreatorDialogOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState(false);
  const [validPhoneFilter, setValidPhoneFilter] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');

  const { mutate: fetchData } = useMutation(client.creators.list, {
    onSuccess: (data) => {
      setCreators(data);
    },
    onError: (error) => {
      console.error('Failed to fetch data:', error);
    },
  });

  useEffect(() => {
    fetchData({ is_vendor: true });
  }, []);

  const handleDialogOpen = (creator = null) => {
    setEditingCreator(creator);
    setCreatorDialogOpen(true);
  };

  const handleDialogClose = (refresh = false) => {
    setCreatorDialogOpen(false);
    setEditingCreator(null);
    if (refresh) fetchData({ is_vendor: true });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handlePhoneFilterChange = () => {
    setPhoneFilter(!phoneFilter);
  };

  const handleValidPhoneFilterChange = () => {
    setValidPhoneFilter(!validPhoneFilter);
  };

  const handleSelectCreator = (creatorId) => {
    setSelectedCreators(prevSelected => (
      prevSelected.includes(creatorId) ? prevSelected.filter(id => id !== creatorId) : [...prevSelected, creatorId]
    ));
  };

  const handleSendUpdates = async () => {
    const updates = selectedCreators.map(id => {
      const creator = creators.find(creator => creator.creator === id);
      return {
        phone_number: creator.phone_number,
        message: smsMessage.replace(/{first_name}/g, creator.creator)
      };
    });

    try {
      const result = await API.twilio.sendCreatorSms({ updates });
      console.log('Updates sent:', result);

      setDialogOpen(false);
      setSelectedCreators([]);
      setSmsMessage('');
    } catch (error) {
      console.error('Failed to send updates:', error);
    }
  };

  const filteredCreators = creators
    .filter(creator => {
      if (statusFilter !== "" && creator.status !== statusFilter) return false;
      if (phoneFilter && (!creator.phone_number || ["NA", "N/A"].includes(creator.phone_number.toUpperCase()))) return true;
      if (validPhoneFilter && (creator.phone_number && !["NA", "N/A"].includes(creator.phone_number.toUpperCase()))) return true;
      return !phoneFilter && !validPhoneFilter;
    })
    .filter(creator => (
      (creator.creator || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    ));

  return (
    <Box sx={StyleContentWithNavBar}>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={(theme) => ({ marginBottom: theme.spacing(2) })}
      />
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          label="Status"
        >
          <MenuItem value=""><em>All</em></MenuItem>
          <MenuItem value="Partner">Partner</MenuItem>
          <MenuItem value="Associate">Associate</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      <FormControl margin="normal">
        <label>
          <Checkbox checked={phoneFilter} onChange={handlePhoneFilterChange} />
          Show only creators without valid phone numbers
        </label>
      </FormControl>
      <FormControl margin="normal">
        <label>
          <Checkbox checked={validPhoneFilter} onChange={handleValidPhoneFilterChange} />
          Show only creators with valid phone numbers
        </label>
      </FormControl>
      <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)} disabled={selectedCreators.length === 0}>
        Send Updates
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={(theme) => ({ backgroundColor: theme.palette.primary.main })}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedCreators.length > 0 && selectedCreators.length < filteredCreators.length}
                  checked={filteredCreators.length > 0 && selectedCreators.length === filteredCreators.length}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedCreators(filteredCreators.map(creator => creator.creator));
                    } else {
                      setSelectedCreators([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={StyleTableHeader}>Creator Name</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Email</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Phone Number</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Last Contact</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCreators.map((creator) => (
              <TableRow key={creator.creator}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCreators.includes(creator.creator)}
                    onChange={() => handleSelectCreator(creator.creator)}
                  />
                </TableCell>
                <TableCell align="right">{creator.creator || 'N/A'}</TableCell>
                <TableCell align="right">{creator.email || 'N/A'}</TableCell>
                <TableCell align="right">{creator.phone_number || 'N/A'}</TableCell>
                <TableCell align="right">{creator.last_contact || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(creator)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isCreatorDialogOpen && (
        <CreatorUpdate
          open={isCreatorDialogOpen}
          onClose={handleDialogClose}
          creatorInfo={editingCreator}
        />
      )}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xl"
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '80vh' } }}
      >
        <DialogTitle>Send SMS Updates</DialogTitle>
        <DialogContent>
          <FormGroup>
            <Typography variant="subtitle1" gutterBottom>Selected Users to Receive Updates:</Typography>
            <List dense>
              {selectedCreators.map(id => {
                const creator = creators.find(creator => creator.creator === id);
                return (
                  <ListItem key={creator.creator}>
                    {creator.phone_number}
                  </ListItem>
                );
              })}
            </List>
            <TextField
              label="SMS Message"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendUpdates} color="primary" variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreatorSMS;
