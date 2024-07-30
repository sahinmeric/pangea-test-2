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
import imageOnRight from "../../Components/globalAssets/blitzBoltBlack.png";
import Divider from "@mui/material/Divider";
import routes from "../../Config/routes";
import {
  BenefitsSection,
  CreatorsSection,
  PricingSection,
  AboutSection,
} from "./homeExtended";
import BlitzHeader from "../../Components/BlitzHeader";
import ClientsSection from "./clientSection";
import TestimonialsSection from "./testimonials";
import TopCreatorPartnersSection from "./topcreators";

const Home = () => {
  const navigate = useNavigate();
  const handleSignUp = () => navigate(routes.login);
  const handleCreatorLogin = () => navigate(routes.creatorConnectStart);
  const handleAccess = () => navigate(routes.requestAccess);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const benefitsRef = React.useRef(null);
  const creatorsRef = React.useRef(null);
  const aboutRef = React.useRef(null);

  return (
    <>
      <BlitzHeader>
        <Box
          justifyContent="center"
          flex={1}
          sx={{ display: { xs: 'none', lg: 'flex' } }}
        >
          <Typography
            variant="h6"
            className="menu-item"
            sx={{ marginLeft: "2.5%", marginRight: "2.5%" }}
            onClick={() =>
              benefitsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              })
            }
          >
            Benefits
          </Typography>

          <Typography
            variant="h6"
            sx={{ marginLeft: "2.5%", marginRight: "2.5%" }}
            className="menu-item"
            onClick={() =>
              creatorsRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              })
            }
          >
            Creators
          </Typography>

          <Typography
            variant="h6"
            sx={{ marginLeft: "2.5%", marginRight: "2.5%" }}
            className="menu-item"
            onClick={() =>
              aboutRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              })
            }
          >
            About
          </Typography>
        </Box>
        <Box
          flex={{xs:2, lg:1}}
          display='flex'
          justifyContent='end'
          alignItems='center'
          >
          <Button color="inherit" onClick={handleSignUp}>
            Login
          </Button>
          <Button color="inherit" onClick={handleCreatorLogin}>
            Creator Login
          </Button>
          <Button color="inherit" onClick={handleAccess} sx={{display:{xs:'none', sm:'inline-flex'}}}>
            Request Access
          </Button>
        </Box>
      </BlitzHeader>
      {/* Main content section */}
      <Box
        className="starry-background"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff !important',
          backgroundColor: '#000 !important',
        }}
      >
        <img
          src={blitzLogo}
          alt="Blitz logo"
          style={{ maxWidth: '60%', height: 'auto' }}
          className="animated-fade-in"
        />
        <Typography variant="h4" sx={{ mt: 2 }} className="animated-slide-up">
          Pay - Create - Accelerate
        </Typography>
      </Box>

      {/* Full Page Sections */}

      <BenefitsSection ref={benefitsRef} />
      <ClientsSection />

      <TestimonialsSection />
      <TopCreatorPartnersSection />

      <CreatorsSection ref={creatorsRef} />
      <PricingSection />
      <AboutSection ref={aboutRef} />

      {/* Footer */}
      <Box sx={{ mt: 4, backgroundColor: "#000 !important", p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          © 2023 Pangea, Inc. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Home;
