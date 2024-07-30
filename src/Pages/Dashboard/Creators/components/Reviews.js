import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import styles from "../styles.module.css";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const Reviews = ({ reviews, setReviewDialogOpen }) => {

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarIcon key={i} />);
      } else {
        stars.push(<StarBorderIcon key={i} />);
      }
    }
    return stars;
  };

  return (
    <Box className={styles.reviews} sx={{ width: '100%' }}>
      <Typography variant='h5'>Reviews</Typography>
      {reviews.map(review => (
        <Card key={review.id} className={styles.card}>
          <CardContent>
          <Typography variant='h2'>Rating: {renderStars(review.rating)}</Typography>
            <Typography variant='h3'>{review.user.first_name} {review.user.last_name}</Typography>
            <Typography variant='h4'>{review.user.company_name}</Typography>
            <Typography variant='body2'>{review.description}</Typography>
          </CardContent>
        </Card>
      ))}
      <Button variant="contained" color="secondary" onClick={() => setReviewDialogOpen(true)} sx={{ marginTop: '10px' }}>
        Leave a Review
      </Button>
    </Box>
  );
};

export default Reviews;
