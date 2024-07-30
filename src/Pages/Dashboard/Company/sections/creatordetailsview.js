import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import client from '../../../../API';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, List, ListItem, Box } from '@mui/material';
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CreatorDialog from "../creatorupdate";
import { StyleContentWithNavBar } from '../../../../Utils/ThemedStyles';

const StyleTableHeader = (theme) => ({
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
});

const fixedMenuItemStyle = {
  width: '200px',
  textAlign: 'center'
};

const CreatorDetailsView = () => {
  const [creators, setCreators] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [isCreatorDialogOpen, setCreatorDialogOpen] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState(false);
  const [avgViewsSort, setAvgViewsSort] = useState('');
  const [tiktokFollowersSort, setTiktokFollowersSort] = useState('');
  const [instagramFollowersSort, setInstagramFollowersSort] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const { mutate: fetchData } = useMutation(client.creators.list, {
    onSuccess: (data) => {
      setCreators(data);
    },
    onError: (error) => {
      console.error('Failed to fetch data:', error);
    },
  });

  const { mutate: deleteCreator } = useMutation(
    (creatorId) => client.creators.delete({ creator_id: creatorId }),
    {
      onSuccess: () => {
        fetchData({is_vendor:true});
      },
      onError: (error) => {
        console.error('Failed to delete creator:', error);
      },
    }
  );

  useEffect(() => {
    fetchData({is_vendor:true});
  }, []);

  const handleDialogOpen = (creator = null) => {
    setEditingCreator(creator);
    setCreatorDialogOpen(true);
  };

  const handleDialogClose = (refresh = false) => {
    setCreatorDialogOpen(false);
    setEditingCreator(null);
    if (refresh) fetchData({is_vendor:true});
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

  const handleAvgViewsSortChange = (event) => {
    setAvgViewsSort(event.target.value);
  };

  const handleTiktokFollowersSortChange = (event) => {
    setTiktokFollowersSort(event.target.value);
  };

  const handleInstagramFollowersSortChange = (event) => {
    setInstagramFollowersSort(event.target.value);
  };

  const handleSelectCreator = (creatorId) => {
    setSelectedCreators(prevSelected => (
      prevSelected.includes(creatorId) ? prevSelected.filter(id => id !== creatorId) : [...prevSelected, creatorId]
    ));
  };

  const handleDeleteSelected = () => {
    selectedCreators.forEach(creatorId => deleteCreator(creatorId));
    setSelectedCreators([]);
  };

  const handleIncludeCreatorConnectLink = () => {
    const updatedBody = selectedCreators.reduce((body, id) => {
      const creator = creators.find(creator => creator.creator === id);
      return `${body}\n\nCreator Connect: blitzpay.pro/creatorconnect/${creator.creator}`;
    }, emailBody);
    setEmailBody(updatedBody);
  };

  const handleIncludeCreatorMediaKit = () => {
    const updatedBody = selectedCreators.reduce((body, id) => {
      const creator = creators.find(creator => creator.creator === id);
      return `${body}\n\nCreator Media Kit: blitzpay.pro/creators/${creator.creator}`;
    }, emailBody);
    setEmailBody(updatedBody);
  };

  const handleSendUpdates = async () => {
    const updates = selectedCreators.map(id => {
      const creator = creators.find(creator => creator.creator === id);
      return {
        email: creator.email,
        subject: emailSubject.replace(/{first_name}/g, creator.creator),
        body: emailBody.replace(/{first_name}/g, creator.creator).replace(/{creator_link}/g, `blitzpay.pro/creatorconnect/${creator.creator}`).replace(/{media_kit}/g, `blitzpay.pro/creators/${creator.creator}`)
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

  const filteredCreators = creators
    .filter(creator => {
      if (statusFilter === "Other" && (creator.status === "Partner" || creator.status === "Associate")) return false;
      if (statusFilter !== "" && statusFilter !== "Other" && creator.status !== statusFilter) return false;
      if (phoneFilter && (!creator.phone_number || ["NA", "N/A"].includes(creator.phone_number.toUpperCase()))) return true;
      return !phoneFilter;
    })
    .filter(creator => (
      (creator.creator || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.tiktok_brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.ig_feed_post || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.geolocation_gender_ethnicity || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.avg_views || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.notes_content_style || '').toLowerCase().includes(searchQuery.toLowerCase())
    ));

  if (avgViewsSort === 'highest') {
    filteredCreators.sort((a, b) => b.avg_views - a.avg_views);
  } else if (avgViewsSort === 'lowest') {
    filteredCreators.sort((a, b) => a.avg_views - b.avg_views);
  }

  if (tiktokFollowersSort === 'highest') {
    filteredCreators.sort((a, b) => b.tiktok - a.tiktok);
  } else if (tiktokFollowersSort === 'lowest') {
    filteredCreators.sort((a, b) => a.tiktok - b.tiktok);
  }

  if (instagramFollowersSort === 'highest') {
    filteredCreators.sort((a, b) => b.instagram - a.instagram);
  } else if (instagramFollowersSort === 'lowest') {
    filteredCreators.sort((a, b) => a.instagram - b.instagram);
  }

  return (
    <Box sx={StyleContentWithNavBar}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FormControl variant="outlined">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Partner" sx={fixedMenuItemStyle}>Partner</MenuItem>
            <MenuItem value="Associate" sx={fixedMenuItemStyle}>Associate</MenuItem>
            <MenuItem value="Other" sx={fixedMenuItemStyle}>Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Avg Views</InputLabel>
          <Select
            value={avgViewsSort}
            onChange={handleAvgViewsSortChange}
            label="Avg Views"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="highest" sx={fixedMenuItemStyle}>Highest to Lowest</MenuItem>
            <MenuItem value="lowest" sx={fixedMenuItemStyle}>Lowest to Highest</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>TikTok Followers</InputLabel>
          <Select
            value={tiktokFollowersSort}
            onChange={handleTiktokFollowersSortChange}
            label="TikTok Followers"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="highest" sx={fixedMenuItemStyle}>Highest to Lowest</MenuItem>
            <MenuItem value="lowest" sx={fixedMenuItemStyle}>Lowest to Highest</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Instagram Followers</InputLabel>
          <Select
            value={instagramFollowersSort}
            onChange={handleInstagramFollowersSortChange}
            label="Instagram Followers"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="highest" sx={fixedMenuItemStyle}>Highest to Lowest</MenuItem>
            <MenuItem value="lowest" sx={fixedMenuItemStyle}>Lowest to Highest</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <label>
            <input type="checkbox" checked={phoneFilter} onChange={handlePhoneFilterChange} />
            Show only creators without valid phone numbers
          </label>
        </FormControl>
        <Button variant="contained" color="secondary" onClick={handleDeleteSelected} disabled={selectedCreators.length === 0}>
          Delete Selected
        </Button>
        <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)} disabled={selectedCreators.length === 0}>
          Send Updates
        </Button>
      </Box>
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
              <TableCell sx={StyleTableHeader} align="center">Creator Name</TableCell>
              <TableCell sx={StyleTableHeader} align="center">TikTok Following</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Instagram Following</TableCell>
              <TableCell sx={StyleTableHeader} align="center">TikTok Rate</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Instagram Rate</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Geolocation</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Average Views</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Notes/Content Style</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Email</TableCell>
              <TableCell sx={StyleTableHeader} align="center">Phone Number</TableCell>
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
                <TableCell align="right">{creator.tiktok || 'N/A'}</TableCell>
                <TableCell align="right">{creator.instagram || 'N/A'}</TableCell>
                <TableCell align="right">{creator.tiktok_brand || 'N/A'}</TableCell>
                <TableCell align="right">{creator.ig_feed_post || 'N/A'}</TableCell>
                <TableCell align="right">{creator.geolocation_gender_ethnicity || 'N/A'}</TableCell>
                <TableCell align="right">{creator.avg_views || 'N/A'}</TableCell>
                <TableCell align="right">{creator.notes_content_style || 'N/A'}</TableCell>
                <TableCell align="right">{creator.email || 'N/A'}</TableCell>
                <TableCell align="right">{creator.phone_number || 'N/A'}</TableCell>
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
        <CreatorDialog
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
        <DialogTitle>Send CRM</DialogTitle>
        <DialogContent>
          <FormGroup>
            <Typography variant="subtitle1" gutterBottom>Selected Users to Receive Updates:</Typography>
            <List dense>
              {selectedCreators.map(id => {
                const creator = creators.find(creator => creator.creator === id);
                return (
                  <ListItem key={creator.creator}>
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
            <Button variant="contained" color="primary" onClick={handleIncludeCreatorConnectLink} style={{ marginTop: 16 }}>
              Include CreatorConnect Link
            </Button>
            <Button variant="contained" color="primary" onClick={handleIncludeCreatorMediaKit} style={{ marginTop: 16, marginLeft: 8 }}>
              Include Creator Media Kit
            </Button>
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

export default CreatorDetailsView;
