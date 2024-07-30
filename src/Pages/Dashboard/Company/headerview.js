import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyleButtonGroup = (theme) => ({
  display: 'flex',
  justifyContent: 'center',
  width:'fit-content',
  marginInline:'auto'
});

const HeaderButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  flexGrow: 1,
}));

const classes = {
  companies: {
    backgroundColor: '#3f51b5',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#303f9f',
    },
  },
  campaigns: {
    backgroundColor: '#009688',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#00796b',
    },
  },
  payouts: {
    backgroundColor: '#f44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  invoices: {
    backgroundColor: '#ff9800',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#f57c00',
    },
  },
  creators: {
    backgroundColor: '#4caf50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
};

const HeaderView = ({ setCurrentView }) => {

  return (
    <Box sx={StyleButtonGroup}>
      <HeaderButton sx={classes.companies} onClick={() => setCurrentView('companies')}>Company Details</HeaderButton>
      <HeaderButton sx={classes.campaigns} onClick={() => setCurrentView('campaigns')}>Campaigns</HeaderButton>
      <HeaderButton sx={classes.payouts} onClick={() => setCurrentView('payouts')}>Payouts</HeaderButton>
      <HeaderButton sx={classes.invoices} onClick={() => setCurrentView('invoices')}>Invoices</HeaderButton>
      <HeaderButton sx={classes.creators} onClick={() => setCurrentView('creators')}>Creators</HeaderButton>
      <HeaderButton sx={classes.companies} onClick={() => setCurrentView('admin')}>Admin</HeaderButton>
      <HeaderButton sx={classes.payouts} onClick={() => setCurrentView('marketing')}>Marketing</HeaderButton>
      <HeaderButton sx={classes.creators} onClick={() => setCurrentView('creatorCRM')}>Creator CRM</HeaderButton>
      <HeaderButton sx={classes.invoices} onClick={() => setCurrentView('creatorSMS')}>Creator SMS</HeaderButton>
      <HeaderButton sx={classes.invoices} onClick={() => setCurrentView('partnerships')}>Partnerships</HeaderButton>
      <HeaderButton sx={classes.invoices} onClick={() => setCurrentView('users')}>Users</HeaderButton>

    </Box>
  );
};

export default HeaderView;