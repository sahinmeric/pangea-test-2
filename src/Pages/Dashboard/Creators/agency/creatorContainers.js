import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  CardMedia,
  Card,
  Select,
  MenuItem,
  CardContent
} from "@mui/material";
import client from "../../../../API"; // adjust the path as necessary
import profilePhoto from "../../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo

const CampaignsContainers = ({ creators }) => {
  return (
    <Grid container spacing={2}>
      {creators.map((creator, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={creator.pfphref || profilePhoto}
              alt={creator.name}
            />
            <CardContent>
              <Typography variant="h5">@{creator.creator}</Typography>
              {creator.youtube && (
                <Typography variant="h5">Youtube following: {creator.youtube}</Typography>
              )}
              {creator.instagram && (
                <Typography variant="h5">Instagram following: {creator.instagram}</Typography>
              )}
              {creator.tiktok && (
                <Typography variant="h5">TikTok following: {creator.tiktok}</Typography>
              )}

              {creator.youtube_link && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <a
                    href={creator.youtube_link ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Youtube
                  </a>
                </Typography>
              )}
              {creator.instagram_link && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <a
                    href={creator.instagram_link ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Instagram
                  </a>
                </Typography>
              )}
              {creator.tiktok_link && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <a
                    href={creator.tiktok_link ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Tiktok
                  </a>
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};


export default CampaignsContainers;
