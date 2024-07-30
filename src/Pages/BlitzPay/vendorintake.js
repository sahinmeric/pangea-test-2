import React, { useState } from "react";
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
import client from './../../API'

const VendorDialog = ({ open, onClose, onSubmit }) => {
  const [contactEmail, setContactEmail] = useState("");
  const [paymentEmail, setPaymentEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailSame, setEmailSame] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [creatorRegion, setCreatorRegion] = useState("");

  const [primaryMarket, setPrimaryMarket] = useState("");
  const [notesContentStyle, setNotesContentStyle] = useState(
    "tell us about yourself"
  );

  const [race, setRace] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [pfphref, setPfphref] = useState(""); // New state for profile photo URL

  // Instagram
  const [instagramLink, setInstagramLink] = useState("");
  const [instagramBrandRate, setInstagramBrandRate] = useState("");
  const [instagramFollowerCount, setInstagramFollowerCount] = useState("");
  const [instagramSongRate, setInstagramSongRate] = useState("");

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
  // Add other platform-specific rates and links as neede


  const handleEmailSameChange = (event) => {
    setEmailSame(event.target.checked); // Update the state to reflect the checkbox's status
    if (event.target.checked) {
      setPaymentEmail(contactEmail); // If checked, set the payment email to the contact email
    } else {
      setPaymentEmail(""); // If unchecked, clear the payment email field for manual input
    }
  };

  const { mutate: addNewCreator, isLoading } = useMutation(
    client.creators.add,
    {
      onSuccess: (data) => {
        alert("Creator added successfully");
        onClose()
      },
      onError: (error) => {
        alert("Error saving creator data:", error);
        onClose()
      },
    }
  );

  
 
  const formatNumber = (value) => {
    const number = parseInt(value, 10);
    return isNaN(number) ? "" : number.toLocaleString(); // Convert number to string with commas but no "$"
  };
  const formatRate = (value) => {
    const number = parseInt(value, 10);
    return isNaN(number) ? "" : `$${number.toLocaleString()}`;
  };

  const handleSaveCreator = async () => {
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
      geolocationgenderethnicity: `${location} / ${gender} / ${race}` || null,
      primary_market: primaryMarket, // Include the selected primary market
      region: creatorRegion,
      notescontent_style: notesContentStyle || null, // Add this to your payload
      tiktok_sound: formatRate(tikTokSongRate) || null,
      tiktok_brand: formatRate(tikTokBrandRate) || null,
      ig_feed_post: formatRate(instagramBrandRate) || null,
      ig_story: null,
      ig_reels_sound: formatRate(instagramSongRate) || null,
      ig_reels_brand: formatRate(instagramBrandRate) || null, // This and other rates need actual form fields or logic
      "60s Integration": formatRate(youtube60sBrandRate) || null,
      "3045s Integration": formatRate(youtube30sBrandRate) || null, // This needs a corresponding field or logic to provide a value
      shorts: formatRate(youtubeShortsBrandRate) || null,
      contactEmail: contactEmail,
      paymentEmail: paymentEmail,
      phone_number: phoneNumber, // Make sure this matches the expected key in your Flask app
      pfphref: pfphref || null,
      is_vendor: true
    };

    addNewCreator(payload);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Container maxWidth="xl">
        <h1>Vendor Intake Form</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission via HTTP
            handleSaveCreator();
          }}
        >
          <TextField
            margin="dense"
            label="Vendor Name"
            type="text"
            fullWidth
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            variant="outlined"
          />
          <FormControl variant="outlined" fullWidth margin="dense">
            <InputLabel>Vendor Region</InputLabel>
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
         
          <FormControlLabel
            control={
              <Checkbox checked={emailSame} onChange={handleEmailSameChange} />
            }
            label="Payment and contact email are the same"
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

export default VendorDialog;
