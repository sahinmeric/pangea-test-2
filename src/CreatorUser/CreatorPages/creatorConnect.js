import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Container,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // Also import useLocation
import blitzLogo from "../../Components/globalAssets/platty.png";
import routes from "../../Config/routes.js";
import ConsentForm from "./popups/consentform.js";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { ConfigValue } from "../../Config";

const CreatorConnect = () => {
  const navigate = useNavigate();
  const { creator } = useParams();
  const location = useLocation();
  const [creatorName, setCreatorName] = useState(sessionStorage.getItem("creatorName") || creator || "");
  const [paymentMethod, setPaymentMethod] = useState(
    sessionStorage.getItem("paymentMethod") || "PayPal",
  );
  const [paymentEmail, setPaymentEmail] = useState("");
  const [stripeUserId, setStripeUserId] = useState(
    sessionStorage.getItem("stripeUserId"),
  );
  const [status, setStatus] = useState("Associate");
  const [consentOpen, setConsentOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleToken, setGoogleToken] = useState(null);
 
  const scope = [
    'https://mail.google.com/',
    'profile', 
    'email' ,
  ];

  const scopeString = scope.reduce((accum, currSco, currIdx)=>(accum+(currIdx==0?'':' ')+currSco), '');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const stripeIdFromUrl = queryParams.get("code");
    sessionStorage.setItem("creatorName", creatorName);
    if (stripeIdFromUrl) {
      setStripeUserId(stripeIdFromUrl);
      sessionStorage.setItem("stripeUserId", stripeIdFromUrl);
    }
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      try {
        await createCreator(tokenResponse.code);
      } catch (error) {
        alert(`Error getting user data from google: ${error}`);
      }
    },
    onError: errorResponse => {alert(`Error getting Partner permissions: ${errorResponse}`)},
    scope: scopeString,
    flow: "auth-code"
  });

  const handlePaymentMethodChange = (event) => {
    const method = event.target.value;
    setPaymentMethod(method);
    sessionStorage.setItem("paymentMethod", method);
    sessionStorage.setItem("creatorName", creatorName);
    if (method === "Stripe") {
      const redirectUri = `https://blitzpay.pro/creatorconnect/redirect`;
      window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }
  };

  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    if (selectedStatus === "Partner") {
      setConsentOpen(true); // Open consent form dialog
    }
  };
  const handleConsentClose = (consented) => {
    setConsentOpen(false);
    if (!consented) {
      setStatus("Associate"); // Revert status if not consented
    }
  };

  function handleCredentialResponse(response) {
    setGoogleToken(response.credential);
    setIsAuthenticated(true);
  }

  const handleLoginFailure = (error) => {
    console.error('Failed to login with Google:', error);
    alert('Google login failed, please try again.');
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if(status === "Partner"){
      await googleLogin(); // Proceed with Google sign-in if consented
    }
    else{
      await createCreator();
    }

  };

  const createCreator = async (google_code = null) => {
    const payload = {
      username: creatorName,
      payout_preferred: paymentMethod,
      email: paymentEmail,
      stripe_id: stripeUserId,
      google_token: googleToken,
      google_code: google_code,
      status:status
    };

    try {
      const response = await fetch(ConfigValue.PUBLIC_REST_API_ENDPOINT + '/creatorUsers/add',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        try{
          const errorData = await response.json();
          console.error("Failed to add creator user:", errorData);
          alert(`Failed to add creator user: ${errorData.error}`);
          return;
        }
        catch(error){
          const text = await response.text;
          console.error("Failed to add creator user:", text);
          alert(`Failed to add creator user: ${text}`);
          return;
        }
      }

      const responseData = await response.json();
      console.log("Creator user added successfully:", responseData);
      alert("Creator user added successfully!");
      navigate(routes.creatorLogin);
    } catch (error) {
      console.error("Error during form submission:", error);
      alert(`${error.message} \nYour Google and payment information has been blanked. Try again.`);
      setGoogleToken(null);
      setPaymentMethod("PayPal");
      sessionStorage.setItem("paymentMethod", "PayPal");
      setStripeUserId(null);
      sessionStorage.removeItem("stripeUserId");
      setIsAuthenticated(false);
    }
  }

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#000" }}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="logo"
              onClick={() => navigate(routes.campaigns)}
            >
              <img
                src={blitzLogo}
                alt="logo"
                style={{ width: "120px", height: "50px" }}
              />
            </IconButton>
          </Box>
          <Box
            display="flex"
            flexGrow={1}
            justifyContent="center"
            style={{ flexGrow: 2 }}
          >
            {/* Navigation items here */}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <h1>Creator Connect Form</h1>
        <form id="creatorForm" onSubmit={handleFormSubmit}>
          <TextField label="Creator Name" fullWidth value={creatorName} />
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select value={paymentMethod} onChange={handlePaymentMethodChange}>
              <MenuItem value="PayPal">PayPal, Standard, Fees Apply</MenuItem>
              <MenuItem value="Stripe">BlitzPay, Faster, Less Fees</MenuItem>
            </Select>
          </FormControl>
          {paymentMethod === "PayPal" && (
            <TextField
              label="PayPal Email"
              fullWidth
              value={paymentEmail}
              onChange={(e) => setPaymentEmail(e.target.value)}
            />
          )}
          {paymentMethod === "Stripe" && (
            <TextField
              label="Stripe User ID"
              fullWidth
              value={stripeUserId}
              disabled // make it read-only
            />
          )}
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={handleStatusChange}>
              <MenuItem value="Associate">Associate</MenuItem>
              <MenuItem value="Partner">Partner</MenuItem>
            </Select>
          </FormControl>
          {status != "Partner" && <GoogleLogin
            onSuccess={handleCredentialResponse}
            onError={handleLoginFailure}
            useOneTap />}
          {
            status == "Partner" && <Typography variant="caption" component={'h2'}>As a Partner, you'll log with your Google account when clicking Submit</Typography>
          }
          <Button type="submit" variant="contained" color="primary" disabled={!isAuthenticated && status != "Partner"}>
            Submit
          </Button>
        </form>
      </Container>

      <ConsentForm open={consentOpen} onClose={handleConsentClose} />
    </>
  );
};

export default CreatorConnect;
