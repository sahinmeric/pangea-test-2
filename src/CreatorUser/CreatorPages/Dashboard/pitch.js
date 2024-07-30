import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Checkbox,
  Alert,
  Avatar,
} from '@mui/material';
import { useQuery } from 'react-query';
import { ConfigValue } from '../../../Config';

const Pitch = ({ creatorUsername }) => {
  const [pitchesSent, setPitchesSent] = useState(0);
  const [credits, setCredits] = useState(0);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [rate, setRate] = useState('');
  const [ccEmail, setCcEmail] = useState('');

  const fetchUsersByCompany = async () => {
    const response = await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/creatorUsers/users_by_company`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  };

  const fetchContacts = async () => {
    const response = await fetch('https://blitz-backend-nine.vercel.app/api/crm/contacts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  };

  const fetchCredxMapping = async (creatorUsername) => {
    try {
      const response = await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/credx/credits?creator_username=${creatorUsername}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.error}`);
      }
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error.message);
    }
  };

  useEffect(() => {
    if (creatorUsername) {
      fetchCredxMapping(creatorUsername);
    }
  }, [creatorUsername]);

  const { isLoading: isLoadingUsers, error: errorUsers, data: usersByCompany } = useQuery('usersByCompany', fetchUsersByCompany, {
    keepPreviousData: true,
  });

  const { isLoading: isLoadingContacts, error: errorContacts, data: contacts } = useQuery('contacts', fetchContacts, {
    keepPreviousData: true,
  });

  const handleCheckboxChange = (companyName) => {
    setSelectedCompanies((prevSelected) =>
      prevSelected.includes(companyName)
        ? prevSelected.filter((name) => name !== companyName)
        : [...prevSelected, companyName]
    );
  };

  const handleOpenDialog = () => {
    if (credits > 0 && selectedCompanies.length > 0) {
      setOpen(true);
    } else {
      alert('Not enough credits or no company selected. Please select at least one company and ask our team for credits if needed.');
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handlePitch = async () => {
    if (!ccEmail) {
      alert('CC Email is required.');
      return;
    }

    try {
      const response = await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/credx/subtract_credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creator_username: creatorUsername,
          email_count: selectedCompanies.length, // Assuming 1 email per company selected
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();

      setPitchesSent(pitchesSent + selectedCompanies.length);
      setCredits(data.credits); // Update credits from the response

      // Send email to each selected company
      selectedCompanies.forEach(async (companyName) => {
        const companyUsers = usersByCompany[companyName];
        companyUsers.forEach(async (user) => {
          await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/credx/send_pitch_email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipient_email: user.email,
              subject,
              body,
              cc_email: ccEmail,
              creator_username: creatorUsername,
            }),
          });
        });
      });

      handleCloseDialog();
    } catch (error) {
      console.error('Error sending pitch:', error.message);
    }
  };

  if (isLoadingUsers || isLoadingContacts) return <CircularProgress sx={{ color: 'white' }} />;
  if (errorUsers) return <Typography sx={{ color: 'error' }}>Error fetching users: {errorUsers.message}</Typography>;
  if (errorContacts) return <Typography sx={{ color: 'error' }}>Error fetching contacts: {errorContacts.message}</Typography>;

  return (
    <Box sx={{ p: 2, minHeight: '100vh' }}>
      <Typography variant="h6" gutterBottom>
        User Pitches
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1">
          Pitches Sent: {pitchesSent}
        </Typography>
        <Typography variant="body1">
          Credits: {credits}
        </Typography>
        {selectedCompanies.length > 0 && credits > 0 && (
          <Button variant="contained" onClick={handleOpenDialog}>
            Pitch
          </Button>
        )}
      </Box>
      {credits === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          If you want to pitch to brands, ask our team for some credits.
        </Alert>
      )}
      <Typography variant="h6" gutterBottom>
        Verified Blitz Users - 2 credits per pitch
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {usersByCompany && Object.keys(usersByCompany).length > 0 ? (
          Object.keys(usersByCompany).map((companyName) => (
            <Grid item xs={12} sm={6} md={4} key={companyName}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={selectedCompanies.includes(companyName)}
                    onChange={() => handleCheckboxChange(companyName)}
                  />
                  <Avatar src={usersByCompany[companyName][0].phphref} alt={`${companyName} profile`} sx={{ mr: 2 }} />
                  <Typography variant="body1">{companyName}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography>No users available</Typography>
        )}
      </Grid>

      <Typography variant="h6" gutterBottom>
        Culture Club Connections - 1 credit per pitch
      </Typography>
      <Grid container spacing={2}>
        {contacts && contacts.length > 0 ? (
          contacts
            .sort((a, b) => {
              const nameA = a.company_name || a.email.split('@')[1];
              const nameB = b.company_name || b.email.split('@')[1];
              return nameA.localeCompare(nameB);
            })
            .map((contact) => (
              <Grid item xs={12} sm={6} md={4} key={contact.id}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={selectedCompanies.includes(contact.company_name)}
                      onChange={() => handleCheckboxChange(contact.company_name)}
                    />
                    <Typography variant="body1">{contact.company_name || contact.email.split('@')[1]}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))
        ) : (
          <Typography>No contacts available</Typography>
        )}
      </Grid>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Send Pitch</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details for your pitch.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Subject"
            fullWidth
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Body"
            fullWidth
            variant="outlined"
            multiline
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            helperText="Write something meaningful for brands to know about your page! They will be sent instructions on how to book."
          />
          <TextField
            margin="dense"
            label="Rate"
            fullWidth
            variant="outlined"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Your Email (CC)"
            fullWidth
            variant="outlined"
            required
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handlePitch}>Send Pitch</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pitch;
