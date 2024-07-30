import React, { useState } from 'react';
import { Box, Typography, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CreatorCampaigns from './creatorCampaigns';
import CreatorDashboard from './creatorDashboard';
import PayoutsInvoicing from './payoutsinvoicing';
import Pitch from './pitch';
import CreatorPartnerships from './partnershipcomps/creatorpartnerships';
import { useCreatorAuth } from '../../../Hooks/creator-use-auth';
import EditCreator from './userInfo';
import BlitzHeader from '../../../Components/BlitzHeader';
import CreatorMore from './misc/creatorMore';
import BrandEmails from './brandEmails';
import { globalStyles } from '../../../Utils/Styles';
const styles = {
  menuButton: {
    marginRight: 2,
  },
  drawer: {
    width: 250,
  },
  drawerPaper: {
    width: 250,
    backgroundColor: '#1a1a1a !important',
    color: '#f5f5f5 !important',
    height:'100%',
    backgroundImage:'none !important' 
  },
  content: {
    flexGrow: 1,
    padding: 3,
    minHeight: '100vh',
  },
  appBar: {
    position: 'relative',
  },
  logo: {
    display: 'block',
    margin: 'auto',
    padding: 2,
    maxWidth: '100%',
    height: 'auto',
  },
};

const renderComponent = (creatorToken, activeComponent, setActiveComponent) => {
  switch (activeComponent) {
    case 'Campaigns':
      return <CreatorCampaigns username={creatorToken.creator_user.username} />;
    case 'Dashboard':
      return <CreatorDashboard username={creatorToken.creator_user.username} setActiveComponent={setActiveComponent} />;
    case 'Payouts Invoicing':
      return <PayoutsInvoicing username={creatorToken.creator_user.username} />;
    case 'Pitch':
      return <Pitch creatorUsername={creatorToken.creator_user.username} />;
    case 'Partnerships':
      return <CreatorPartnerships username={creatorToken.creator_user.username} />;
    case 'Edit':
      return <EditCreator />;
    case 'Deals Emails':
      return <BrandEmails/>;
    case 'More':
        return <CreatorMore username={creatorToken.creator_user.username} />;
    default:
      return null;
  }
};

const CreatorStart = () => {
  const classes = styles;
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { creatorToken } = useCreatorAuth();

  if (!creatorToken) return <>Loading</>;

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleListItemClick = (component) => {
    setActiveComponent(component);
    setDrawerOpen(false);
  };

  return (
    <>
      <BlitzHeader menuButton={
        <IconButton edge="start" onClick={toggleDrawer(true)} sx={{color:'#FFF'}}>
          <MenuIcon />
        </IconButton>
      }>
        <Typography variant="h6">
          <span style={globalStyles.singleLine}>Creator Dashboard</span>
        </Typography>
      </BlitzHeader>
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={classes.drawer}
        PaperProps={{sx:classes.drawerPaper}}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {['Dashboard', 'Campaigns', 'Payouts Invoicing', 'Pitch', 'Partnerships', 'Edit', 'Deals Emails', 'More'].map((text) => (
              <ListItem key={text} onClick={() => handleListItemClick(text)}>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box sx={(theme) => ({
        paddingInline: theme.spacing(2)
      })}>
        <Toolbar />
        <Typography variant="h5" gutterBottom sx={{marginBlockStart:2}}>
          Welcome, {creatorToken.creator_user.username}!
        </Typography>
        {renderComponent(creatorToken, activeComponent, setActiveComponent)}
      </Box>
    </>
  );
};

export default CreatorStart;
