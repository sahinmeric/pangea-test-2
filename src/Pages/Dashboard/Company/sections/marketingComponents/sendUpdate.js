import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import API from '../../../../../API';

const UpdateDialog = ({ open, onClose, userData }) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleSendUpdate = async () => {
    const updates = userData.map(user => ({
      email: user.email,
      subject: emailSubject.replace(/{first_name}/g, user.first_name),
      body: emailBody.replace(/{first_name}/g, user.first_name)
    }));

    console.log('Sending updates:', updates);
    try {
      const result = await API.crm.update_contacts({ updates, note: `last email - ${emailSubject}` });
      console.log('Updates sent:', result);

      onClose();
    } catch (error) {
      console.error('Failed to send updates:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Send Update</DialogTitle>
      <DialogContent>
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
          rows={4}
          fullWidth
          margin="normal"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSendUpdate} color="primary" variant="contained">Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDialog;
