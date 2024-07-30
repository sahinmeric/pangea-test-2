import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Select, MenuItem, Button } from "@mui/material";
import profilePhoto from "../../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo

const CampaignsContainers = ({ creators, handleStatusChange }) => {
  return (
    <Grid container spacing={2}>
      {creators.map((creator, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card>
            <CardMedia
              component="img"
              height="250" // Increase the height of the image to make it more prominent
              image={creator.pfphref || profilePhoto}
              alt={creator.name}
              style={{ objectFit: "cover" }} // Ensure the image covers the whole area
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                <a
                  href={`https://blitzpay.pro/creators/${creator.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'blue' }}
                >
                  @{creator.name}
                </a>
              </Typography>
              <Typography variant="body1">Following: {creator.following}</Typography>
              
              <Typography variant="body1" style={{ marginTop: 10 }}>{`Recommended Price: $${creator.price} USD`}</Typography>
              <Button
                variant="contained"
                color="primary"
                href={`https://blitzpay.pro/creators/${creator.name}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", marginTop: 8 }}
              >
                View Media Kit
              </Button>
              <Select
                value={creator.status || "pitched"}
                onChange={(event) => handleStatusChange(creator.id, event.target.value)}
                style={{ marginTop: 10, width: "100%" }} // Adjust the margin and width
              >
                <MenuItem value="pitched">Pitched</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="drop">Drop</MenuItem>
                <MenuItem value="counter">Counter</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="declined">Declined</MenuItem>
              </Select>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <a
                  href={creator.platformLink ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on {creator.promotionPlatform ?? ""}
                </a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CampaignsContainers;
