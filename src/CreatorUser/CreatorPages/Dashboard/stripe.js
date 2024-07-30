import React, { useEffect, useState } from 'react';
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useCreatorAuth } from '../../../Hooks/creator-use-auth';
import AlertDialog from '../../../Components/AlertDialog';
import useAlertDialog from '../../../Components/useAlertDialog';
import { useNavigate } from 'react-router-dom';
import client from "../../../API";
import routes from '../../../Config/routes';
import BlitzHeader from '../../../Components/BlitzHeader';

const CreatorStripeId = () => {
  const { creatorToken } = useCreatorAuth();
  const navigate = useNavigate();

  const { dialogState, openDialog, closeDialog } = useAlertDialog();

  const queryParams = new URLSearchParams(location.search);

  //const stripeIdFromUrl = queryParams.get("code");
  console.log(queryParams.toString());

  if (!creatorToken) {
    alert("Unrecovereable error. Your login token was lost. Log back and try again");
    navigate(routes.creatorLogin);
    return (<>Loading</>);
  }

  const GoToStart = () => {
    navigate(routes.creatorConnectStart);
  }

  async function UpdateStripeId(stripeUserId) {
    const payload = {
      stripe_id: stripeUserId,
    };

    try {
      await client.creatorConnect.editCreatorStripe(payload);
      openDialog("Success", "Payment data added succesfully", GoToStart, GoToStart, "Ok", null);
    } catch (error) {
      console.error('Network error:', error);
      openDialog("Error", `${error.response && error.response.data.error ? error.response.data.error : error}`, GoToStart, GoToStart, "Ok", null);
    }
  }

  useEffect(() => {
    const stripeIdFromUrl = queryParams.get("code");
    if (stripeIdFromUrl === null) {
      openDialog("Error", "There was an error getting your payment info. Please get in contact with us.", GoToStart, GoToStart, "Ok", null);
      return;
    }
    UpdateStripeId(stripeIdFromUrl);
  }, []);



  return (
    <>
      <BlitzHeader></BlitzHeader>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AlertDialog alertState={dialogState}></AlertDialog>
        <Box sx={{ p: 2, backgroundColor: '#1a1a1a', color: '#f5f5f5', minHeight: '100vh' }}>
          <Typography variant="h5" gutterBottom>
            Welcome, {creatorToken.creator_user.username}!
          </Typography>
          <Typography variant="h4" gutterBottom>
            Creator Dashboard
          </Typography>
        </Box>
    </>
  );
};

export default CreatorStripeId;
