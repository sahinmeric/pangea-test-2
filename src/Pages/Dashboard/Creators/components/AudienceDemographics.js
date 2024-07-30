import React, { useState, useMemo } from 'react';
import { Box, Typography, Select, MenuItem, Tabs, Tab, Grid, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { generateRainbowColors } from '../../../../Utils/constants';
import styles from "../styles.module.css";

const SelectPlatform = ({ state, setState, menuItems }) => (
  <Select value={state} onChange={(event) => setState(event.target.value)}>
    {menuItems.map((item, index) => (
      <MenuItem key={index} value={index}>{item.platform.name}</MenuItem>
    ))}
  </Select>
);

const AudienceDemographics = ({ creatorDetails, followersData }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [platformCountries, setPlatformCountries] = useState('0');
  const [platformGender, setPlatformGender] = useState('0');
  const [platformAge, setPlatformAge] = useState('0');

  const intPlatformCountry = parseInt(platformCountries);
  const intPlatformGender = parseInt(platformGender);
  const intPlatformAge = parseInt(platformAge);

  const ageDemos = useMemo(() => {
    if (!creatorDetails || !creatorDetails.public || creatorDetails.public.length < 1) return undefined;
    return creatorDetails.public.map((demo) => demo.audience_data.reduce((acc, entry) => {
      const { age_range, value } = entry;
      const existingEntry = acc.find(item => item.name === age_range);

      if (existingEntry) {
        existingEntry.percent += Math.round(value);
      } else {
        acc.push({ name: age_range, percent: Math.round(value) });
      }

      return acc;
    }, []));
  }, [creatorDetails]);

  const ageDemoColors = ageDemos === undefined ? [] : generateRainbowColors(ageDemos[intPlatformAge]?.length || 0);

  const genderDemos = creatorDetails && creatorDetails.public && creatorDetails.public.length > 0 ? creatorDetails.public.map(
    (demo) => ([
      {
        name: 'Male',
        value: demo.audience_data.reduce((accum, item) => {
          if (item.gender.toLowerCase() === 'male') accum += Math.round(item.value);
          return accum;
        }, 0)
      },
      {
        name: 'Female',
        value: demo.audience_data.reduce((accum, item) => {
          if (item.gender.toLowerCase() === 'female') accum += Math.round(item.value);
          return accum;
        }, 0)
      }
    ])
  ) : undefined;

  const handleTabChange = (event, newValue) => {
    setSelectedPlatform(newValue);
    setPlatformCountries(newValue.toString());
    setPlatformGender(newValue.toString());
    setPlatformAge(newValue.toString());
  };

  return (
    <Box className={styles.audienceDemographics} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>Followers by Platform</Typography>
        <Tabs value={selectedPlatform} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {creatorDetails.public.map((platform, index) => (
            <Tab key={index} label={platform.platform.name} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid item xs={12}>
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6">Followers by Platform</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={followersData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      label
                    >
                      {followersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28"][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6">Countries</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={creatorDetails.public[intPlatformCountry]?.country_data} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="code" type="category" />
                    <Bar layout="vertical" dataKey="value" fill={["#0088FE", "#00C49F", "#FFBB28"][intPlatformCountry]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6">Gender Demographic</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={genderDemos[intPlatformGender]}
                      cx="50%"
                      cy="50%"
                      dataKey="value"
                      nameKey="name"
                      outerRadius="70%"
                      label
                    >
                      {genderDemos[intPlatformGender].map((entry, index) => (
                        <Cell key={index} fill={["#DDDDDD", "#999999"][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6">Age Demographic</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageDemos[intPlatformAge]} layout="vertical">
                    <YAxis dataKey="name" type="category" />
                    <XAxis dataKey="percent" type="number" unit="%" />
                    <Tooltip labelStyle={{ color: '#000' }} />
                    <Bar layout="vertical" dataKey="percent" name="Percentage" unit="%">
                      {ageDemos[intPlatformAge].map((entry, index) => (
                        <Cell key={index} fill={ageDemoColors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AudienceDemographics;