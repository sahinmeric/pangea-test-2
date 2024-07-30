import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Toolbar,
    Stepper,
    Step,
    StepLabel,
    Paper,
    useMediaQuery,
    useTheme,
    MobileStepper,
    Button,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Backdrop,
    CircularProgress
} from '@mui/material';

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import PublishIcon from '@mui/icons-material/Publish';

import { useNavigate } from 'react-router-dom';
import routes from '../Config/routes';
import { useCreatorAuth } from '../Hooks/creator-use-auth';

import AlertDialog from '../Components/AlertDialog';
import useAlertDialog from '../Components/useAlertDialog';
import BlitzHeader from '../Components/BlitzHeader';
import OnboardPage1 from './onboardPage1';
import OnboardPage2 from './onboardPage2';
import OnboardPage3 from './onboardPage3';
import ConsentForm from './CreatorPages/popups/consentform';
import client from '../API'
import { useGoogleLogin } from '@react-oauth/google';


function getSteps() {
    return ['Your Information', 'Platform and Rates', 'Connect Accounts'];
}

const CreatorOnboard = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const navigate = useNavigate();
    const { login } = useCreatorAuth();

    const [step, setStep] = useState(0);
    const { dialogState, openDialog, closeDialog } = useAlertDialog();
    const [consentForm, setConsentForm] = useState(false);
    const [status, setStatus] = useState("Associate");
    const [googleToken, setGoogleToken] = useState(null);

    const page1 = useRef(null);
    const page2 = useRef(null);
    const page3 = useRef(null);

    // Dialog state
    const [disclaimer, setOpenDisclaimer] = useState(false);
    const [loading, setLoading] = useState(false);

    const scope = [
        'https://mail.google.com/',
        'profile',
        'email',
    ];

    const scopeString = scope.reduce((accum, currSco, currIdx) => (accum + (currIdx == 0 ? '' : ' ') + currSco), '');

    useEffect(() => {
        setOpenDisclaimer(true);
    }, []);

    const getPage1 = (data) => {
        page1.current=data;
        console.log("Data 1: ", data);
        setStep(1);
    }

    const getPage2 = (data) => {
        page2.current=data;
        console.log("Data 2: ", data);
        setStep(2);
    }

    const getPage3 = (data) => {
        console.log("Data 3: ", data);
        page3.current=data;

        setLoading(true);

        if (status === "Partner") {
            googleLogin(); // Proceed with Google sign-in if consented
        }
        else {
            handleSaveCreator();
        }
    }

    const redirectLogin = () => {
        navigate(routes.creatorLogin);
    }

    const redirectStripe = () => {
        const redirectUri = `https://blitzpay.pro/creatorconnect/start/stripe`;
        window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            handleSaveCreator(tokenResponse.code);
        },
        onError: errorResponse => {
            openDialog("Error", `Error getting Partner permissions: ${errorResponse}`, closeDialog, closeDialog, "Ok", null);
            setLoading(false);
        },
        scope: scopeString,
        flow: "auth-code"
    });

    const handleSaveCreator = async (googleCode = null) => {
        console.log("Google code:", googleCode);
        const payload = {
            ...page1.current,
            ...page2.current,
            ...page3.current,
            google_token: googleToken,
            google_code: googleCode,
            status: status
        };

        console.log("Payload: ", payload);

        try {
            const response = await client.creatorConnect.onboard(payload);
            if (page3.current.payout_preferred === 'PayPal') {
                openDialog("Success", "Account created succesfully", redirectLogin, redirectLogin, "Ok", null);
            }
            else {
                login(response);
                openDialog("Success", "Account created succesfully. You will now be redirected to Stripe to set up BlitzPay", redirectStripe, redirectStripe, "Ok", null);
            }
        } catch (error) {
            openDialog("Error", `${(error.response && error.response.data.error) ? error.response.data.error : error}. Your Google Login data has been blanked. Try again.`, closeDialog, closeDialog, "Ok", null);
            setGoogleToken(null);
            setLoading(false);
            console.error('Network error:', error);
        }
    };


    const handleStatusChange = (selectedStatus) => {
        setStatus(selectedStatus);
        if (selectedStatus === "Partner") {
            setConsentForm(true); // Open consent form dialog
        }
    };
    const handleConsentClose = (consented) => {
        setConsentForm(false);
        if (!consented) {
            setStatus("Associate"); // Revert status if not consented
        }
    };

    const onBlitzPay = () => {
        openDialog("BlitzPay", "When clicking on Submit, you'll be taken to our partner Stripe to fill out your payment information", closeDialog, closeDialog, "Ok", null);
    }

    const onGoogleToken = (token) => {
        setGoogleToken(token);
    }

    const onGoogleTokenError = () => {
        openDialog("Error", "Something went wrong login in with Google. Try again", closeDialog, closeDialog, "Ok", null);
        setGoogleToken(null);
    }

    const minWidth = isDesktop ? '40em' : '0';

    const canProgress = (step < 2 || ((status == "Associate" && googleToken != null) || (status == "Partner")))

    return (
        <>
            <BlitzHeader>
                <Typography variant='h6'>CreatorConnect</Typography>
            </BlitzHeader>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog alertState={dialogState}></AlertDialog>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Toolbar></Toolbar>
                {isDesktop && <Stepper component={Paper} activeStep={step} sx={{ paddingBlockStart: '2em', paddingBlockEnd: '2em', paddingInline: '10em', boxSizing: 'border-box', width:'100%' }} elevation={3}>
                    {getSteps().map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>}
                <Paper elevation={1} sx={{ maxWidth: isDesktop ? '60em' : '100vw', width: isDesktop ? 'auto' : '100%', marginBlock: isDesktop ? '2em' : 0, marginInline: '2em', padding: '2em', boxSizing: 'border-box', minHeight: isDesktop ? '0' : '100%' }}>
                    <Typography variant='h6'>{getSteps()[step]}</Typography>
                    <Divider sx={{ marginBlockEnd: '1em' }}></Divider>
                    {/*Page 1*/}
                    {step == 0 && <OnboardPage1 minWidth={minWidth} onFormSubmit={getPage1}></OnboardPage1>}
                    {/*Page 2*/}
                    {step == 1 && <OnboardPage2 minWidth={minWidth} onFormSubmit={getPage2}></OnboardPage2>}
                    {step == 2 && <OnboardPage3
                        minWidth={minWidth}
                        onFormSubmit={getPage3}
                        status={status}
                        onPartnerSelect={handleStatusChange}
                        onBlitzPay={onBlitzPay}
                        onGoogleToken={onGoogleToken}
                        onGoogleTokenError={onGoogleTokenError}
                    ></OnboardPage3>}
                </Paper>
            </Box>
            {isDesktop && <Box sx={(theme)=>({
                position: 'fixed',
                bottom: theme.spacing(2),
                right: theme.spacing(2),
                display: 'flex',
                alignItems: 'end',
                gap: theme.spacing(1),
            })}>
                <Fab
                    variant="contained"
                    color="secondary"
                    size='small'
                    disabled={step == 0}
                    onClick={() => setStep(step - 1)}
                >
                    <KeyboardArrowLeft />
                </Fab>
                <Fab
                    type='submit'
                    form='page-1'
                    variant="contained"
                    color="primary"
                    size='large'
                    disabled={!canProgress}
                >
                    {step < 2 && <KeyboardArrowRight />}
                    {step == 2 && <PublishIcon />}
                </Fab>
            </Box>}
            {!isDesktop && <>
                <Toolbar></Toolbar>
                <MobileStepper
                    variant="dots"
                    position='bottom'
                    steps={getSteps().length}
                    elevation={3}
                    activeStep={step}
                    sx={{ paddingInline: '2em' }}
                    nextButton={
                        <Button size="small"
                            type='submit'
                            form='page-1'
                            disabled={!canProgress}
                        >
                            {step < 2 ? "Next" : "Submit"}
                            {step < 2 && <KeyboardArrowRight />}
                        </Button>
                    }
                    backButton={
                        <Button size="small"
                            disabled={step == 0}
                            onClick={() => setStep(step - 1)}
                        >
                            Back
                            <KeyboardArrowLeft />
                        </Button>
                    }
                />
            </>
            }
            <ConsentForm open={consentForm} onClose={handleConsentClose}></ConsentForm>

            <Dialog open={disclaimer} onClose={() => setOpenDisclaimer(false)}>
                <DialogTitle>Signup Form Information</DialogTitle>
                <DialogContent>
                    <p>
                        This signup form is for joining into Blitz's CreatorConnect.
                        You will be available in the marketplace for companies to send campaigns directly to your email and
                        phone number. By joining in you are joining a community of thousands of creators world wide!
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDisclaimer(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CreatorOnboard;
