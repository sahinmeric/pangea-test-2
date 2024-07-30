import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import axios from "axios";

const AssetsTab = ({ campaignDetails, creator }) => {
  const [liveLink, setLiveLink] = useState(creator?.liveLink || "");
  const [saving, setSaving] = useState(false);

  const handleLiveLinkChange = (event) => {
    setLiveLink(event.target.value);
  };

  const handleSaveLiveLink = async () => {
    setSaving(true);
    try {
      // Replace with your actual API endpoint and payload
      const response = await axios.post(
        "/api/creatorUpdateLinksAndCodes",
        {
          campaignId: campaignDetails.id,
          updates: [{ id: creator.id, liveLink }],
        },
        {
          headers: {
            Authorization: `Bearer ${creator.jwt}`, // Use creator's JWT
          },
        }
      );
      console.log("Response: ", response.data);
    } catch (error) {
      console.error("Error saving live link:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!creator || !campaignDetails) return <>Loading</>;

  const promotionTypeOptions = {
    TikTok: ["Sound", "Brand", "Livestream", "UGC"],
    Instagram: ["Sound", "Brand", "Feed Post", "UGC"],
    YouTube: ["3045s Integration", "60s Integration", "Shorts", "UGC"],
    Other: ["Sponsored Post", "Ad Placement", "Product Review", "UGC"],
  };

  return (
    <Box sx={{ margin: 2 }}>
      <Typography variant="h6">Campaign Brief: {campaignDetails.brief}</Typography>
      <Divider></Divider>
      <Box sx={{ paddingBlockEnd: 2, marginTop: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={!!creator.promotionPlatform} disabled />}
          label={`Platform: ${creator?.promotionPlatform || "Not specified"}`}
        />
        <FormControlLabel
          control={<Checkbox checked={!!creator.promotionType} disabled />}
          label={`Promotion Type: ${creator?.promotionType || "Not specified"}`}
        />
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">Creator Brief</Typography>
          <TextField fullWidth value={creator?.creatorBrief || ""} disabled multiline />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">Posting Instructions</Typography>
          <TextField fullWidth value={creator?.postingInstructions || ""} disabled multiline />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">Boost Code</Typography>
          <TextField fullWidth value={creator?.boostCode || ""} disabled />
        </Box>
        {creator.submissionLink && (
          <Box sx={{ marginTop: 2, textAlign: "center" }}>
            <Button variant="contained" color="primary" href={creator.submissionLink} target="_blank">
              Upload your assets here
            </Button>
          </Box>
        )}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body1">Insert live link here</Typography>
          <TextField fullWidth value={liveLink} onChange={handleLiveLinkChange} disabled={saving} />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveLiveLink}
            disabled={saving}
            sx={{ marginTop: 2 }}
          >
            {saving ? "Saving..." : "Save Live Link"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AssetsTab;
