import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Rating } from '@mui/material';
import useAuth from '../../../Hooks/use-auth';

const LeaveReview = ({ open, onClose, creatorId }) => {
  const { getCurrrentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrrentUser();
        console.log('Current User:', currentUser); // Debugging log
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [getCurrrentUser]);

  const handleSubmit = async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const response = await fetch(`https://blitz-backend-nine.vercel.app/api/creators/${creatorId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          description,
          user_id: user.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Review submitted:', result);
        onClose();  // Close the dialog after successful submission
      } else {
        console.error('Failed to submit review:', result.error);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: '1rem' }}>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
          />
        </div>
        <TextField
          margin="dense"
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveReview;
