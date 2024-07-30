import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Box,
  Container,
  Grid,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import blitzLogo from "../../Components/globalAssets/platty.png";
import Divider from "@mui/material/Divider";
import BlitzHeader from "../../Components/BlitzHeader";

const BlitzSummary = () => {
  const navigate = useNavigate();
  const handleSignUp = () => navigate("/login");
  const handleCreatorLogin = () => navigate("/creatorconnect/Start");
  const handleAccess = () => navigate("/requestAccess");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <BlitzHeader>
        <Box
          flexGrow={1}
          justifyContent="center"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
        </Box>

        <Box sx={{ flexGrow: { xs: 0, md: 2 }, display: { xs: 'none', md: 'flex' } }}></Box>
        <Button color="inherit" onClick={handleSignUp}>
          Login
        </Button>
        <Button color="inherit" onClick={handleCreatorLogin}>
          Creator Login
        </Button>
        <Button color="inherit" onClick={handleAccess}>
          Request Access
        </Button>
      </BlitzHeader>

      <Box
        className="starry-background"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff !important',
          backgroundColor: '#000 !important',
          paddingTop: '64px' // Add space between Blitz Product Summary and the AppBar
        }}
      >
        <Typography variant="h4" sx={{ mt: 2 }} className="animated-slide-up">
          Blitz Summary
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }} className="animated-slide-up">
          Pay - Create - Accelerate
        </Typography>
        <Container sx={{ mt: 4, textAlign: 'left', color: '#fff' }}>
          
          <Typography variant="h2" sx={{ mb: 2 }}>About Blitz</Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Blitz is a comprehensive AI-powered collaboration management software, meticulously designed to streamline operations for the entire creator economy. 
            From offering the largest influencer marketplace in the world, to enabling brands and agencies to easily create unlimited campaigns and partnerships, automate their collaborations, and manage the finances of all projects,
            Blitz emerges as a refreshing take on the creator economy.
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4 }}>
            "With Blitz, collaboration for creators has never been smoother and more efficient."
          </Typography>

          <Typography variant="h2" sx={{ mb: 2 }}>Accounts Payable / Vendors Overview</Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
           BlitzPay, a feature of Blitz, is used all over the world, by companies wanting to speed-up and enhance their collaboration efforts by allowing for advancing payments to creators, for a nominal fee.
          </Typography>
          <Typography variant="h2" sx={{ mb: 2 }}>Marketplace & Collaboration Features</Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            AI - Powered Campaign Management<br />
            Data-Driven Reporting<br />
            Immense Personalization for Partnerships, Legal, and More<br />
            Seamless Integration and Efficiency<br />
            Transparency in Negotiation and Price<br />
            Compliance and Security<br />
            Scalability and Growth
          </Typography>
          <Typography variant="h2" sx={{ mb: 2 }}>For Creators</Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            AI Manager - Improve Deal flow instantly<br />
            Access to the world's top brands<br />
            Personalized Business Management Suite<br />
            Financial Services for Tax and Investment Planning<br />
          </Typography>

          <Typography variant="h2" sx={{ mb: 2 }}>Creators can Accept, Decline, or Negotiate their deals seemlessly</Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Brands and Creators can work through Blitz to accept, decline, or negotiate collaboration opportunities, ensuring each partnership meets top quality expectations and standards.
          </Typography>

          <Typography variant="h2" sx={{ mb: 2 }}>Creators - Increase Your Revenue by 2-3x</Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            By leveraging Blitz's powerful tools and resources, you can significantly increase your revenue, achieving 2-3x growth.
          </Typography>
          
        </Container>
      </Box>

      <Box sx={{ mt: 4, backgroundColor: "#000 !important", p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          © 2024 Pangea, Inc. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default BlitzSummary;
