import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import BlitzHeader from '../../../Components/BlitzHeader';
import { useMutation } from 'react-query';
import client from '../../../API';
import routes from '../../../Config/routes';

const RequestAccess = () => {
  const navigate = useNavigate();
  const { ref } = useParams(); // Capture referring user ID from URL params

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    phoneNumber: '',
    industry: '',
    country: '',
    bio: '',
    businessType: '',
    isAgency: '',
    monthlySpend: '',
    teamAccounts: '',
    paymentMethod: '',
    referralSource: '',
    referringUserId: ref || null, // Initialize with referring user ID from params
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const { mutate: requestAccess, isLoading } = useMutation(client.users.access, {
    onSuccess: () => {
      navigate(routes.home);
    },
    onError: (error) => {
      console.error('An error occurred: ', error);
      setSnackbarMessage('An error occurred, please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    requestAccess(formState);
  };

  const industryOptions = [
    "Fashion", "Tech", "Food", "Beauty", "Sports", "Travel",
    "Finance", "Health", "Education", "Entertainment", "Automotive",
    "Real Estate", "Hospitality", "Retail", "Manufacturing", "Telecommunications"
  ];

  const countryOptions = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", 
    "Italy", "Spain", "Japan", "China", "India", "Brazil", "Mexico", "Russia", 
    "South Korea", "South Africa"
  ];

  return (
    <div className="request-access-container">
      <BlitzHeader />
      <div className="form-container">
        <h2>Request Access to Blitz</h2>
        <p>Fill out the form below to request access to our platform</p>
        <Box sx={{ flexDirection: 'column', display: 'flex', minWidth: '300px' }}>
          {/* Render form fields */}
          <TextField
            label="First Name"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            required
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            required
            fullWidth
          />
          <TextField
            label="Company Name"
            name="companyName"
            value={formState.companyName}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            required
            fullWidth
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formState.phoneNumber}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            required
            fullWidth
          />
          <FormControl variant="outlined" fullWidth margin="dense" required>
            <InputLabel>Industry</InputLabel>
            <Select
              name="industry"
              value={formState.industry}
              onChange={handleChange}
              label="Industry"
            >
              {industryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="dense" required>
            <InputLabel>Country</InputLabel>
            <Select
              name="country"
              value={formState.country}
              onChange={handleChange}
              label="Country"
            >
              {countryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Tell us about your company"
            name="bio"
            value={formState.bio}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
          />
          <FormControl variant="outlined" fullWidth margin="dense" required>
            <InputLabel>Is your business all under one company, or is it separate?</InputLabel>
            <Select
              name="businessType"
              value={formState.businessType}
              onChange={handleChange}
              label="Is your business all under one company, or is it separate?"
            >
              <MenuItem value="One Company">One Company</MenuItem>
              <MenuItem value="Separate">Separate</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="dense" required>
            <InputLabel>Are you an agency?</InputLabel>
            <Select
              name="isAgency"
              value={formState.isAgency}
              onChange={handleChange}
              label="Are you an agency?"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="How much do you expect to spend every month?"
            name="monthlySpend"
            value={formState.monthlySpend}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            required
            fullWidth
          />
          <TextField
            label="How many accounts do you need (for your team)?"
            name="teamAccounts"
            value={formState.teamAccounts}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            required
            fullWidth
          />
          <FormControl variant="outlined" fullWidth margin="dense" required>
            <InputLabel>What is your main method of payment?</InputLabel>
            <Select
              name="paymentMethod"
              value={formState.paymentMethod}
              onChange={handleChange}
              label="What is your main method of payment?"
            >
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="PayPal">PayPal</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="How did you hear about us?"
            name="referralSource"
            value={formState.referralSource}
            onChange={handleChange}
            margin="dense"
            variant="outlined"
            required
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ marginTop: '16px' }}
          >
            Submit Request
          </Button>
          {formState.referringUserId && (
            <Box mt={2} textAlign="center">
              <p>Referred to by User ID: {formState.referringUserId}</p>
            </Box>
          )}
        </Box>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RequestAccess;
