import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';

const ConsentForm = ({ open, onClose }) => {
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  const handleConsentChange = (event) => {
    setIsConsentGiven(event.target.checked);
  };

  const handleSubmit = () => {
    if (isConsentGiven) {
      onClose(true);
      setIsConsentGiven(false);
    } else {
      alert('You need to agree to the terms to proceed.');
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Consent to Access Email</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Checkbox checked={isConsentGiven} onChange={handleConsentChange} />}
          label="I authorize The Culture Club to access my email account to validate resources and make decisions on my behalf. I understand I can withdraw my consent at any time."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isConsentGiven} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentForm;
