import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Container,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useMutation } from "react-query";
import client from "../../../API";
import { useIsMounted } from "../../../Hooks/use-is-mounted";
import { ConfigValue } from "../../../Config";

const CreatorDialog = ({ open, onClose, creatorInfo, mode }) => {
  const [contactEmail, setContactEmail] = useState(creatorInfo?.email);
  const [paymentEmail, setPaymentEmail] = useState(creatorInfo?.payout_email || creatorInfo?.email);
  const [phoneNumber, setPhoneNumber] = useState(creatorInfo?.phone_number);
  const [emailSame, setEmailSame] = useState(false);
  const [creatorName, setCreatorName] = useState(
    creatorInfo ? creatorInfo.creator : "",
  );
  //console.log("Creator data received in dialog:", creatorInfo);

  //All of the below code is invalid, as useState only gets initialized when a component is first built.
  // an useEffect dependant on the creatorInfo variable should update everytime this dialog updates.
  const [avgViews, setAvgViews] = useState(creatorInfo?.avg_views || "");
  const [status, setStatus] = useState(creatorInfo?.status || "");
  const [manager, setManager] = useState(creatorInfo?.manager || "");
  const [supervisor, setSupervisor] = useState(creatorInfo?.superviser || "");

  const [pfphref, setPfphref] = useState(creatorInfo?.pfphref || ""); // Profile photo URL

  // Make sure to add input fields in your form to edit these new pieces of information.

  const [creatorRegion, setCreatorRegion] = useState(
    creatorInfo ? creatorInfo.region : "",
  );
  const [platforms, setPlatforms] = useState({
    TikTok: false,
    Instagram: false,
    YouTube: false,
  });
  const [primaryMarket, setPrimaryMarket] = useState(
    creatorInfo ? creatorInfo.primary_market : "",
  );
  const [notesContentStyle, setNotesContentStyle] = useState(
    creatorInfo ? creatorInfo.notes_content_style : "",
  );

  const [race, setRace] = useState(creatorInfo?.geolocation_gender_ethnicity.split(' / ')[2] || "");
  const [gender, setGender] = useState(creatorInfo?.geolocation_gender_ethnicity.split(' / ')[1] || "");
  const [location, setLocation] = useState(creatorInfo?.geolocation_gender_ethnicity.split(' / ')[0] || "");

  // Instagram
  const [instagramLink, setInstagramLink] = useState(
    creatorInfo?.instagram_link || "",
  );
  const [instagramFollowerCount, setInstagramFollowerCount] = useState(
    creatorInfo?.instagram || "",
  );
  const [instagramBrandRate, setInstagramBrandRate] = useState(
    creatorInfo ? creatorInfo.ig_reels_brand : "",
  );
  const [instagramSongRate, setInstagramSongRate] = useState(
    creatorInfo?.ig_reels_sound || "",
  );
  const [instagramStoryRate, setInstagramStoryRate] = useState(
    creatorInfo?.ig_story || "",
  );

  // TikTok
  const [tikTokLink, setTikTokLink] = useState(creatorInfo?.tiktok_link || "");
  const [tikTokFollowerCount, setTikTokFollowerCount] = useState(
    creatorInfo?.tiktok || "",
  );

  const [tikTokBrandRate, setTikTokBrandRate] = useState(
    creatorInfo ? creatorInfo.tiktok_brand : "",
  );
  const [tikTokSongRate, setTikTokSongRate] = useState(
    creatorInfo ? creatorInfo.tiktok_sound : "",
  );

  // YouTube
  const [youtubeLink, setYoutubeLink] = useState(
    creatorInfo ? creatorInfo.youtube_link : "",
  );
  const [youtubeFollowerCount, setYoutubeFollowerCount] = useState(
    creatorInfo?.youtube || "",
  );
  const [youtube30sBrandRate, setYoutube30sBrandRate] = useState("");
  const [youtube60sBrandRate, setYoutube60sBrandRate] = useState("");
  const [youtubeShortsBrandRate, setYoutubeShortsBrandRate] = useState("");
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    if (!creatorInfo)
      return;

    console.log("Loading creator", creatorInfo);

    const creator = creatorInfo;
    const creatorSplit = creator.geolocation_gender_ethnicity.split('/');
    console.log("Data split: ", creatorSplit);
    const oldGeo = creatorSplit[0].trim();
    const oldGender = creatorSplit.length > 0 ? creatorSplit[1].trim() : "";
    const oldEthnic = creatorSplit.length > 1 ? creatorSplit[2].trim() : "";
    console.log("Location ", oldGeo, "Gender ", oldGender, "Ethnicity ", oldEthnic);

    setContactEmail(creator.email);
    console.log(`${creator.email} is equal to ${creator.payout_email}? ${(creator.email == creator.payout_email)}`)
    setEmailSame(creator.email == creator.payout_email);
    setPaymentEmail(creator.payout_email || '');
    setPhoneNumber(creator.phone_number);
    setCreatorName(creator.creator);
    setCreatorRegion(creator.region);
    setPlatforms({
      TikTok: creator.tiktok_link !== null,
      Instagram: creator.instagram_link !== null,
      YouTube: creator.youtube_link !== null,
    });
    setPrimaryMarket(creator.primary_market);
    setNotesContentStyle(
      creator.notes_content_style
    );

    setRace(oldEthnic);
    setGender(oldGender);
    setLocation(oldGeo);

    // Instagram
    setInstagramLink(creator.instagram_link ? creator.instagram_link : "");
    setInstagramBrandRate(creator.ig_reels_brand ? creator.ig_reels_brand.replace("$", "") : "");
    setInstagramFollowerCount(creator.instagram);
    setInstagramSongRate(creator.ig_reels_sound ? creator.ig_reels_sound.replace("$", "") : "");
    setInstagramStoryRate(creator.ig_story ? creator.ig_story.replace("$", "") : "");

    // TikTok
    setTikTokLink(creator.tiktok_link ? creator.tiktok_link : "");
    setTikTokFollowerCount(creator.tiktok);
    setTikTokBrandRate(creator.tiktok_brand ? creator.tiktok_brand.replace("$", "") : "");
    setTikTokSongRate(creator.tiktok_sound ? creator.tiktok_sound.replace("$", "") : "");

    // YouTube
    setYoutubeLink(creator.youtube_link ? creator.youtube_link : "");
    setYoutube30sBrandRate(creator.rate_2530s ? creator.rate_2530s.replace("$", "") : "");
    setYoutubeFollowerCount(creator.youtube);
    setYoutube60sBrandRate(creator.integration_60s ? creator.integration_60s.replace("$", "") : "");
    setYoutubeShortsBrandRate(creator.shorts ? creator.shorts.replace("$", "") : "");
    setIsVendor(creator.is_vendor ? creator.is_vendor : false);

  }, [creatorInfo])
  // Add other platform-specific rates and links as neede
  const handlePlatformChange = (event) => {
    setPlatforms({ ...platforms, [event.target.name]: event.target.checked });
  };

  const handleEmailSameChange = (event) => {
    setEmailSame(event.target.checked); // Update the state to reflect the checkbox's status
    if (event.target.checked) {
      setPaymentEmail(contactEmail); // If checked, set the payment email to the contact email
    } else {
      setPaymentEmail(""); // If unchecked, clear the payment email field for manual input
    }
  };

  const handleIsVendorChange = (event) => {
    setIsVendor(event.target.checked); // Update the state to reflect the checkbox's status
  };
  const handleFollowerCountChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleUpdateCreator = async () => {
    const payload = {
      creator_id: creatorInfo.creator,  // Ensure this is retrieved correctly and exists
      creator: creatorName,
      tiktok: tikTokFollowerCount || creatorInfo.tiktok,
      tiktok_link: tikTokLink || creatorInfo.tiktok_link,
      instagram: instagramFollowerCount || creatorInfo.instagram,
      instagram_link: instagramLink || creatorInfo.instagram_link,
      youtube: youtubeFollowerCount || creatorInfo.youtube,
      youtube_link: youtubeLink || creatorInfo.youtube_link,
      geolocation_gender_ethnicity: `${location} / ${gender} / ${race}` || creatorInfo.geolocation_gender_ethnicity,
      primary_market: primaryMarket || creatorInfo.primary_market,
      region: creatorRegion || creatorInfo.region,
      notes_content_style: notesContentStyle || creatorInfo.notes_content_style,
      tiktok_sound: tikTokSongRate || creatorInfo.tiktok_sound,
      tiktok_brand: tikTokBrandRate || creatorInfo.tiktok_brand,
      ig_story: instagramStoryRate || creatorInfo.ig_story,
      ig_reels_sound: instagramSongRate || creatorInfo.ig_reels_sound,
      ig_reels_brand: instagramBrandRate || creatorInfo.ig_reels_brand,
      rate_2530s: youtube30sBrandRate || creatorInfo.rate_2530s,
      integration_60s: youtube60sBrandRate || creatorInfo.integration_60s,
      shorts: youtubeShortsBrandRate || creatorInfo.shorts,
      phone_number: phoneNumber || creatorInfo.phone_number,
      email: contactEmail || creatorInfo.email,
      payout_email: emailSame ? contactEmail : paymentEmail,
      pfphref: pfphref || creatorInfo.pfphref,
      manager: manager || creatorInfo.manager,
      superviser: supervisor || creatorInfo.superviser,
      status: status || creatorInfo.status,
      avg_views: avgViews || creatorInfo.avg_views,
      is_vendor: isVendor,
    };

    try {
      const data = await client.creators.update(payload)
      console.log("Update successful", data);
    } catch (error) {
      console.error("Error updating creator", error);
    }
  };



  return (
    <Dialog open={open} onClose={onClose}>
      <Container maxWidth="xl">
        <h1>Creator Intake Form</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission via HTTP
            handleUpdateCreator();
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
          />
          <FormControl variant="outlined" fullWidth margin="dense">
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
              />
              <TextField
                margin="dense"
                label="Instagram Follower Count"
                type="text"
                fullWidth
                value={instagramFollowerCount}
                onChange={handleFollowerCountChange(setInstagramFollowerCount)}
                variant="outlined"
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
              />

              <TextField
                margin="dense"
                label="TikTok Follower Count"
                type="text"
                fullWidth
                value={tikTokFollowerCount}
                onChange={handleFollowerCountChange(setTikTokFollowerCount)}
                variant="outlined"
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
              />
              <TextField
                margin="dense"
                label="YouTube Follower Count"
                type="text"
                fullWidth
                value={youtubeFollowerCount}
                onChange={handleFollowerCountChange(setYoutubeFollowerCount)}
                variant="outlined"
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
              {/* Define your options here */}
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

          {/* Gender Dropdown */}
          <FormControl variant="outlined" fullWidth margin="dense">
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
          />
          <FormControl variant="outlined" fullWidth margin="dense">
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
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            variant="outlined"
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
          <TextField
            margin="dense"
            label="Manager"
            type="text"
            fullWidth
            value={manager}
            onChange={(e) => setManager(e.target.value)}
            variant="outlined"
            placeholder="Manager"
          />
          <TextField
            margin="dense"
            label="Supervisor"
            type="text"
            fullWidth
            value={supervisor}
            onChange={(e) => setSupervisor(e.target.value)}
            variant="outlined"
            placeholder="Supervisor"
          />
          <TextField
            margin="dense"
            label="Status"
            type="text"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            variant="outlined"
            placeholder="Status"
          />
          <FormControlLabel
            control={
              <Checkbox checked={emailSame} onChange={handleEmailSameChange} />
            }
            label="Payment and contact email are the same"
          />
          <FormControlLabel
            control={
              <Checkbox checked={isVendor} onChange={handleIsVendorChange} />
            }
            label="Is vendor?"
          />
          <Button
            type="submit" // Ensures form submission behavior when Enter is pressed
            variant="contained"
            color="primary"
            style={{ marginTop: "5px", marginBottom: "10px" }} // Add some space above the button
          >
            Submit Information
          </Button>
        </form>
      </Container>
    </Dialog>
  );
};

export default CreatorDialog;
