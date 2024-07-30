import React from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SecurityIcon from "@mui/icons-material/Security";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import imageOnRight from "../../Components/globalAssets/blitzBoltBlack.png";

export const HomePage = React.forwardRef((props, ref) => (
  <Container ref={ref} maxWidth="lg" component="main" sx={{ my: 4 }}>
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Welcome to Blitz</Typography>
      <Typography paragraph>
        Blitz is a comprehensive campaign management software designed to streamline operations both internally for The Culture Club team and externally for our clients. From campaign initiation to creator payouts, Blitz handles it all with precision and efficiency.
      </Typography>
    </Paper>
    <AboutSection />
    <BenefitsSection />
    <CreatorsSection />
    <PricingSection />
  </Container>
));

const SectionContainer = ({ children, sx }) => (
  <Box sx={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundColor: 'black', // Ensure background is black
    backgroundPosition: 'center',
    color: 'white', // Default text color set to white
    ...sx
  }}>
    {children}
  </Box>
);

// Define each section using the common SectionContainer
export const BenefitsSection = React.forwardRef((props, ref) => {
  const theme = useTheme();

  return (
    <SectionContainer ref={ref}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: '800px', bgcolor: 'rgba(0, 0, 0, 0.7)' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <AccountBalanceWalletIcon fontSize="large" />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Get Paid Faster
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accelerate your earnings with Blitz's rapid payment system, ensuring that creators receive payments within 24 hours of campaign completion.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <SecurityIcon fontSize="large" />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Secure Transactions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All transactions are protected with top-tier security measures to ensure your data and earnings are safe.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <StarBorderIcon fontSize="large" />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Rewarding Partnerships
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Build lasting partnerships with top brands and receive rewards for your continued collaboration and success.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </SectionContainer>
  );
});

export const CreatorsSection = React.forwardRef((props, ref) => {
  const theme = useTheme();

  return (
    <SectionContainer ref={ref}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: '800px', bgcolor: 'rgba(0, 0, 0, 0.7)' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <StarBorderIcon fontSize="large" />
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Global Creator Marketplace
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore a worldwide network of creative talents and brands. Blitz connects you to a global marketplace where you can manage deals, collaborate, and expand your creative reach effortlessly.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Manage Deals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seamlessly manage all your deals in one place, ensuring you never miss an opportunity to collaborate and grow your brand.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                  Expand Your Reach
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect with creators and brands from around the world to expand your reach and make a global impact.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </SectionContainer>
  );
});


export const PricingSection = React.forwardRef((props, ref) => {
  const theme = useTheme();

  return (
    <SectionContainer ref={ref}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: '800px', bgcolor: 'rgba(0, 0, 0, 0.7)' }}>
        <Typography variant="h3" gutterBottom color="white">
          Campaign Management and Reporting
        </Typography>
        <Typography paragraph color="white">
          From campaign setup to completion, track every detail with Blitz's advanced management tools. Gain insights with detailed performance analytics to optimize your campaigns and achieve higher success rates.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Basic Plan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Perfect for small teams just getting started.
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                  $19/month
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Up to 10 campaigns per month" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Basic analytics" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email support" />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Choose Plan</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Pro Plan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ideal for growing teams that need more control.
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                  $49/month
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Up to 50 campaigns per month" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Advanced analytics" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Priority email support" />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Choose Plan</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </SectionContainer>
  );
});

export const AboutSection = React.forwardRef((props, ref) => {
  const theme = useTheme();

  return (
    <SectionContainer ref={ref}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: '800px', bgcolor: 'rgba(0, 0, 0, 0.7)' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Our Mission
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  To provide seamless and efficient campaign management solutions, empowering creators and brands to achieve their fullest potential.
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 2 }}>
                  We streamline your operations, offering a centralized platform for managing negotiations, campaigns, and rapid payments.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: theme.palette.background.paper }}>
              <CardMedia
                component="img"
                height="140"
                image={imageOnRight}
                alt="Blitz Logo"
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  Our Vision
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  To be the leading platform in campaign management, known for innovation, efficiency, and excellence in service.
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 2 }}>
                  Enhance your operational efficiency and simplify complex processes with our comprehensive software solution.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="large" variant="contained" color="primary">Join Us</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </SectionContainer>
  );
});