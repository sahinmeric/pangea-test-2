import React, { useState, useEffect } from "react";
import logo from "../globalAssets/platty.png";
import { Link as RouterLink } from "react-router-dom";
import useAuth from "../../Hooks/use-auth";
import routes from "../../Config/routes.js";
import client from "../../API";
import { useMutation } from "react-query";
import { Drawer, Box, Typography, List, ListItem, ListItemText, ListItemButton, Divider } from "@mui/material";
import { drawerWidth } from "../../Utils/constants.js";
import styles from "./NavBar.module.css"
import ListItemLink from "../ListItemLink.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Navbar = ({isDesktop=true, isOpen=true, onClose}) => {
  const { getCurrrentUser, isAuthorized } = useAuth();
  const userInfo = getCurrrentUser();

  const [companyData, setCompanyData] = useState({
    balance: "Loading...",
    credit_line: "Loading...",
    phphref: "",
    account_status: "Loading..."
  });

  const { mutate: fetchCompanyData } = useMutation(client.companies.listFetch, {
    onSuccess: (data) => {
      if (data && data.balance !== undefined && data.credit_line !== undefined) {
        setCompanyData({
          balance: `$${parseFloat(data.balance).toFixed(2)}`,
          credit_line: data.credit_line
            ? `$${parseFloat(data.credit_line).toFixed(2)}`
            : "No Credit Line Established",
          phphref: data.phphref || "",
          account_status: data.account_status || ""
        });
      } else {
        console.error("Received data is not in the expected format:", data);
      }
    },
    onError: (error) => {
      console.error("Error fetching company data:", error);
      setCompanyData({
        balance: "Error loading balance",
        credit_line: "Error loading credit line",
        phphref: "",
        account_status: "Error loading account status"
      });
    },
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
    <Drawer
      variant={isDesktop ? "permanent" : "temporary"}
      sx={{
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor:'#000 !important', backgroundImage:'none !important' },
      }}
      open={isDesktop||isOpen}
      onClose={onClose}
    >
      <Box className={styles.navbarHeader} sx={{marginInlineStart:1, display:{xs:'none', md: 'initial'}}}>
        <Box className={styles.logo}>
          <RouterLink to={isAuthorized ? routes.dashboard : routes.home}>
            <img src={logo} alt="Logo" />
          </RouterLink>
        </Box>
      </Box>
      <RouterLink to={routes.user} className={styles.user}>
        <Box className={styles.userTab} sx={{marginBlockStart:{xs:4,md:0}}}>
          <Box className={styles.userInfo}>
            {companyData.phphref && (
              <img
                src={companyData.phphref}
                alt="Company"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            )}
            <Typography variant="subtitle1" color={'text.secondary'}>Balance: {companyData.balance}</Typography>
            <Typography variant="subtitle1" color={'text.secondary'}>Credit Line: {companyData.credit_line}</Typography>
            <Typography variant="subtitle1" color={'text.secondary'}>
              {`${userInfo?.first_name ?? ""} ${userInfo?.last_name ?? ""} - ${userInfo?.company_name ?? ""}`}
            </Typography>
          </Box>
        </Box>
      </RouterLink>
      <Divider sx={{marginBlockStart:'1em'}} ></Divider>
      <List>
        <ListItem>
            <ListItemLink to={routes.dashboard}>
              Dashboard
            </ListItemLink>
        </ListItem>
        <ListItem>
            <ListItemLink to={routes.search}>
              Marketplace
            </ListItemLink>
        </ListItem>
        <ListItem>
            <ListItemLink to={routes.campaigns}>
              Projects
            </ListItemLink>
        </ListItem>
        <ListItem>
            <ListItemLink to={routes.blitzpay}>
              Blitz Pay
            </ListItemLink>
        </ListItem>
        <ListItem>
            <ListItemLink to={routes.invoicing}>
              Invoicing
            </ListItemLink>
        </ListItem>
        <ListItem>
            <ListItemLink to={routes.commisions}>
              Commissions
            </ListItemLink>
        </ListItem>
        {companyData.account_status == "Agency" && (
          <ListItem>
              <ListItemLink to={`/roster/${userInfo?.company_name}`}>
                My Roster
              </ListItemLink>
          </ListItem>
        )}
        {companyData.account_status == "AlphaFree" && (
          <ListItem>
              <ListItemLink to={routes.creatorCRMPublic}>
                Creator CRM
              </ListItemLink>
          </ListItem>
        )}
      </List>
    </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;
