import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, FormGroup, TextField, Typography, List, ListItem, Autocomplete, Box
} from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import client from "../../../../../API";

const EmailCRMDialog = ({ open, onClose, userData }) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState('');

  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery('campaigns', client.campaigns.list);
  const { data: creators, isLoading: isLoadingCreators } = useQuery('creators', client.creators.list);

  const handleDragStart = (e, text) => {
    e.dataTransfer.setData('text/plain', text);
  };

  const handleDrop = (e, setState) => {
    const text = e.dataTransfer.getData('text/plain');
    const cursorPosition = e.target.selectionStart;
    const currentValue = e.target.value;
    const newValue = currentValue.slice(0, cursorPosition) + text + currentValue.slice(cursorPosition);
    setState(newValue);
    e.preventDefault();
  };

  const handleInsertLink = () => {
    if (selectedCreator && discountPercentage) {
      const link = `https://blitzpay.pro/creators/${selectedCreator.creator}/promotional/${discountPercentage}`;
      setEmailBody((prevBody) => `${prevBody} [Creator Link](${link})`);
    }
  };

  const handleSendUpdate = async () => {
    const updates = userData.map(user => ({
      email: user.email,
      subject: emailSubject.replace(/{first_name}/g, user.first_name),
      body: emailBody.replace(/{first_name}/g, user.first_name)
    }));

    console.log('Sending updates:', updates);

    try {
      const result = await client.crm.update(updates);
      console.log('Updates sent:', result);
      console.log('Updates sent:', result);

      // Update CRM contacts with last_contacted and note
      
      await client.crm.update_contacts({ updates, note: `last email - ${emailSubject}` });
      
      onClose();
    } catch (error) {
      console.error('Failed to send updates:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '80vh' } }} // Custom width and height
    >
      <DialogTitle>Send CRM</DialogTitle>
      <DialogContent>
        <FormGroup>
          <Typography variant="subtitle1" gutterBottom>Selected Users to Receive Updates:</Typography>
          <List dense>
            {userData.map(user => (
              <ListItem key={user.id}>
                {user.email}
              </ListItem>
            ))}
          </List>
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, '{first_name}')}
            style={{ padding: '5px', border: '1px dashed grey', display: 'inline-block', marginBottom: '10px', cursor: 'grab' }}
          >
            Drag to insert {`{first_name}`}
          </div>
          <Autocomplete
            options={campaigns || []}
            getOptionLabel={(option) => option.name}
            loading={isLoadingCampaigns}
            onChange={(event, newValue) => setSelectedCampaign(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Campaign" variant="outlined" margin="normal" />}
          />
          <Autocomplete
            options={creators || []}
            getOptionLabel={(option) => option.creator}
            loading={isLoadingCreators}
            onChange={(event, newValue) => setSelectedCreator(newValue)}
            renderInput={(params) => <TextField {...params} label="Select Creator" variant="outlined" margin="normal" />}
          />
          <TextField
            label="Discount Percentage"
            variant="outlined"
            margin="normal"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
          <Button onClick={handleInsertLink} disabled={!selectedCreator || !discountPercentage} color="primary" variant="contained" style={{ marginBottom: '10px' }}>
            Insert Promotional Link
          </Button>
          <TextField
            label="Email Subject"
            variant="outlined"
            fullWidth
            margin="normal"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            onDrop={(e) => handleDrop(e, setEmailSubject)}
            onDragOver={(e) => e.preventDefault()}
          />
          <TextField
            label="Email Body"
            variant="outlined"
            multiline
            rows={8} // Increase the number of rows for larger textarea
            fullWidth
            margin="normal"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            onDrop={(e) => handleDrop(e, setEmailBody)}
            onDragOver={(e) => e.preventDefault()}
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSendUpdate} color="primary" variant="contained">Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailCRMDialog;
