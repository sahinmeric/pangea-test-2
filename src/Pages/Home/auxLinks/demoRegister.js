import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useMutation } from "react-query";
import BlitzHeader from "../../../Components/BlitzHeader";
import client from "../../../API";
import routes from "../../../Config/routes";
import { validateEmail, validatePassword, capitalizeFirstLetter } from "../../../Utils";
import { useIsMounted } from "../../../Hooks/use-is-mounted";
import blitzLogo from "../../../Components/globalAssets/platty.png";

const DemoRegister = () => {
  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const { ref } = useParams();

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    phoneNumber: "",
    industry: "",
    bio: "",
    businessType: "",
    isAgency: "",
    monthlySpend: "",
    teamAccounts: "",
    paymentMethod: "",
    referralSource: "",
    referringUserId: ref || null,
  });


  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const [openDialog, setOpenDialog] = useState(true); // Set to true to show the dialog initially

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const { mutate: register, isLoading } = useMutation(client.companies.demoRegister, {
    onSuccess: (data) => {
      navigate(routes.login);
    },
    onError: (error) => {
      console.error("An error occurred during registration: ", error);
      let errorMessage = "An error occurred, please try again.";
      if (error.code === "ERR_NETWORK") {
        errorMessage = "Network is disconnected!";
      } else {
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  const handleRegister = async () => {
    let bValidation = true;

    Object.keys(userInfo).forEach((item) => {
      if (bValidation && userInfo[item].length === 0) {
        setSnackbarMessage(`${capitalizeFirstLetter(item)} field is required!`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        bValidation = false;
      }
    });

    if (bValidation) {
      if (!validateEmail(userInfo.email)) {
        setSnackbarMessage("Invalid email address!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      if (!validatePassword(userInfo.password)) {
        setSnackbarMessage("Password should have 6 or more characters!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      if (userInfo.password !== userInfo.confirmPassword) {
        setSnackbarMessage("Passwords should match!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
    }

    if (!bValidation) return;

    const params = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      password: userInfo.password,
      confirmPassword: userInfo.confirmPassword,
      companyName: userInfo.companyName,
      streetAddress: userInfo.streetAddress,
      city: userInfo.city,
      state: userInfo.state,
      country: userInfo.country,
      phoneNumber: userInfo.phoneNumber,
      industry: userInfo.industry,
      bio: userInfo.bio,
      businessType: userInfo.businessType,
      isAgency: userInfo.isAgency,
      monthlySpend: userInfo.monthlySpend,
      teamAccounts: userInfo.teamAccounts,
      paymentMethod: userInfo.paymentMethod,
      referralSource: userInfo.referralSource,
      referringUserId: userInfo.referringUserId,
    };

    register(params);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    <>
      <BlitzHeader>
        <Typography variant='h6'>Demo Register</Typography>
      </BlitzHeader>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBlock: '2em', padding: '2em', boxSizing: 'border-box', width: '100%', maxWidth: '600px' }}>
          <img src={blitzLogo} alt="Blitz Logo" style={{ marginBottom: '1em' }} />
          <Typography variant='h6'>Welcome to Blitz!</Typography>
          <Typography variant='body1' gutterBottom>Enter your information to continue with Blitz</Typography>
          <Divider sx={{ marginBlockEnd: '1em' }}></Divider>
          <Box sx={{ flexDirection: 'column', display: 'flex', minWidth: '100%' }}>
            <TextField
              disabled={isLoading}
              className="field"
              label="First Name"
              name="firstName"
              variant="outlined"
              value={userInfo.firstName}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <TextField
              disabled={isLoading}
              className="field"
              label="Last Name"
              name="lastName"
              variant="outlined"
              value={userInfo.lastName}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <TextField
              disabled={isLoading}
              className="field"
              label="Email"
              name="email"
              variant="outlined"
              value={userInfo.email}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <TextField
              disabled={isLoading}
              className="field"
              label="Password"
              name="password"
              variant="outlined"
              type="password"
              value={userInfo.password}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <TextField
              disabled={isLoading}
              className="field"
              label="Re-enter Password"
              name="confirmPassword"
              variant="outlined"
              type="password"
              value={userInfo.confirmPassword}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <TextField
              disabled={isLoading}
              className="field"
              label="Company Name"
              name="companyName"
              variant="outlined"
              value={userInfo.companyName}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <TextField
              disabled={isLoading}
              className="field"
              label="Street Address"
              name="streetAddress"
              variant="outlined"
              value={userInfo.streetAddress}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <TextField
              disabled={isLoading}
              className="field"
              label="City"
              name="city"
              variant="outlined"
              value={userInfo.city}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <TextField
              disabled={isLoading}
              className="field"
              label="State"
              name="state"
              variant="outlined"
              value={userInfo.state}
              onChange={handleChange}
              margin="dense"
              required
              fullWidth
            />
            <FormControl variant="outlined" fullWidth margin="dense" required>
              <InputLabel>Country</InputLabel>
              <Select
                name="country"
                value={userInfo.country}
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
              label="Phone Number"
              name="phoneNumber"
              value={userInfo.phoneNumber}
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
                value={userInfo.industry}
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
            <TextField
              label="Tell us about your company"
              name="bio"
              value={userInfo.bio}
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
                value={userInfo.businessType}
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
                value={userInfo.isAgency}
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
              value={userInfo.monthlySpend}
              onChange={handleChange}
              margin="dense"
              variant="outlined"
              required
              fullWidth
            />
            <TextField
              label="How many accounts do you need (for your team)?"
              name="teamAccounts"
              value={userInfo.teamAccounts}
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
                value={userInfo.paymentMethod}
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
              value={userInfo.referralSource}
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
              onClick={handleRegister}
              disabled={isLoading}
              sx={{ marginTop: '16px' }}
            >
              Create Account
            </Button>
            {userInfo.referringUserId && (
              <Box mt={2} textAlign="center">
                <Typography variant='body2'>Referred to by Creator: {userInfo.referringUserId}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Thanks for Booking a Creator!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Thanks for booking a creator through their media kit. To access your collaboration, make an account here.
          </Typography>
          <Typography variant="body2" mt={2}>
            For any questions or concerns, please contact <a href="mailto:jc@thecultureclub.us">jc@thecultureclub.us</a>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DemoRegister;
