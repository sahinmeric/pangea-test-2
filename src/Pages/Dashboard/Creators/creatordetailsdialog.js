import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import profilePhoto from '../../../Components/globalAssets/ppfLogo.png'; // Placeholder for the profile photo

const CreatorHoverDialog = ({ creator }) => {
  const followersData = creator.followersData || [];
  const genderDemos = creator.genderDemos || [];
  const ageDemos = creator.ageDemos || [];

  return (
    <Card className='hover-dialog' sx={{ position: 'absolute', top: 0, left: 0, zIndex: 10, display: 'flex', flexDirection: 'row' }}>
      <CardMedia
        component='img'
        height='140'
        image={creator.pfphref || profilePhoto}
        alt={creator.name}
        sx={{ width: '140px', flexShrink: 0 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant='h6' gutterBottom>
          @{creator.creator}
        </Typography>
        <Typography variant='body2'>Following: {creator.following}</Typography>
        <Typography variant='body2'>Recommended Price: ${creator.price} USD</Typography>
        <Typography variant='body2'>
          <a href={creator.platformLink ?? ''} target='_blank' rel='noopener noreferrer'>
            View on {creator.promotionPlatform ?? ''}
          </a>
        </Typography>
        <Box>
          <Typography variant='body2'>Followers by Platform</Typography>
          <ResponsiveContainer width='100%' height={100}>
            <PieChart>
              <Pie data={followersData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius='50%' label>
                {followersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box>
          <Typography variant='body2'>Gender Demographic</Typography>
          <ResponsiveContainer width='100%' height={100}>
            <PieChart>
              <Pie data={genderDemos} cx='50%' cy='50%' dataKey='value' nameKey='name' outerRadius={'50%'} label>
                {genderDemos.map((entry, index) => (
                  <Cell key={index} fill={['#DDDDDD', '#999999'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box>
          <Typography variant='body2'>Age Demographic</Typography>
          <ResponsiveContainer width='100%' height={150}>
            <BarChart data={ageDemos} layout='vertical'>
              <YAxis dataKey='name' type='category' />
              <XAxis dataKey='percent' type='number' unit='%' />
              <Tooltip labelStyle={{ color: '#000' }} />
              <Bar layout='vertical' dataKey={'percent'} name='Percentage' unit='%'>
                {ageDemos.map((entry, index) => (
                  <Cell key={index} fill={['#8884d8', '#82ca9d', '#ffc658'][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatorHoverDialog;
