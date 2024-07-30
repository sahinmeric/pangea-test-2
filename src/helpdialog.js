import React from 'react';
import { Dialog, DialogTitle, DialogContent, Tabs, Tab, Box } from '@mui/material';
//import { useLocation } from 'react-router-dom';

const helpContent = {
  '/home': {
    video: 'https://www.youtube.com/embed/home_video_id',
    text: 'This is the home page where you can find the latest updates and featured content.',
  },
  '/login': {
    video: 'https://www.youtube.com/embed/login_video_id',
    text: 'This is the login page where you can enter your credentials to access your account.',
  },
  '/register': {
    video: 'https://www.youtube.com/embed/register_video_id',
    text: 'This is the registration page where you can create a new account.',
  },
  '/dashboard': {
    video: 'https://www.youtube.com/embed/dashboard_video_id',
    text: 'This is the dashboard where you can view your overall account status and access different features.',
  },
  // Add more routes and their respective help content as needed
};

const HelpDialog = ({ open, onClose }) => {
  const [value, setValue] = React.useState(0);
  //const location = useLocation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //const currentPath = location.pathname;
  const content = helpContent['/home'] || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Help</DialogTitle>
      <DialogContent>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Video" />
          <Tab label="Explanation" />
        </Tabs>
        <Box>
          {value === 0 && (
            <Box sx={{ mt: 2 }}>
              {content.video ? (
                <iframe
                  width="100%"
                  height="400"
                  src={content.video}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Help Video"
                ></iframe>
              ) : (
                <p>No video available for this page.</p>
              )}
            </Box>
          )}
          {value === 1 && (
            <Box sx={{ mt: 2 }}>
              <p>{content.text || 'No explanation available for this page.'}</p>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
