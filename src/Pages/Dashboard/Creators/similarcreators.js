import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { useMutation } from 'react-query';
import { CSVLink } from 'react-csv';
import client from '../../../API';
import CreatorContainers from '../Search/creatorcontainersearch';
import BlitzHeader from '../../../Components/BlitzHeader';

const SimilarCreators = () => {
  const { creatorId } = useParams();
  const [creatorDetails, setCreatorDetails] = useState(null);
  const [similarCreators, setSimilarCreators] = useState([]);
  const [visibleCreators, setVisibleCreators] = useState(6);
  const [showPretty, setShowPretty] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [primaryMarket, setPrimaryMarket] = useState('');

  const { mutate: fetchCreatorDetails, isLoading: isFetchingCreator, isError: isErrorCreator } = useMutation(
    () => client.creators.fetchDetails(creatorId),
    {
      onSuccess: (data) => {
        setCreatorDetails(data);
        setPrimaryMarket(data.primary_market); // Set the initial primary market
        console.log('Creator details fetched:', data);
      },
      onError: (error) => {
        console.error('Failed to fetch creator details:', error);
      },
    }
  );

  const { mutate: fetchSimilarCreators } = useMutation(client.creators.list, {
    onSuccess: (data) => {
      const allCreators = data || [];
      console.log('All creators fetched:', allCreators);

      const filteredCreators = allCreators.filter(creator => {
        const regionMatch = creator.region === creatorDetails?.region;
        const primaryMarketMatch = creator.primary_market === primaryMarket;
        const rateMatch = creator.tiktok_brand >= 0.5 * creatorDetails?.tiktok_brand && creator.tiktok_brand <= 1.5 * creatorDetails?.tiktok_brand;

        console.log(`Creator ${creator.creatorId}: regionMatch=${regionMatch}, primaryMarketMatch=${primaryMarketMatch}, rateMatch=${rateMatch}`);
        return regionMatch && primaryMarketMatch && rateMatch;
      });

      // Randomize the filtered creators
      const randomizedCreators = filteredCreators.sort(() => 0.5 - Math.random());
      console.log('Filtered and randomized creators:', randomizedCreators);
      setSimilarCreators(randomizedCreators);
    },
    onError: (error) => {
      console.error('Failed to fetch similar creators:', error);
      setSimilarCreators([]);
    },
  });

  useEffect(() => {
    fetchCreatorDetails();
  }, [creatorId, fetchCreatorDetails]);

  useEffect(() => {
    if (creatorDetails) {
      console.log('Fetching similar creators with region:', creatorDetails.region);
      fetchSimilarCreators();
    }
  }, [creatorDetails, primaryMarket, fetchSimilarCreators]);

  const handleShowMore = () => {
    setVisibleCreators((prev) => prev + 6);
  };

  const toggleView = () => {
    setShowPretty(!showPretty);
  };

  const handleSelectItem = (creatorId) => {
    setSelectedItems(prevSelectedItems => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(creatorId)) {
        newSelectedItems.delete(creatorId);
      } else {
        newSelectedItems.add(creatorId);
      }
      return newSelectedItems;
    });
  };

  const generateCsvData = () => {
    return similarCreators.map(creator => ({
      creator: creator.creator,
      primary_market: creator.primary_market,
      region: creator.region,
      ig_reels_brand: creator.ig_reels_brand,
      tiktok_brand: creator.tiktok_brand,
    }));
  };

  if (isFetchingCreator) return 'Loading creator details...';
  if (isErrorCreator || !creatorDetails) return 'No creator details found';

  return (
    <>
      <BlitzHeader />
      <Box sx={{ mt: 10, mb: 4 }}>
        <Typography variant="h3">Similar Creators to {creatorDetails?.creator}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ mr: 2 }}>
            You are looking at
          </Typography>
          <FormControl variant="outlined">
            <InputLabel id="primary-market-select-label">Primary Market</InputLabel>
            <Select
              labelId="primary-market-select-label"
              id="primary-market-select"
              value={primaryMarket}
              onChange={(e) => setPrimaryMarket(e.target.value)}
              label="Primary Market"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {[
                "Activist",
                "Artist",
                "Beauty",
                "Cars",
                "Cosplay",
                "Comedy",
                "Country",
                "Dance",
                "Educational",
                "Fashion",
                "Fitness",
                "Food",
                "Gaming",
                "Lifestyle",
                "Music",
                "Pets",
                "Reviews",
                "Sports",
                "Tech",
                "Thirst Trap",
                "Travel",
              ].map((market) => (
                <MenuItem key={market} value={market}>
                  {market}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1">
            {/* Add creator details typography here */}
            Region: {creatorDetails.region}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Button onClick={toggleView}>
          {showPretty ? "Show CSV" : "Make it Pretty"}
        </Button>
        <Button>
          <CSVLink data={generateCsvData()} filename="similar_creators.csv" style={{ textDecoration: 'none', color: 'inherit' }}>
            Download CSV
          </CSVLink>
        </Button>
        {showPretty ? (
          <CreatorContainers
            creators={similarCreators.slice(0, visibleCreators)}
            platform="TikTok" // or any other platform you need to pass
            selectedItems={selectedItems}
            onCardClick={handleSelectItem}
          />
        ) : (
          <Box sx={{ overflowX: 'auto', mt: 2 }}>
            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">Select</TableCell>
                    <TableCell>Creator</TableCell>
                    <TableCell>Primary Market</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>IG Reels Sound</TableCell>
                    <TableCell>IG Reels Brand</TableCell>
                    <TableCell>TikTok Sound</TableCell>
                    <TableCell>TikTok Brand</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {similarCreators.slice(0, visibleCreators).map((creator) => (
                    <TableRow key={creator.creatorId}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedItems.has(creator.creatorId)}
                          onChange={() => handleSelectItem(creator.creatorId)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>{creator.creator}</TableCell>
                      <TableCell>{creator.primary_market}</TableCell>
                      <TableCell>{creator.region}</TableCell>
                      <TableCell>${creator.ig_reels_sound}</TableCell>
                      <TableCell>${creator.ig_reels_brand}</TableCell>
                      <TableCell>${creator.tiktok_sound}</TableCell>
                      <TableCell>${creator.tiktok_brand}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        )}
        {visibleCreators < similarCreators.length && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" onClick={handleShowMore}>
              Show More
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default SimilarCreators;
