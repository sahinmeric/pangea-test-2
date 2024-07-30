import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, CardMedia, Button, Box } from "@mui/material";
import Slider from "react-slick";
import profilePhoto from "../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopCreatorPartnersSection = () => {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    fetch("https://blitz-backend-nine.vercel.app/api/creators/partners")
      .then((response) => response.json())
      .then((data) => setCreators(data.creators))
      .catch((error) => console.error("Error fetching creator partners:", error));
  }, []);

  const parseNumber = (numStr) => {
    if (numStr === null || numStr === undefined || numStr === "N/A") {
      return 0; // Return 0 for non-numeric or absent values
    }
    return parseInt(numStr.replace(/,/g, ""), 10);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "black" }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ color: "white" }}>
        Top Creator Partners
      </Typography>
      <Slider {...settings}>
        {creators.slice(0, 10).map((creator, index) => {
          const followerCount = parseNumber(creator.followers || "0");
          const avgViews = parseNumber(creator.avg_views || "0"); // Default to '0' if avg_views is undefined
          let engagement = null;
          if (followerCount && avgViews) {
            engagement = (avgViews / followerCount) * 100; // calculate engagement percentage
          }

          return (
            <div key={index}>
              <Card
                style={{
                  cursor: "pointer",
                  backgroundColor: "#333333", // Darker shade
                  color: "#fff",
                  margin: "10px",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={creator.pfphref || profilePhoto}
                  alt={creator.creator}
                />
                <CardContent>
                  <Typography variant="h5" component="div" style={{ color: "#fff" }}>
                    @{creator.creator}
                  </Typography>
                  <Typography variant="body2" style={{ color: "#fff" }}>
                    Region: {creator.region}
                  </Typography>
                  <Typography variant="body2" style={{ color: "#fff" }}>
                    Followers: {creator.followers}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href={creator.instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", marginTop: "8px" }}
                  >
                    View Instagram Profile
                  </Button>
                  {engagement && (
                    <Typography variant="body2" style={{ color: '#fff' }}>
                      Engagement: {engagement.toFixed(2)}%
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </Slider>
    </Box>
  );
};

export default TopCreatorPartnersSection;
