import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, List, ListItem
} from '@mui/material';
import API from '../../../../../API';

const CreatorUpdate = ({ open, onClose, selectedCreators, creators }) => {
  const [messageBody, setMessageBody] = useState('');

  const handleSendUpdates = async () => {
    const updates = selectedCreators.map(id => {
      const creator = creators.find(creator => creator.creator === id);
      return {
        name: creator.creator,
        phone_number: creator.phone_number, // Ensure the key is phone_number
        message: messageBody.replace(/{first_name}/g, creator.creator)
      };
    });

    try {
      const result = await API.twilio.sendCreatorSms({ updates });
      console.log('Updates sent:', result);

      onClose();
      setMessageBody('');
    } catch (error) {
      console.error('Failed to send updates:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      maxWidth="xl"
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '80vh' } }}
    >
      <DialogTitle>Send Updates</DialogTitle>
      <DialogContent>
        <FormGroup>
          <Typography variant="subtitle1" gutterBottom>Selected Creators to Receive Updates:</Typography>
          <List dense>
            {selectedCreators.map(id => {
              const creator = creators.find(creator => creator.creator === id);
              return (
                <ListItem key={creator.creator}>
                  {creator.creator}
                </ListItem>
              );
            })}
          </List>
          <TextField
            label="Message Body"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button onClick={handleSendUpdates} color="primary" variant="contained">Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatorUpdate;
