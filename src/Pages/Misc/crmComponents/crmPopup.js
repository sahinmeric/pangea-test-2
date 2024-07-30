import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import API from '../../../API';
import useAuth from '../../../Hooks/use-auth';  // Adjust the import path as needed

const CRMDialog = ({ isOpen, handleClose, origin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    origin
  });
  const { getCurrrentUser } = useAuth();  // Assuming useAuth provides this method

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, [getCurrrentUser]);

  // Do not render the dialog if the user is signed in
  if (user) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log('Form Data:', formData);
    try {
      const data = await API.crm.add({
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ')[1] || '',
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        origin: formData.origin
      });
      console.log('Server Response:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        New to Blitz? Let's Chat!
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form noValidate autoComplete="off">
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="text"
            fullWidth
            variant="outlined"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Company Name"
            type="text"
            fullWidth
            variant="outlined"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Origin"
            type="text"
            fullWidth
            variant="outlined"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            disabled
          />
          <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CRMDialog;
