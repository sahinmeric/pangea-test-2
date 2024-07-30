import React, { useState } from 'react';
import { Box, Typography, Backdrop, CircularProgress, Toolbar, Button } from '@mui/material';


import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import routes from '../Config/routes';
import { useCreatorAuth } from '../Hooks/creator-use-auth';
import { ConfigValue } from '../Config';

import AlertDialog from '../Components/AlertDialog';
import useAlertDialog from '../Components/useAlertDialog';
import BlitzHeader from '../Components/BlitzHeader';

const CreatorLogin = () => {
    const navigate = useNavigate();
    const { login } = useCreatorAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { dialogState, openDialog, closeDialog } = useAlertDialog();

    const handleLoginSuccess = async (response) => {
        try {
            const token = response.credential; // The JWT token provided by Google
            const fetchResponse = await fetch(ConfigValue.PUBLIC_REST_API_ENDPOINT + '/creatorUsers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (fetchResponse.ok) {
                const jsonResponse = await fetchResponse.json();
                console.log("Server response: ", jsonResponse);
                //alert('Login successful!');
                login(jsonResponse);
                openDialog("Success", "You have logged in succesfully", () => navigate(routes.creatorConnectStart), () => navigate(routes.creatorConnectStart), "Ok", null);
                //navigate(routes.creatorConnectStart);
            } else {
                const errorMessage = await fetchResponse.text();
                openDialog("Failure", `Login failed: ${errorMessage}`, closeDialog, closeDialog, "Ok", null);
            }
        } catch (error) {
            console.error('Error during login:', error);
            openDialog("Failure", 'Login process encountered an error.', closeDialog, closeDialog, "Ok", null);
        }
    };

    const handleLoginFailure = (error) => {
        console.error('Failed to login with Google:', error);
        openDialog("Failure", 'Google login failed, please try again.', closeDialog, closeDialog, "Ok", null);
    };

    return (
        <>
            <BlitzHeader>
            </BlitzHeader>
            <Toolbar></Toolbar>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem' }}>
                <AlertDialog alertState={dialogState}></AlertDialog>
                <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center' }}>Log in to Blitz to see your campaigns</Typography>
                <Box style={{ width: '80%', maxWidth: '300px' }}>
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginFailure}
                        useOneTap />
                </Box>
            </Box>
        </>
    );
};

export default CreatorLogin;
