import React, { memo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Link,
  CardMedia,
  Grid,
  Button,
  Box,
} from '@mui/material';
import profilePhoto from '../../../Components/globalAssets/ppfLogo.png'; // Placeholder for the profile photo
import CreatorHoverDialog from '../Creators/creatordetailsdialog';
import { useQuery } from 'react-query';
import API from '../../../API';

function CreatorContainers({
  creators,
  platform,
  selectedItems = new Set(), // Ensure selectedItems is at least an empty Set
  onCardClick,
}) {
  const [hoveredCreator, setHoveredCreator] = useState(null);

  const parseNumber = (numStr) => {
    if (numStr === null || numStr === undefined || numStr === 'N/A') {
      return 0; // Return 0 for non-numeric or absent values
    }
    return parseInt(numStr.replace(/,/g, ''), 10);
  };

  const { data: creatorDetails, isLoading } = useQuery(
    ['creatorDetails', hoveredCreator],
    () => API.creators.fetchDetails(hoveredCreator),
    {
      enabled: !!hoveredCreator, // Only run the query if hoveredCreator is set
    }
  );

  return (
    <Grid container spacing={2}>
      {creators.map((creator, index) => {
        const followerCount = parseNumber(creator[platform.toLowerCase()] || '0');
        const avgViews = parseNumber(creator.avg_views || '0'); // Default to '0' if avg_views is undefined
        let engagement = null;
        if (followerCount && avgViews) {
          engagement = (avgViews / followerCount) * 100; // calculate engagement percentage
        }

        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              onMouseEnter={() => setHoveredCreator(creator.creator)}
              onMouseLeave={() => setHoveredCreator(null)}
              sx={{ position: 'relative' }}
            >
              <Card
                onClick={() => onCardClick(creator.creator)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: selectedItems.has(creator.creator)
                    ? 'action.focus' // Light grey on selection
                    : 'background.paper', // Darker shade
                }}
              >
                <CardMedia
                  component='img'
                  height='140'
                  image={creator.pfphref || profilePhoto}
                  alt={creator.creator}
                />
                <CardContent>
                  <Typography variant='h5' component='div'>
                    @{creator.creator}
                  </Typography>
                  <Typography variant='body2'>Region: {creator.region}</Typography>
                  <Typography variant='body2'>
                    Followers: {creator[platform.toLowerCase()]}
                  </Typography>

                  <Link
                    href={creator[`${platform.toLowerCase()}_link`]}
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{ color: 'text.secondary' }}
                  >
                    View {platform} Profile
                  </Link>
                  <Button
                    variant='contained'
                    color='primary'
                    href={`https://blitzpay.pro/creators/${creator.creator}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ display: 'block', marginTop: '8px' }}
                  >
                    View Media Kit
                  </Button>
                  {engagement && (
                    <Typography variant='body2'>
                      Engagement: {engagement.toFixed(2)}%
                    </Typography>
                  )}
                </CardContent>
              </Card>
             
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default memo(CreatorContainers);
