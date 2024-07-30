import React, { useState, useEffect, useMemo, memo } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box
} from "@mui/material";

import { useMutation } from "react-query";
import client from "../../../API";
import CreatorDialog from "./creatorintake";
import CreatorContainers from "./creatorcontainersearch";
import { styled } from '@mui/material/styles';

const StyleContent = (theme) => ({
  paddingTop: theme.spacing(3),
  overflowX: "auto",
  paddingLeft: theme.spacing(2),
  marginBlockEnd: theme.spacing(2),
  width: '100%',
});

const StyleFilterContainer = (theme) => ({
  marginBottom: theme.spacing(3),
});

const StyleFormControl = (theme) => ({
  margin: theme.spacing(2),
  width: 200,
});

const StyleButton = (theme) => ({
  margin: theme.spacing(1),
});

const StyleCsvSection = (theme) => ({
  overflowX: "auto",
  marginLeft: theme.spacing(1),
});


const classes = {
  csvTable: {
    width: "100%",
    tableLayout: "auto",
  },
  linkCell: {
    maxWidth: 100,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }
};

const CustomFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(2),
  width: 200,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const cityOptions = {
  Miami: ["miami", "MIA", "south florida", "fl ", "FL"],
  "Los Angeles": ["los angeles", "la", "socal", "southern california"],
  "New York": ["new york", "nyc", "ny"],
  London: ["london", "england", "UK"],
  "Mexico City": ["mexico city", "cdmx"],
  Dallas: ["dallas", "dfw", "texas"],
  Houston: ["houston", "htx", "texas"]
};

const LeftColumn = memo(function LeftColumn({ onCreatorSelect, selectedItems }) {
  const [filter, setFilter] = useState("");
  const [region, setRegion] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [promotionType, setPromotionType] = useState("Brand");
  const [data, setData] = useState([]);
  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");
  const [furtherLocation, setFurtherLocation] = useState("");
  const [avgViews, setAvgViews] = useState("");
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);
  const [primaryMarket, setPrimaryMarket] = useState("");
  const [followerRange, setFollowerRange] = useState("");
  const [cpmRange, setCpmRange] = useState("");
  const [showPretty, setShowPretty] = useState(true);
  const [priceRange, setPriceRange] = useState("");
  const [creatorType, setCreatorType] = useState("");
  const [city, setCity] = useState("");
  const [demoGender, setdemoGender] = useState('');
  const [demoCountry, setdemoCountry] = useState('');
  const [demoAge, setdemoAge] = useState('')

  const handleResetFilters = () => {
    setRegion("");
    setPlatform("TikTok");
    setPromotionType("Brand");
    setRace("");
    setGender("");
    setFurtherLocation("");
    setFilter("");
    setAvgViews("");
    setPrimaryMarket("");
    setFollowerRange("");
    setCpmRange("");
    setPriceRange("");
    setCreatorType("");
    setCity("");
  };

  const { mutate: fetchData } = useMutation(client.creators.list, {
    onSuccess: async (data) => {
      const sortByKey = platform === "TikTok" ? "tiktok" : "instagram";
      let creators = [...data];
      creators.sort((a, b) => {
        const aValue =
          a[sortByKey] === "N/A"
            ? -1
            : parseInt((a[sortByKey] ?? "0").replace(/,/g, ""), 10);
        const bValue =
          b[sortByKey] === "N/A"
            ? -1
            : parseInt((b[sortByKey] ?? "0").replace(/,/g, ""), 10);
        return bValue - aValue;
      });

      let sortedAndUpdatedData = sortCreators([...creators]);
      sortedAndUpdatedData = sortedAndUpdatedData.map((creator) => {
        const rate = creator[platformToKey[platform][0]];
        const avgViews = creator.avg_views;

        const cpm = calculateCPM(rate, avgViews);

        const updatedCreator = { ...creator };
        Object.keys(platPromoToKey).forEach((plat) => {
          Object.values(platPromoToKey[plat]).forEach((key) => {
            if (updatedCreator[key]) {
              const price = parseFloat(updatedCreator[key].replace(/[^0-9.-]+/g, ""));
              if (!isNaN(price)) {
                updatedCreator[key] = `$${(price * 1.2).toFixed(2)}`;
              }
            }
          });
        });

        return { ...updatedCreator, cpm };
      });

      setData(sortedAndUpdatedData);
    },
    onError: (error) => {
      console.error("Failed to fetch data:", error);
    },
  });

  useEffect(() => {
    fetchData();
  }, [platform]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };
  const handlePrimaryMarketChange = (event) => {
    setPrimaryMarket(event.target.value);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCreatorSubmit = (formData) => {
    console.log(formData);
    setIsCreatorDialogOpen(false);
  };

  const sortCreators = (creators) => {
    return creators.sort((a, b) => {
      // Priority 1: Partner status
      if (a.status === "Partner" && b.status !== "Partner") return -1;
      if (b.status === "Partner" && a.status !== "Partner") return 1;

      // Priority 2: Follower count
      const aFollowers = parseNumber(a.followers);
      const bFollowers = parseNumber(b.followers);
      if (aFollowers !== bFollowers) {
        return bFollowers - aFollowers; // More followers first
      }

      // Priority 3: Average views
      const aViews = parseNumber(a.avg_views);
      const bViews = parseNumber(b.avg_views);
      if (aViews !== bViews) {
        return bViews - aViews; // More views first
      }

      // Priority 4: Recency (considering both date_added and last_updated)
      const aRecency = new Date(a.last_updated || a.date_added);
      const bRecency = new Date(b.last_updated || b.date_added);
      return bRecency - aRecency; // Newest first
    });
  };

  const parseNumber = (value) => {
    if (!value || value === "N/A") return 0;
    return parseInt(value.replace(/,/g, ""), 10);
  };

  const platformToKey = {
    TikTok: ["tiktok", "tiktok_sound", "tiktok_brand"],
    Instagram: ["instagram", "ig_reels_sound", "ig_reels_brand"],
    Youtube: ["youtube", "rate_2530s", "integration_3045s", "integration_60s", "integration_90s", "integration_3m"],
  };

  const platPromoToKey = {
    TikTok: { "Sound": "tiktok_sound", "Brand": "tiktok_brand" },
    Instagram: { "Feed Post": "ig_feed_Post", "Sound": "ig_reels_sound", "Brand": "ig_reels_brand" },
    Youtube: { "3045s Integration": "integration_3045s", "60s Integration": "integration_60s", "shorts": "shorts" },
  };

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
    setPromotionType(promotionTypeOptions[e.target.value]?.[0] || "");
  };

  const handleSelectItem = (creatorId) => {
    const selectedCreator = data.find(
      (creator) => creator.creator === creatorId,
    );
    if (!selectedCreator) {
      console.warn(`Item with ID ${creatorId} not found.`);
      return;
    }

    let priceKey = platPromoToKey[platform][promotionType];
    const price = selectedCreator[priceKey] ? selectedCreator[priceKey] : "Price Unavailable";

    const platformLinkKey = `${platform} Link`;
    const platformLink = selectedCreator[headerToKeyMap[platformLinkKey]];
    const followingCount = selectedCreator[platformToKey[platform][0]];

    const relevantData = {
      id: selectedCreator.creator,
      name: selectedCreator.creator,
      price: price,
      following: followingCount,
      promotionPlatform: platform,
      promotionType: promotionType,
      platformLink: platformLink,
      pfphref: selectedCreator.pfphref
    };

    if (onCreatorSelect) {
      onCreatorSelect(creatorId, relevantData);
    }
  };

  const handlePromotionTypeChange = (e) => {
    setPromotionType(e.target.value);
  };

  const headerToKeyMap = {
    Creator: "creator",
    TikTok: "tiktok",
    Instagram: "instagram",
    Youtube: "youtube",
    "Geolocation/Gender/Ethnicity": "geolocation_gender_ethnicity",
    "Primary Market": "primary_market",
    "Content Style": "notes_content_style",
    "TikTok Sound": "tiktok_sound",
    "TikTok Brand": "tiktok_brand",
    "IG Reels Sound": "ig_reels_sound",
    "IG Reels Brand": "ig_reels_brand",
    "IG Feed Post": "ig_feed_post",
    "Instagram Link": "instagram_link",
    "TikTok Live": "tiktok_live",
    "TikTok Link": "tiktok_link",
    "Youtube Link": "youtube_link",
    "AVG Views": "avg_views",
    "3045s Integration": "integration_3045s",
    "60s Integration": "integration_60s",
    "shorts": "shorts"
  };

  const promotionTypeOptions = {
    TikTok: ["Sound", "Brand", "Livestream"],
    Instagram: ["Sound", "Brand", "Feed Post"],
    Youtube: ["3045s Integration", "60s Integration", "shorts"],
  };

  const headers = {
    TikTok: [
      "Creator",
      "TikTok",
      "Geolocation/Gender/Ethnicity",
      "Primary Market",
      "Content Style",
      "AVG Views",
    ],
    Instagram: [
      "Creator",
      "Instagram",
      "Geolocation/Gender/Ethnicity",
      "Primary Market",
      "Content Style",
      "Instagram Link",
      "AVG Views",
    ],
    Youtube: [
      "Creator",
      "Youtube",
      "Geolocation/Gender/Ethnicity",
      "Primary Market",
      "Content Style",
      "Youtube Link",
      "AVG Views",
    ],
  };

  const platPromoToHead = {
    TikTok: { "Sound": "TikTok Sound", "Brand": "TikTok Brand", "Livestream": "TikTok Live" },
    Instagram: { "Sound": "IG Reels Sound", "Brand": "IG Reels Brand", "Feed Post": "IG Feed Post" },
    Youtube: { "3045s Integration": "3045s Integration", "60s Integration": "60s Integration", "shorts": "shorts" },
  };

  const platformHeaders = headers[platform];
  const promoHeader = platPromoToHead[platform][promotionType];
  if (promoHeader)
    platformHeaders.splice(-2, 0, promoHeader);

  const parseFollowerCount = (followerString) => {
    if (!followerString || followerString === "N/A") return 0;
    return parseInt(followerString.replace(/,/g, ""), 10) || 0;
  };

  const followerRangeMatch = (followerCount) => {
    switch (followerRange) {
      case "100k-1m":
        return followerCount >= 100000 && followerCount <= 1000000;
      case "1m-5m":
        return followerCount > 1000000 && followerCount <= 5000000;
      case "5m+":
        return followerCount > 5000000;
      default:
        return true;
    }
  };

  const calculateCPM = (rate, avgViews) => {
    if (!rate || !avgViews || rate === "N/A" || avgViews === "N/A") {
      return null;
    }
    const numericalRate = parseInt(rate.replace(/[^0-9]/g, ""), 10);
    const numericalViews = parseInt(avgViews.replace(/[^0-9]/g, ""), 10);

    if (isNaN(numericalRate) || isNaN(numericalViews)) {
      return null;
    }
    return (numericalRate / numericalViews) * 1000;
  };

  const priceRangeMatch = (price) => {
    if (!price || price === "Price Unavailable") return false;
    const numericalPrice = parseInt(price.replace(/[^0-9]/g, ""), 10);
    switch (priceRange) {
      case "0-500":
        return numericalPrice >= 0 && numericalPrice <= 500;
      case "500-1500":
        return numericalPrice > 500 && numericalPrice <= 1500;
      case "1500-5000":
        return numericalPrice > 1500 && numericalPrice <= 5000;
      case "5000+":
        return numericalPrice > 5000;
      default:
        return true;
    }
  };

  const emptyCountry = { code: 'N/A', value: Number.NEGATIVE_INFINITY };
  const emptyAge = { age_range: 'N/A', value: Number.NEGATIVE_INFINITY };
  const emptyGender = { name: 'N/A', value: Number.NEGATIVE_INFINITY };

  const highestValueCountry = (publicData) => {
    return publicData.reduce((max, demo) => {
      const demoMax = demo.country_data.reduce((ctrMax, country) => {
        if (country.value > ctrMax.value)
          ctrMax = country;
        return ctrMax;
      }, emptyCountry);
      if (demoMax.value > max.value)
        max = demoMax;
      return max;
    }, emptyCountry);
  }

  const higherValueAge = (publicData) => {
    const publicByAge = publicData.map((demo) => demo.audience_data.reduce((acc, entry) => {
      const { age_range, value } = entry;
      // Find entry.
      const existingEntry = acc.find(item => item.age_range === age_range);
      if (existingEntry) {
        existingEntry.value += Math.round(value);
      } else {
        // Add entry if not found
        acc.push({ age_range: age_range, value: Math.round(value) });
      }
      return acc;
    }, [])
    )
    return publicByAge.reduce((max, demo) => {
      const demoMax = demo.reduce((ageMax, ageGroup) => {
        if (ageGroup.value > ageMax.value)
          ageMax = ageGroup;
        return ageMax;
      }, emptyAge);
      if (demoMax.value > max.value)
        max = demoMax;
      return max;
    }, emptyAge);
  }

  const higherValueGender = (publicData) => {
    const publicByGender = publicData.map(
      (demo) => ([
        {
          name: 'Male',
          value: demo.audience_data.reduce((accum, item) => {
            if (item.gender.toLowerCase() === 'male')
              accum += Math.round(item.value);
            return accum;
          }, 0)
        },
        {
          name: 'Female',
          value: demo.audience_data.reduce((accum, item) => {
            if (item.gender.toLowerCase() === 'female')
              accum += Math.round(item.value);
            return accum;
          }, 0)
        }
      ])
    )

    return publicByGender.reduce((max, demo) => {
      const demoMax = demo.reduce((genderMax, genderGroup) => {
        if (genderGroup.value > genderMax.value)
          genderMax = genderGroup;
        return genderMax;
      }, emptyGender);
      if (demoMax.value > max.value)
        max = demoMax;
      return max;
    }, emptyGender);
  }



  const filteredData = useMemo(() => data.filter((creator) => {
    const platformKeys = platformToKey[platform];
    const isPlatformDataPresent = platformKeys.some(
      (key) => {
        return creator[key] && creator[key] !== "N/A";
      }
    );
    if (!isPlatformDataPresent) return false;

    const currPromotionKey = platPromoToKey[platform][promotionType];

    const promoTypeMatch = creator[currPromotionKey] && creator[currPromotionKey] !== "N/A";
    const primaryMarketMatch =
      !primaryMarket || creator.primary_market === primaryMarket;
    const followerCount = parseFollowerCount(creator[platformToKey[platform][0]]);

    const raceGenderLocationMatch =
      race === "" || creator.geolocation_gender_ethnicity.includes(race);
    const genderMatch =
      gender === "" || creator.geolocation_gender_ethnicity.includes(gender);
    const locationMatch =
      furtherLocation === "" ||
      creator.geolocation_gender_ethnicity.includes(furtherLocation);

    let avgViewsMatch = true;
    const parseViews = (viewsString) => {
      if (!viewsString) {
        console.log("AVG Views is undefined or null.");
        return 0;
      }
      const parsedNumber = parseInt(viewsString.replace(/,/g, ""), 10) || 0;
      console.log(`Parsed AVG Views: ${parsedNumber}`);
      return parsedNumber;
    };

    if (avgViews !== "") {
      const avgViewsValue = parseViews(creator.avg_views);
      console.log(
        `AVG Views value for creator ${creator.creator}: ${avgViewsValue}`,
      );

      switch (avgViews) {
        case "10-50000":
          avgViewsMatch = avgViewsValue >= 10 && avgViewsValue <= 50000;
          break;
        case "50000-100000":
          avgViewsMatch = avgViewsValue > 50000 && avgViewsValue <= 100000;
          break;
        case "100000+":
          avgViewsMatch = avgViewsValue > 100000;
          break;
        default:
          avgViewsMatch = true;
      }
    }

    let demoCountryMatch = true;
    if (demoCountry != '') {
      const maxCountr = highestValueCountry(creator.public);
      demoCountryMatch = (maxCountr.code.toLocaleLowerCase() == demoCountry.toLocaleLowerCase());
    }

    let demoAgeMatch = true;
    if (demoAge != '') {
      const maxAge = higherValueAge(creator.public);
      demoAgeMatch = (maxAge.age_range.toLocaleLowerCase() == demoAge.toLocaleLowerCase());
    }

    let demoGenderMatch = true;
    if (demoGender != '') {
      const maxGender = higherValueGender(creator.public);
      demoGenderMatch = (maxGender.name.toLocaleLowerCase() == demoGender.toLocaleLowerCase());
    }

    const regionMatch = !region || creator.region === region;
    const cpmRangeMatch =
      cpmRange === "" ||
      (cpmRange === "0-10" && creator.cpm >= 0 && creator.cpm <= 10) ||
      (cpmRange === "10-25" && creator.cpm > 10 && creator.cpm <= 25) ||
      (cpmRange === "25+" && creator.cpm > 25);

    const cityMatch = !city || cityOptions[city].some((abbreviation) => creator.geolocation_gender_ethnicity.toLowerCase().includes(abbreviation));

    const searchMatch =
      filter === "" ||
      Object.values(creator).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(filter),
      );

    const priceMatch = priceRangeMatch(creator[currPromotionKey]);

    const creatorTypeMatch = !creatorType || creator.creator_type === creatorType;

    return (
      promoTypeMatch &&
      primaryMarketMatch &&
      raceGenderLocationMatch &&
      genderMatch &&
      locationMatch &&
      avgViewsMatch &&
      searchMatch &&
      regionMatch &&
      followerRangeMatch(followerCount) &&
      cpmRangeMatch &&
      priceMatch &&
      creatorTypeMatch &&
      cityMatch &&
      demoCountryMatch &&
      demoAgeMatch &&
      demoGenderMatch
    );
  }), [data, platform, cpmRange, avgViews, region, gender, race, furtherLocation, primaryMarket, followerRange, priceRange, filter, promotionType, city, demoCountry, demoAge, demoGender]);

  const toggleView = () => {
    setShowPretty(!showPretty);
  };

  const generateCellContent = (creator, header) => {
    const key = headerToKeyMap[header];
    let content = creator[key];
    if (header === "Creator" && content !== "\\N" && content !== "N/A") {
      return (
        <Box sx={classes.linkCell}>
          <a
            href={`https://blitzpay.pro/creators/${creator.creator}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        </Box>
      );
    } else if (
      header.endsWith("Link") &&
      content !== "\\N" &&
      content !== "N/A"
    ) {
      return (
        <Box sx={classes.linkCell}>
          <a href={content} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        </Box>
      );
    } else if (content === "\\N") {
      return <span>N/A</span>;
    } else if (content == null || content == undefined) {
      return <span>N/A</span>;
    }

    return content;
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ paddingInline: { xs: 1, md: 0 } }}>
        <Paper sx={StyleContent}>
          <Grid item xs={12} sx={StyleFilterContainer}>
            <CustomFormControl variant="outlined">
              <InputLabel id="creator-type-label" >Creator Type</InputLabel>
              <Select
                labelId="creator-type-label"
                id="creator-type-select"
                value={creatorType}
                onChange={(e) => setCreatorType(e.target.value)}
                label="Creator Type"
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                <MenuItem value="creator">Creator</MenuItem>
                <MenuItem value="athlete">Athlete</MenuItem>
                <MenuItem value="meme page">Meme Page</MenuItem>
                <MenuItem value="Show">Show</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="region-select-label">Select Region</InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                value={region}
                onChange={handleRegionChange}
                label="Select Region"
              >
                <MenuItem value="">
                  <em>ALL</em>
                </MenuItem>
                <MenuItem value="NACAUKAUS">
                  USA, Canada, UK, Australia
                </MenuItem>
                <MenuItem value="EU">EU</MenuItem>
                <MenuItem value="LATAM">LATAM</MenuItem>
                <MenuItem value="Asia">Asia</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="platform-select-label">Platform</InputLabel>
              <Select
                labelId="platform-select-label"
                id="platform-select"
                value={platform}
                onChange={handlePlatformChange}
                label="Platform"
              >
                <MenuItem value="TikTok">TikTok</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Youtube">Youtube</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="promotion-type-label">Promotion Type</InputLabel>
              <Select
                labelId="promotion-type-label"
                id="promotion-type-select"
                value={promotionType}
                onChange={handlePromotionTypeChange}
                label="Promotion Type"
              >
                {platform &&
                  promotionTypeOptions[platform].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="race-select-label">Race</InputLabel>
              <Select
                labelId="race-select-label"
                id="race-select"
                value={race}
                onChange={(e) => setRace(e.target.value)}
                label="Race"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Asian">Asian</MenuItem>
                <MenuItem value="Black">Black</MenuItem>
                <MenuItem value="Hispanic">Hispanic</MenuItem>
                <MenuItem value="White">White</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="gender-select-label">Gender</InputLabel>
              <Select
                labelId="gender-select-label"
                id="gender-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label="Gender"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="further-location-select-label">
                Location
              </InputLabel>
              <Select
                labelId="further-location-select-label"
                id="further-location-select"
                value={furtherLocation}
                onChange={(e) => setFurtherLocation(e.target.value)}
                label="Further Location"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="US">US</MenuItem>
                <MenuItem value="UK">UK</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="Mexico">Mexico</MenuItem>
                <MenuItem value="Brazil">Brazil</MenuItem>
                <MenuItem value="Colombia">Colombia</MenuItem>
                <MenuItem value="Phillipines">Phillipines</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="primary-market-select-label">
                Primary Market
              </InputLabel>
              <Select
                labelId="primary-market-select-label"
                id="primary-market-select"
                value={primaryMarket}
                onChange={handlePrimaryMarketChange}
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
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="follower-range-label">Follower Range</InputLabel>
              <Select
                labelId="follower-range-label"
                id="follower-range-select"
                value={followerRange}
                onChange={(e) => setFollowerRange(e.target.value)}
                label="Follower Range"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="100k-1m">100k - 1m</MenuItem>
                <MenuItem value="1m-5m">1m - 5m</MenuItem>
                <MenuItem value="5m+">5m+</MenuItem>
              </Select>
            </CustomFormControl>{" "}
            <CustomFormControl
              variant="outlined"
              fullWidth
            >
              <InputLabel id="avg-views-select-label">AVG Views</InputLabel>
              <Select
                labelId="avg-views-select-label"
                id="avg-views-select"
                value={avgViews}
                onChange={(e) => setAvgViews(e.target.value)}
                label="AVG Views"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="10-50000">10-50,000</MenuItem>
                <MenuItem value="50000-100000">50,000-100,000</MenuItem>
                <MenuItem value="100000+">100,000+</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="cpm-range-label">CPM Range</InputLabel>
              <Select
                labelId="cpm-range-label"
                id="cpm-range-select"
                value={cpmRange}
                onChange={(e) => setCpmRange(e.target.value)}
                label="CPM Range"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="0-10">0-10 CPM</MenuItem>
                <MenuItem value="10-25">10-25 CPM</MenuItem>
                <MenuItem value="25+">25+ CPM</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="price-range-label">Price Range</InputLabel>
              <Select
                labelId="price-range-label"
                id="price-range-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                label="Price Range"
              >
                <MenuItem value="">
                  <em>All Prices</em>
                </MenuItem>
                <MenuItem value="0-500">$0 - $500</MenuItem>
                <MenuItem value="500-1500">$500 - $1,500</MenuItem>
                <MenuItem value="1500-5000">$1,500 - $5,000</MenuItem>
                <MenuItem value="5000+">$5,000+</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                value={city}
                onChange={handleCityChange}
                label="City"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Object.keys(cityOptions).map((cityName) => (
                  <MenuItem key={cityName} value={cityName}>
                    {cityName}
                  </MenuItem>
                ))}
              </Select>
            </CustomFormControl>
            <TextField
              id="country-demo"
              label="Audience by Country"
              variant="outlined"
              size='medium'
              fullWidth
              placeholder="US"
              sx={StyleFormControl}
              value={demoCountry}
              onChange={(e) => setdemoCountry(e.target.value)}
            />
            <CustomFormControl variant="outlined">
              <InputLabel id="gender-demo">Audience by Gender</InputLabel>
              <Select
                labelId="gender-demo-label"
                id="gender-demo"
                value={demoGender}
                onChange={(e) => setdemoGender(e.target.value)}
                label="Audience by Gender"
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="male">Male</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl variant="outlined">
              <InputLabel id="age-demo">Audience by Age</InputLabel>
              <Select
                labelId="age-demo-label"
                id="age-demo"
                value={demoAge}
                onChange={(e) => setdemoAge(e.target.value)}
                label="Audience by Age"
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                <MenuItem value="13-17">13-17</MenuItem>
                <MenuItem value="18-24">18-24</MenuItem>
                <MenuItem value="25-34">25-34</MenuItem>
                <MenuItem value="35-44">35-44</MenuItem>
                <MenuItem value="45-64">45-64</MenuItem>
                <MenuItem value="65-">65+</MenuItem>
              </Select>
            </CustomFormControl>
            <TextField
              id="search-field"
              label="Search"
              variant="outlined"
              size="small"
              fullWidth
              sx={StyleFormControl}
              value={filter}
              onChange={handleFilterChange}
            />
            <CustomFormControl variant="outlined" >
              {/*spacing*/}
            </CustomFormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResetFilters}
              sx={StyleFormControl}
              fullWidth
            >
              Reset Filters
            </Button>
            <Button
              sx={StyleButton}
              variant="contained"
              color="secondary"
              onClick={() => setIsCreatorDialogOpen(true)}
            >
              Add Creators
            </Button>
            <Button onClick={toggleView}>
              {showPretty ? "Show CSV" : "Make it Pretty"}
            </Button>
          </Grid>

          <CreatorDialog
            open={isCreatorDialogOpen}
            onClose={() => setIsCreatorDialogOpen(false)}
            onSubmit={handleCreatorSubmit}
          />
        </Paper>
      </Grid>
      {showPretty ? (
        <Box sx={{ paddingInline: { xs: 2, md: 1 } }}>
          <CreatorContainers
            creators={filteredData}
            platform={platform}
            selectedItems={selectedItems}
            onCardClick={handleSelectItem} />
        </Box>
      ) : (
        <Box sx={StyleCsvSection}>
          <Paper elevation={3} sx={(theme) => ({
            marginBottom: theme.spacing(2),
            maxWidth: "100%",
            overflowX: "auto",
          })}>
            <Table sx={classes.csvTable}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">Select</TableCell>
                  {platformHeaders.map((header) => (
                    <TableCell key={header}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((creator, idx) => (
                  <StyledTableRow
                    key={idx}
                    sx={{
                      backgroundColor: selectedItems.has(creator.creator)
                        ? "lightgreen"
                        : "transparent",
                      maxWidth: 10,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedItems.has(creator.creator)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectItem(creator.creator);
                        }}
                        color="primary"
                      />
                    </TableCell>
                    {platformHeaders.map((header) => (
                      <TableCell key={header}>
                        {generateCellContent(creator, header)}
                      </TableCell>
                    ))}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )
      }
    </Box >
  );
});

export default LeftColumn;
