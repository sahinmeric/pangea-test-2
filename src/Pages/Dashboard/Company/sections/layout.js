// Layout.js
import React from 'react';
import { drawerWidth } from "../../../../Utils/constants";
import { Box } from '@mui/material';

const classes = {
  content: {
    paddingLeft: drawerWidth, // Use a consistent drawer width for the padding
    width: `calc(100% - ${drawerWidth}px)`,
    overflowY: "auto",
  }
};

const Layout = ({ children }) => {

  return (
    <Box sx={classes.content}>
      {children}
    </Box>
  );
};

export default Layout;