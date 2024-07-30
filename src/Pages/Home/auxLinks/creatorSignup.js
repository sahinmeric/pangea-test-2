import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppBar,
  Container,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Toolbar,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import blitzLogo from "../../../Components/globalAssets/platty.png";

const CreatorSignup = ({ onSubmit }) => {
  const { manager } = useParams();
  const navigate = useNavigate();
  const [contactEmail, setContactEmail] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailSame, setEmailSame] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [creatorRegion, setCreatorRegion] = useState("");
  const [platforms, setPlatforms] = useState({
    TikTok: false,
    Instagram: false,
    YouTube: false,
  });
  const [primaryMarket, setPrimaryMarket] = useState("");
  const [notesContentStyle, setNotesContentStyle] = useState(
    "tell us about yourself"
  );

  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [pfphref, setPfphref] = useState("");

  // Instagram
  const [instagramLink, setInstagramLink] = useState("");
  const [instagramBrandRate, setInstagramBrandRate] = useState("");
  const [instagramFollowerCount, setInstagramFollowerCount] = useState("");
  const [instagramSongRate, setInstagramSongRate] = useState("");
  const [instagramStoryRate, setInstagramStoryRate] = useState("");

  // TikTok
  const [tikTokLink, setTikTokLink] = useState("");
  const [tikTokFollowerCount, setTikTokFollowerCount] = useState("");
  const [tikTokBrandRate, setTikTokBrandRate] = useState("");
  const [tikTokSongRate, setTikTokSongRate] = useState("");

  // YouTube
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtube30sBrandRate, setYoutube30sBrandRate] = useState("");
  const [youtubeFollowerCount, setYoutubeFollowerCount] = useState("");
  const [youtube60sBrandRate, setYoutube60sBrandRate] = useState("");
  const [youtubeShortsBrandRate, setYoutubeShortsBrandRate] = useState("");

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [openRedirectDialog, setOpenRedirectDialog] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!manager) {
      setOpenDialog(true);
    }
  }, [manager]);

  const handlePlatformChange = (event) => {
    setPlatforms({ ...platforms, [event.target.name]: event.target.checked });
  };

  const handleEmailSameChange = (event) => {
    setEmailSame(event.target.checked);
    if (event.target.checked) {
      setPaymentEmail(contactEmail);
    } else {
      setPaymentEmail("");
    }
  };

  const handleFollowerCountChange = (setter) => (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const formattedValue = formatNumber(rawValue);
    setter(formattedValue);
  };

  const formatNumber = (value) => {
    const number = parseInt(value, 10);
    return isNaN(number) ? "" : number.toLocaleString();
  };

  const formatRate = (value) => {
    const number = parseInt(value, 10);
    return isNaN(number) ? "" : `${number.toLocaleString()}`;
  };

  const handleSaveCreator = async () => {
    if (creatorName.includes(" ")) {
      setValidationError("Creator name cannot contain spaces.");
      return;
    }

    const formattedTikTokLink = tikTokLink ? `https://www.tiktok.com/@${tikTokLink}` : null;
    const formattedInstagramLink = instagramLink ? `https://www.instagram.com/${instagramLink}` : null;
    const formattedYouTubeLink = youtubeLink ? `https://www.youtube.com/${youtubeLink}` : null;

    const payload = {
      creator: creatorName,
      tiktok: tikTokFollowerCount || null,
      tiktok_link: formattedTikTokLink || null,
      instagram: instagramFollowerCount || null,
      instagram_link: formattedInstagramLink || null,
      youtube: youtubeFollowerCount || null,
      youtube_link: formattedYouTubeLink || null,
      geolocationgenderethnicity: `${location} / ${gender} / ${race}`,
      primary_market: primaryMarket,
      region: creatorRegion,
      notescontent_style: notesContentStyle || null,
      tiktok_sound: formatRate(tikTokSongRate),
      tiktok_brand: formatRate(tikTokBrandRate),
      ig_feed_post: formatRate(instagramBrandRate),
      ig_story: formatRate(instagramStoryRate),
      ig_reels_sound: formatRate(instagramSongRate),
      ig_reels_brand: formatRate(instagramBrandRate),
      "60s Integration": formatRate(youtube60sBrandRate),
      "3045s Integration": formatRate(youtube30sBrandRate),
      shorts: formatRate(youtubeShortsBrandRate),
      contactEmail: contactEmail,
      paymentEmail: paymentEmail,
      phone_number: phoneNumber,
      pfphref: pfphref || null,
      manager: manager || null,
    };

    let status = 0;
    let attempts = 0;
    do {
      try {

        const response = await fetch('https://blitz-backend-nine.vercel.app/api/creators/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        status = response.status;
        attempts++;

        if (response.ok) {
          const data = await response.json();
          setOpenRedirectDialog(true);
          setTimeout(() => {
            navigate(`/creators/${creatorName}`);
          }, 3000);
        } else if (status != 504) {
          const errorData = await response.json();
          alert(`Error saving creator data: ${errorData.error}`);
          console.error(errorData);
        }
      } catch (error) {
        alert(`Network error: ${error.message}`);
        console.error('Network error:', error);
      }
    } while (status == 504 && attempts < 3)
    if (status == 504) {
      alert("Network error: Server error, please contact us");
    }
  };

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#000000" }}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <img
                src={blitzLogo}
                alt="logo"
                style={{ width: "120px", height: "50px" }}
              />
            </IconButton>
          </Box>
          <Box
            display="flex"
            flexGrow={1}
            justifyContent="center"
            style={{ flexGrow: 2 }}
          >
            {/* Navigation items here */}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <h1> {manager} Creator Intake Form</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCreator();
          }}
        >
          <TextField
            margin="dense"
            label="Creator Name"
            type="text"
            fullWidth
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            variant="outlined"
            required
            error={!!validationError}
            helperText={validationError}
          />
          <FormControl variant="outlined" fullWidth margin="dense" required>
            <InputLabel>Creator Region</InputLabel>
            <Select
              label="Creator Region"
              value={creatorRegion}
              onChange={(e) => setCreatorRegion(e.target.value)}
            >
              <MenuItem value="NACAUKAUS">USA, Canada, UK, Australia</MenuItem>
              <MenuItem value="Europe">Europe</MenuItem>
              <MenuItem value="Asia">Asia</MenuItem>
              <MenuItem value="LATAM">LATAM</MenuItem>
              <MenuItem value="Africa">Africa</MenuItem>
            </Select>
          </FormControl>
          <FormGroup row>
            {Object.keys(platforms).map((platform) => (
              <FormControlLabel
                key={platform}
                control={
                  <Checkbox
                    checked={platforms[platform]}
                    onChange={handlePlatformChange}
                    name={platform}
                  />
                }
                label={platform}
              />
            ))}
          </FormGroup>
          {platforms.Instagram && (
            <>
              <TextField
                margin="dense"
                label="Instagram Username"
                type="text"
                fullWidth
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      instagram.com/
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="dense"
                label="Instagram Follower Count"
                type="text"
                fullWidth
                value={instagramFollowerCount}
                onChange={handleFollowerCountChange(setInstagramFollowerCount)}
                variant="outlined"
                required
              />
              <TextField
                margin="dense"
                label="Instagram Brand Rate"
                type="text"
                fullWidth
                value={instagramBrandRate}
                onChange={(e) => setInstagramBrandRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Instagram Song Rate"
                type="text"
                fullWidth
                value={instagramSongRate}
                onChange={(e) => setInstagramSongRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Instagram Story Rate"
                type="text"
                fullWidth
                value={instagramStoryRate}
                onChange={(e) => setInstagramStoryRate(e.target.value)}
                variant="outlined"
              />
            </>
          )}
          {platforms.TikTok && (
            <>
              <TextField
                margin="dense"
                label="TikTok Username"
                type="text"
                fullWidth
                value={tikTokLink}
                onChange={(e) => setTikTokLink(e.target.value)}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      tiktok.com/@
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="dense"
                label="TikTok Follower Count"
                type="text"
                fullWidth
                value={tikTokFollowerCount}
                onChange={handleFollowerCountChange(setTikTokFollowerCount)}
                variant="outlined"
                required
              />
              <TextField
                margin="dense"
                label="TikTok Brand Rate"
                type="text"
                fullWidth
                value={tikTokBrandRate}
                onChange={(e) => setTikTokBrandRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="TikTok Song Rate"
                type="text"
                fullWidth
                value={tikTokSongRate}
                onChange={(e) => setTikTokSongRate(e.target.value)}
                variant="outlined"
              />
            </>
          )}
          {platforms.YouTube && (
            <>
              <TextField
                margin="dense"
                label="Youtube Username"
                type="text"
                fullWidth
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      youtube.com/
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="dense"
                label="YouTube Follower Count"
                type="text"
                fullWidth
                value={youtubeFollowerCount}
                onChange={handleFollowerCountChange(setYoutubeFollowerCount)}
                variant="outlined"
                required
              />
              <TextField
                margin="dense"
                label="YouTube Brand Rate - 30s"
                type="text"
                fullWidth
                value={youtube30sBrandRate}
                onChange={(e) => setYoutube30sBrandRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="YouTube Brand Rate - 60s"
                type="text"
                fullWidth
                value={youtube60sBrandRate}
                onChange={(e) => setYoutube60sBrandRate(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="YouTube Shorts Rate"
                type="text"
                fullWidth
                value={youtubeShortsBrandRate}
                onChange={(e) => setYoutubeShortsBrandRate(e.target.value)}
                variant="outlined"
              />
            </>
          )}

          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel id="race-select-label">Race (optional)</InputLabel>
            <Select
              labelId="race-select-label"
              value={race}
              onChange={(e) => setRace(e.target.value)}
              label="Race (optional)"
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
          </FormControl>

          <FormControl variant="outlined" fullWidth margin="dense" required>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              labelId="gender-select-label"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              label="Gender"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Non-binary">Non-binary</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            variant="outlined"
            required
          />
          <FormControl variant="outlined" fullWidth margin="dense" required>
            <InputLabel id="primary-market-label">Primary Market</InputLabel>
            <Select
              labelId="primary-market-label"
              value={primaryMarket}
              onChange={(e) => setPrimaryMarket(e.target.value)}
              label="Primary Market"
            >
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
          <TextField
            margin="dense"
            label="Bio"
            type="text"
            fullWidth
            multiline
            rows={4}
            placeholder="tell us about yourself"
            variant="outlined"
            value={notesContentStyle}
            onChange={(e) => setNotesContentStyle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contact Email"
            type="email"
            fullWidth
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            variant="outlined"
            required
          />
          <TextField
            margin="dense"
            label="Paypal Payment Email"
            type="email"
            fullWidth
            disabled={emailSame}
            value={paymentEmail}
            onChange={(e) => setPaymentEmail(e.target.value)}
            variant="outlined"
            required={!emailSame}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined"
            required
          />
          <TextField
            margin="dense"
            label="Profile Photo URL"
            type="text"
            fullWidth
            value={pfphref}
            onChange={(e) => setPfphref(e.target.value)}
            variant="outlined"
            placeholder="Enter URL for profile photo"
          />
          <FormControlLabel
            control={
              <Checkbox checked={emailSame} onChange={handleEmailSameChange} />
            }
            label="Payment and contact email are the same"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "5px", marginBottom: "10px" }}
          >
            Submit Information
          </Button>
        </form>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Signup Form Information</DialogTitle>
          <DialogContent>
            <p>
              This signup form is for creators to be seen in the Blitz
              marketplace and to send campaigns directly to their email and
              phone number. By opting in you are joining a community of thousands of creators world wide!
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openRedirectDialog}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <p>Redirecting you to your mediakit...</p>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default CreatorSignup;
