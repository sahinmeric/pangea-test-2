import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from '@mui/material';
import { GoogleLogin} from '@react-oauth/google';

const OnboardPage3 = ({ minWidth, onFormSubmit, onPartnerSelect, status, onBlitzPay, onGoogleToken, onGoogleTokenError}) => {

    const [paymentMethod, setPaymentMethod] = useState("PayPal");
    const [paymentEmail, setPaymentEmail] = useState("");

    const handlePaymentMethodChange = (event) => {
        const method = event.target.value;
        setPaymentMethod(method);
        if(method == "Stripe")
            onBlitzPay();
    };

    const handleStatusChange = (event) => {
        const selectedStatus = event.target.value;
        onPartnerSelect(selectedStatus)
    };

    function handleCredentialResponse(response) {
        onGoogleToken(response.credential);
    }

    const handleLoginFailure = (error) => {
        console.error('Failed to login with Google:', error);
        onGoogleTokenError();
    };


    const SubmitForm = (event) => {
        event.preventDefault();

        const payload = {
            payout_preferred: paymentMethod,
            email: paymentEmail
          };

        onFormSubmit(payload);
    }

    return (
        <>
            <form id="page-1" onSubmit={SubmitForm}>
                <Box sx={{ flexDirection: 'column', display: 'flex', minWidth, gap: '1rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: "end" }}>
                        <FormControl fullWidth style={{ flex: 1 }}>
                            <InputLabel>Payment Method</InputLabel>
                            <Select value={paymentMethod} onChange={handlePaymentMethodChange}>
                                <MenuItem value="PayPal">PayPal, Standard, Fees Apply</MenuItem>
                                <MenuItem value="Stripe">BlitzPay, Faster, Less Fees</MenuItem>
                            </Select>
                        </FormControl>
                        {paymentMethod === "PayPal" && <TextField
                            margin="dense"
                            label="Paypal Payment Email"
                            type="email"
                            fullWidth
                            sx={{ flex: 1 }}
                            value={paymentEmail}
                            onChange={(e) => setPaymentEmail(e.target.value)}
                            variant="outlined"
                            required
                        />}
                    </Box>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select value={status} onChange={handleStatusChange}>
                            <MenuItem value="Associate">Associate</MenuItem>
                            <MenuItem value="Partner">Partner</MenuItem>
                        </Select>
                    </FormControl>
                    {status != "Partner" && <GoogleLogin
                        onSuccess={handleCredentialResponse}
                        onError={handleLoginFailure}/>}
                    {
                        status == "Partner" && <Typography variant="caption" component={'h2'}>As a Partner, you'll log with your Google account when clicking Submit</Typography>
                    }
                </Box>
            </form>
        </>)
}

export default OnboardPage3;