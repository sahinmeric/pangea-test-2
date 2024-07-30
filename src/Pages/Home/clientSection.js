import React from "react";
import {
  Typography,
  Box,
  Paper,
  useTheme,
  useMediaQuery
} from "@mui/material";
import Slider from "react-slick";
import testimonial1 from "../../Components/globalAssets/clientspfp/CUSTOM-LOADER-CMG-compressed.jpg";
import testimonial2 from "../../Components/globalAssets/clientspfp/L-2311-1601650775-2816.jpg";
import testimonial3 from "../../Components/globalAssets/clientspfp/ONErpm-logo.webp";
import testimonial4 from "../../Components/globalAssets/clientspfp/SONY_MUSIC__logo.jpg";
import testimonial5 from "../../Components/globalAssets/clientspfp/Temu_logo.svg";
import testimonial6 from "../../Components/globalAssets/clientspfp/aithor_ai_logo.jpg";
import testimonial7 from "../../Components/globalAssets/clientspfp/almo.jpg";
import testimonial8 from "../../Components/globalAssets/clientspfp/artist_publishing_group_logo.jpg";
import testimonial9 from "../../Components/globalAssets/clientspfp/ifnluienmedia.png";

const ClientsSection = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <Box
      ref={ref}
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundSize: "cover",
        backgroundColor: "black",
        color: "white",
        p: 3,
        boxSizing:'border-box' 
      }}
    >
      <Box sx={{ width:'90%', bgcolor: "rgba(0, 0, 0, 0.7)", boxSizing:'border-box' }}>
        <Typography variant="h3" gutterBottom align="center" color="white">
          Our Clients
        </Typography>
        <Slider {...sliderSettings}>
          {[testimonial1, testimonial2, testimonial3, testimonial4, testimonial5, testimonial6, testimonial7, testimonial8, testimonial9].map((testimonial, index) => (
            <Box
              key={index}
              component="img"
              src={testimonial}
              alt={`Client ${index + 1}`}
              sx={{width:'100%', height: "auto", padding: "0 10px" }}
            />
          ))}
        </Slider>
      </Box>
    </Box>
  );
});

export default ClientsSection;
