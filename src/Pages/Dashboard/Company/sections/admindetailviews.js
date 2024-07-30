import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CampaignsTable from './adminComponents/CampaignKpis';
import CreatorsTable from './adminComponents/CreatorKpis';
import UsersKPI from './adminComponents/UserKpis';
import FinancialsKPI from './adminComponents/FinanceKpis';
import PartnerKpis from './adminComponents/partnerKpis';
import Layout from './layout';
import { StyleStickyButtonContainter, StyleContent, StylePaper } from '../../../../Utils/ThemedStyles';
import KpiCard from './adminComponents/kpiCard';

const classes = {
  filter: {
    minWidth: 120,
  },
};

const Dashboard = () => {
  const [componentFilter, setComponentFilter] = useState("All");
  const [userKpi, setUserKpi] = useState({ progress: 0 });
  const [creatorKpi, setCreatorKpi] = useState({ progress: 0 });
  const [campaignKpi, setCampaignKpi] = useState({ progress: 0 });

  // Hardcoded goals
  const userGoal = 5;
  const creatorGoal = 10;
  const campaignGoal = 300000; // Adjusted for total sum

  const handleFilterChange = (event) => {
    setComponentFilter(event.target.value);
  };

  return (
    <Box sx={StyleContent}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <KpiCard title="User Signups" goal={userGoal} progress={userKpi.progress} />
        <KpiCard title="Creator Partners" goal={creatorGoal} progress={creatorKpi.progress} />
        <KpiCard title="Campaigns" goal={campaignGoal} progress={campaignKpi.progress} />
      </Box>
      <Box sx={StyleStickyButtonContainter}>
        <FormControl variant="outlined" sx={classes.filter}>
          <InputLabel>Component</InputLabel>
          <Select
            value={componentFilter}
            onChange={handleFilterChange}
            label="Component"
          >
            <MenuItem value="All">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Campaigns">Campaign KPIs</MenuItem>
            <MenuItem value="Users">User KPIs</MenuItem>
            <MenuItem value="Financials">Financial KPIs</MenuItem>
            <MenuItem value="Partners">Partner KPIs</MenuItem>
            <MenuItem value="Creators">General Creator KPIs</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {(componentFilter === "All" || componentFilter === "Campaigns") && (
        <Paper sx={StylePaper}>
          <Typography variant="h6" gutterBottom>
            Campaign KPIs
          </Typography>
          <CampaignsTable setCampaignKpi={setCampaignKpi} />
        </Paper>
      )}

      {(componentFilter === "All" || componentFilter === "Users") && (
        <Paper sx={StylePaper}>
          <Typography variant="h6" gutterBottom>
            User KPIs
          </Typography>
          <UsersKPI setUserKpi={setUserKpi} />
        </Paper>
      )}

      {(componentFilter === "All" || componentFilter === "Financials") && (
        <Paper sx={StylePaper}>
          <Typography variant="h6" gutterBottom>
            Financial KPIs
          </Typography>
          <FinancialsKPI />
        </Paper>
      )}

      {(componentFilter === "All" || componentFilter === "Partners") && (
        <Paper sx={StylePaper}>
          <Typography variant="h6" gutterBottom>
            Partner KPIs
          </Typography>
          <PartnerKpis />
        </Paper>
      )}

      {(componentFilter === "All" || componentFilter === "Creators") && (
        <Paper sx={StylePaper}>
          <Typography variant="h6" gutterBottom>
            General Creator KPIs
          </Typography>
          <CreatorsTable setCreatorKpi={setCreatorKpi} />
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
