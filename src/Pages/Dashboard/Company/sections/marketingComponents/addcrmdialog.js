import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import client from '../../../../../API';

const AddCRMDialog = ({ open, onClose }) => {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    contactSource: '',
  });

  const queryClient = useQueryClient();

  const mutation = useMutation((newContact) => client.crm.add(newContact), {
    onSuccess: () => {
      // Invalidate and refetch the CRM data to reflect the new contact
      queryClient.invalidateQueries('crmContacts');
      onClose();
    },
    onError: (error) => {
      console.error('Error adding contact:', error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    mutation.mutate(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add to CRM</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="firstName"
          label="First Name"
          type="text"
          fullWidth
          value={formValues.firstName}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="lastName"
          label="Last Name"
          type="text"
          fullWidth
          value={formValues.lastName}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          value={formValues.email}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="phoneNumber"
          label="Phone Number"
          type="text"
          fullWidth
          value={formValues.phoneNumber}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="companyName"
          label="Company Name"
          type="text"
          fullWidth
          value={formValues.companyName}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="contactSource"
          label="Contact Source"
          type="text"
          fullWidth
          value={formValues.contactSource}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCRMDialog;
