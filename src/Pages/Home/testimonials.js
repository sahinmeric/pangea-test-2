import React from "react";
import { Typography, Box, Paper, Avatar, useTheme, useMediaQuery } from "@mui/material";
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


const testimonials = [
  { quote: "Blitz has transformed our workflow and increased our efficiency!", name: "John Doe", image: testimonial1 },
  { quote: "A fantastic tool for campaign management. Highly recommended.", name: "Jane Smith", image: testimonial2 },
  { quote: "Blitz is a game-changer for our marketing team.", name: "Sam Johnson", image: testimonial3 },
  { quote: "We love how easy it is to use Blitz for our campaigns.", name: "Anna Lee", image: testimonial4 },
  { quote: "Blitz's features are incredibly helpful for our projects.", name: "David Brown", image: testimonial5 },
  { quote: "An essential tool for any modern marketing team.", name: "Emily Clark", image: testimonial6 },
  { quote: "Blitz has streamlined our operations and boosted our productivity.", name: "Michael Davis", image: testimonial7 },
  { quote: "Blitz has streamlined our operations and boosted our productivity.", name: "Michael Davis", image: testimonial8 },
  { quote: "Blitz has streamlined our operations and boosted our productivity.", name: "Michael Davis", image: testimonial9 },

];

const TestimonialsSection = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
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
      }}
    >
      <Paper
        elevation={6}
        sx={{ p: 4, width:'90%', maxWidth: "800px", bgcolor: "rgba(0, 0, 0, 0.7)" }}
      >
        <Typography variant="h3" gutterBottom color="white">
          Testimonials
        </Typography>
        <Slider {...sliderSettings}>
          {testimonials.map((testimonial, index) => (
            <Box key={index} sx={{ textAlign: "center", p: 2 }}>
              <Avatar
                src={testimonial.image}
                alt={testimonial.name}
                sx={{ width: 100, height: 100, margin: "auto" }}
              />
              <Typography variant="h6" sx={{ mt: 2 }} color="white">
                "{testimonial.quote}"
              </Typography>
              <Typography variant="body2" color="white">
                - {testimonial.name}
              </Typography>
            </Box>
          ))}
        </Slider>
      </Paper>
    </Box>
  );
});

export default TestimonialsSection;
