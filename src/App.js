import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import PageTitle from './Components/PageTitle.js'; // Adjust the import path as needed
import Main from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Login/Register';
import Dashboard from './Pages/Dashboard/dashboard/dashboard.js';
import User from './Pages/Dashboard/user.js';
import Invoicing from './Pages/Dashboard/invoicing/invoicing.js';
import Campaigns from './Pages/Dashboard/Campaigns/campaigns';
import Search from './Pages/Dashboard/Search/search';
import CreatorSignup from './Pages/Home/auxLinks/creatorSignup.js';
import BlitzPay from './Pages/BlitzPay/blitzpay.js';
import AddCreators from './Pages/Dashboard/Campaigns/addCreators.js'; // Adjust the path as necessary
import routes from './Config/routes.js';
import PrivateRoute from './Lib/private-route.js';
import CreatorRoute from './Lib/creator-route.js';
import CompanyList from './Pages/Dashboard/Company/index.js';
import CampaignDetailsPage from './Pages/Dashboard/Campaigns/individualcampaigns/campaignDetailsPage.js'; // Adjust the path as needed
import CreatorDetailsPage from './Pages/Dashboard/Creators/creatorDetailsPage.js';
import AgencyDetailsPage from './Pages/Dashboard/Creators/agency/agencyDetail.js';
import CreatorConnect from './CreatorUser/CreatorPages/creatorConnect.js';
import CreatorCampaigns from './CreatorUser/CreatorPages/Dashboard/creatorCampaigns.js';
import CreatorStart from './CreatorUser/CreatorPages/Dashboard/start.js';
import CreatorLogin from './CreatorUser/creatorLogin.js';
import CreatorStripeId from './CreatorUser/CreatorPages/Dashboard/stripe.js';
import Commissions from './Pages/Misc/commisisons/commisions.js';
import CreatorInvoicePage from './CreatorUser/CreatorPages/Dashboard/misc/creatorinvoicepage.js';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

import { QueryClient, QueryClientProvider } from 'react-query';
import { CreatorAuthProvider } from './Hooks/creator-use-auth.js';
import InvoicePage from './Pages/Dashboard/invoicing/invoicepage.js';
import CreatorOnboard from './CreatorUser/creatorOnboard.js';
import { Fab } from '@mui/material';
import CreatorCRMViewPublic from './Pages/Misc/creatorCRM/creatorCRM.js';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import HelpIcon from '@mui/icons-material/Help'; // Import Help icon
import HelpDialog from './helpdialog.js'; // Adjust the path as necessary
import InternalLogin from './CreatorUser/internalLogin.js';
import RequestAccess from './Pages/Home/auxLinks/requestAccess.js';
import SimilarCreators from './Pages/Dashboard/Creators/similarcreators.js';
import DemoRegister from './Pages/Home/auxLinks/demoRegister.js';
import BlitzSummary from './Pages/Home/blitzsummary.js';
import CreatorCampaignTimelines from './Pages/Dashboard/Campaigns/individualcampaigns/creatorcampaigntimelines.js';
import CreatorDeliverables from './Pages/Dashboard/Campaigns/projectcomponents/deliverablepage.js';
import BlitzRoute from './Components/BlitzRoute.js';
import TempCreatorPage from './Pages/Dashboard/Creators/tempcreatorpage.js';
const Home = React.lazy(() => import('./Pages/Home/Home'));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [isDark, setIsDark] = useState(true);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false); // State for HelpDialog
  const queryClient = new QueryClient();

  const toggleHelpDialog = () => {
    setHelpDialogOpen(!helpDialogOpen);
  };

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      {true&&<Fab
        variant="contained"
        size='large'
        sx={(theme)=>({
          position: 'fixed',
          bottom: theme.spacing(2),
          left: theme.spacing(2),
          backgroundColor: theme.palette.mode == 'dark' ? "#222" : "#eee",
          color: theme.palette.mode == 'dark' ? "#eee" : "#222",
          zIndex: theme.zIndex.drawer + 1,
        })}
        onClick={() => { setIsDark(!isDark); }}
      >
        {!isDark && <LightModeIcon></LightModeIcon>}
        {isDark && <DarkModeIcon></DarkModeIcon>}
      </Fab>}
      {true&&<Fab
        variant="contained"
        size='large'
        sx={(theme)=>({
          position: 'fixed',
          bottom: theme.spacing(2),
          left: theme.spacing(10), // Adjust to place it next to the light/dark mode button
          backgroundColor: theme.palette.mode == 'dark' ? "#222" : "#eee",
          color: theme.palette.mode == 'dark' ? "#eee" : "#222",
          zIndex: theme.zIndex.drawer + 1,
        })}
        onClick={toggleHelpDialog}
      >
        <HelpIcon />
      </Fab>}
      <HelpDialog open={helpDialogOpen} onClose={toggleHelpDialog} /> {/* Render HelpDialog */}
      <CreatorAuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              {/*--- Public pages ---*/}
              <Route path={routes.base} element={<Navigate to={routes.home} />} />
              <Route path={routes.home} element={<><PageTitle title="Home - Blitz" /><Main><Home /></Main></>} />
              <Route path={routes.tempCreator} element={<><PageTitle title="Your Temp page - Blitz" /><TempCreatorPage /></>} />

              <Route path={routes.campaignReport} element={<><PageTitle title="Campaign Details - Blitz" /><CampaignDetailsPage /></>} />
              <Route path={routes.creatorMediaKit} element={<><PageTitle title="Creator Media Kit - Blitz" /><CreatorDetailsPage /></>} />
              <Route path={`${routes.creatorMediaKit}/promotional/:discount`} element={<CreatorDetailsPage />} />
              <Route path={routes.roster} element={<AgencyDetailsPage />} />
              
              <Route path={`${routes.creatorSignup}/:manager`} element={<><PageTitle title="Creator Signup - Blitz" /><CreatorSignup /></>} />
              <Route path={`${routes.creatorMediaKit}/similar`} element={<><PageTitle title="Similar Creators - Blitz" /><SimilarCreators /></>} />
              <Route path={`${routes.demoRegister}/:ref`} element={<> <PageTitle title="Register Demo Account - Blitz" /> <DemoRegister /> </>} />
              <Route path={routes.about} element={<> <PageTitle title="About - Blitz" /> <BlitzSummary /> </>} />
              <Route path={routes.creatorCampaignTimeline} element={<><PageTitle title="Creator Campaign Timelines - Blitz" /><CreatorCampaignTimelines /></>} />
              <Route path={routes.deliverablePage} element={<><PageTitle title="Deliverables - Blitz" /><CreatorDeliverables /></>} />

              <Route path={`${routes.invoicing}/:invoiceId`} element={<><PageTitle title="Invoice - Blitz" /><InvoicePage /></>} />
              <Route path={`${routes.creatorPayoutInvoices}/:id`} element={<><PageTitle title="Creator Invoice - Blitz" /><CreatorInvoicePage /></>} />
              {/*---Sign ups and Registers---*/}
              <Route path={routes.login} element={<><PageTitle title="Login - Blitz" /><Login /></>} />
              <Route path={routes.register} element={<><PageTitle title="Register - Blitz" /><Register /></>} />
              <Route path={routes.requestAccess} element={<><PageTitle title="Request Access - Blitz" /><RequestAccess /></>} />
              <Route path={`${routes.requestAccess}/:ref`} element={<><PageTitle title="Request Access - Blitz" /><RequestAccess /></>} />
              <Route path={routes.creatorSignup} element={<><PageTitle title="Creator Signup - Blitz" /><CreatorSignup /></>} />
              <Route path={routes.creatorConnectOnboard} element={<GoogleOAuthProvider clientId={googleClientId}><PageTitle title="Creator Connect - Blitz" /><CreatorOnboard></CreatorOnboard></GoogleOAuthProvider>} />
              <Route path={routes.creatorConnect} element={<GoogleOAuthProvider clientId={googleClientId}><PageTitle title="Creator Connect - Blitz" /><CreatorConnect /></GoogleOAuthProvider>} />
              <Route path={routes.creatorLogin} element={<GoogleOAuthProvider clientId={googleClientId}><PageTitle title="Creator Login - Blitz" /><CreatorLogin /></GoogleOAuthProvider>} />
              {/*---INTERNAL LOGIN FOR TESTING IN LOCAL, COMMENT OUT WHEN NOT IN USE---*/}
              {<Route path={routes.internalLogin} element={<><PageTitle title="Creator Login - Blitz" /><InternalLogin/></>}/>}
              {/*---Creator Connect routes---*/}
              <Route path={routes.creatorConnectStart} element={<CreatorRoute><PageTitle title="Creator Start - Blitz" /><CreatorStart /></CreatorRoute>} />
              <Route path={routes.creatorConnectStripe} element={<CreatorRoute><PageTitle title="Creator Start - Blitz" /><CreatorStripeId /></CreatorRoute>} />
              <Route path={routes.creatorConnectCampaigns} element={<CreatorRoute><PageTitle title="Creator Campaigns - Blitz" /><CreatorCampaigns /></CreatorRoute>} />
              {/*---Private routes with header ---*/}
              <Route element={<BlitzRoute></BlitzRoute>}>
                <Route path={routes.dashboard} element={<PrivateRoute><PageTitle title="Dashboard - Blitz" /><Dashboard /></PrivateRoute>} />
                <Route path={routes.user} element={<PrivateRoute><PageTitle title="User Management - Blitz" /><User /></PrivateRoute>} />
                <Route path={routes.invoicing} element={<PrivateRoute><PageTitle title="Invoicing - Blitz" /><Invoicing /></PrivateRoute>} />
                <Route path={routes.campaigns} element={<PrivateRoute><PageTitle title="Campaigns - Blitz" /><Campaigns /></PrivateRoute>} />
                <Route path={routes.search} element={<PrivateRoute><PageTitle title="Search - Blitz" /><Search /></PrivateRoute>} />
                <Route path={routes.blitzpay} element={<PrivateRoute><PageTitle title="Blitz - Payouts" /><BlitzPay /></PrivateRoute>} />
                <Route path={routes.addCreators} element={<PrivateRoute><PageTitle title="Add Creators - Blitz" /><AddCreators /></PrivateRoute>} />
                <Route path={routes.company} element={<PrivateRoute><PageTitle title="Company List - Blitz" /><CompanyList /></PrivateRoute>} />
                <Route path={routes.commisions} element={<PrivateRoute><PageTitle title="Your Commisisons - Blitz" /> <Commissions /></PrivateRoute>} />
                <Route path={routes.creatorCRMPublic} element={<> <PageTitle title="Creator CRM - Blitz" /> <CreatorCRMViewPublic /> </>} />
              </Route>

              <Route path="*" element={<><PageTitle title="404 Not Found - Blitz" /><Navigate to={routes.home} /></>} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </CreatorAuthProvider>
    </ThemeProvider>
  );
}

export default App;
