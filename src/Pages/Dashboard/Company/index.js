import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import CompanyDetailsView from './sections/companydetailsviews';
import CampaignDetailsView from './sections/campaignsdetailsviews';
import InvoiceDetailsView from './sections/invoicedetailsviews';
import PayoutDetailsView from './sections/payoutdetailsview';
import CreatorDetailsView from './sections/creatordetailsview';
import UserDetailsView from './sections/admindetailviews';
import MarketingView from './sections/marketingComponents/marketingdetailview';
import CreatorCRMView from './sections/creatorCRM/creatorCRMview';
import CreatorSMS from './sections/creatorCRM/creatorSMS';
import useAuth from '../../../Hooks/use-auth';
import UserAdminView from './sections/newUserParntershipComponents/userdetailsview';
import PartnershipsDetailsView from './sections/newUserParntershipComponents/partnershipsdetailsview';
import ReferralDetailsView from './sections/newUserParntershipComponents/referralsdetailsview';
import SMSChannels from './sections/newUserParntershipComponents/textchannels';

const StyledTabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
}));

const tabLabels = [
  { label: 'Company Details', value: 'companies' },
  { label: 'Campaigns', value: 'campaigns' },
  { label: 'Payouts', value: 'payouts' },
  { label: 'Invoices', value: 'invoices' },
  { label: 'Creators', value: 'creators' },
  { label: 'KPIs', value: 'admin' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Creator CRM', value: 'creatorCRM' },
  { label: 'Creator SMS', value: 'creatorSMS' },
  { label: 'Users', value: 'users' },
  { label: 'Partnerships', value: 'partnerships' },
  { label: 'Referals/Commissions', value: 'commissions' },
  { label: 'SMS Channels', value: 'smsChannels' }, // New tab
];

const CompanyList = () => {
  const [currentView, setCurrentView] = useState('companies');
  const { getCurrrentUser } = useAuth();

  const renderView = () => {
    switch (currentView) {
      case 'creators':
        return <CreatorDetailsView />;
      case 'admin':
        return <UserDetailsView />;
      case 'campaigns':
        return <CampaignDetailsView />;
      case 'payouts':
        return <PayoutDetailsView />;
      case 'invoices':
        return <InvoiceDetailsView />;
      case 'marketing':
        return <MarketingView />;
      case 'creatorCRM':
        return <CreatorCRMView />;
      case 'companies':
        return <CompanyDetailsView />;
      case 'users':
        return <UserAdminView />;
      case 'creatorSMS':
        return <CreatorSMS />;
      case 'partnerships':
        return <PartnershipsDetailsView />;
      case 'commissions':
        return <ReferralDetailsView />;
      case 'smsChannels': // New case
        return <SMSChannels />;
      default:
        return <CompanyDetailsView />;
    }
  };

  return (
    <>
      {(getCurrrentUser()?.type ?? 'none') === 'admin' ? (
        <>
          <StyledAppBar position="static">
            <Tabs
              value={currentView}
              onChange={(e, newValue) => setCurrentView(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabLabels.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </StyledAppBar>
          <StyledPaper>
            <TransitionGroup>
              <CSSTransition key={currentView} classNames="fade" timeout={300}>
                <StyledTabPanel>{renderView()}</StyledTabPanel>
              </CSSTransition>
            </TransitionGroup>
          </StyledPaper>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="textSecondary">Sorry, You are not allowed to view this page.</Typography>
        </Box>
      )}
    </>
  );
};

export default CompanyList;
