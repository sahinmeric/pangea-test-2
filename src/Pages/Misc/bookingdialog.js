import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Button, Slider, Typography } from '@mui/material';

const BookingDialog = ({ open, onClose, submitBooking, promotionData }) => {
  const [formData, setFormData] = useState({
    selectedPromotion: '',
    rate: 50, 
    selectedDate: new Date().toISOString().substring(0, 10), 
    details: '',
    email: '',
    partnershipName: '', 
  });

  const [warning, setWarning] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSliderChange = (event, newValue) => {
    setFormData(prevState => ({ ...prevState, rate: newValue }));
  };

  const getPromotionRange = () => {
    if (formData.selectedPromotion) {
      const selectedPromotion = promotionData.find(promo => promo.name === formData.selectedPromotion);
      if (selectedPromotion) {
        return [selectedPromotion.lowest.value, selectedPromotion.highest.value];
      }
    }
    return [50, 10000];  // Adjusted the default max value
  };

  const [minRate, maxRate] = getPromotionRange();

  useEffect(() => {
    if (formData.rate < minRate) {
      setWarning(`Warning: Offers below the creator's asking range ($${minRate} - $${maxRate}) are usually rejected.`);
    } else {
      setWarning('');
    }
  }, [formData.rate, minRate, maxRate]);

  const handleSubmit = async () => {
    const success = await submitBooking(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Book a Promotion</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Instructions will be emailed to you.</Typography>
        <TextField
          label="Partnership Name"
          fullWidth
          name="partnershipName"
          value={formData.partnershipName}
          onChange={handleChange}
          margin="dense"
          required
        />
        <TextField
          select
          label="Promotion Type"
          fullWidth
          name="selectedPromotion"
          value={formData.selectedPromotion}
          onChange={handleChange}
          margin="dense"
          required
        >
          {promotionData.map((promo) => (
            <MenuItem key={promo.name} value={promo.name}>{`Recommended Price: ${promo.name} - ${promo.lowest.value} to ${promo.highest.value}`}</MenuItem>
          ))}
        </TextField>
        <Typography gutterBottom>
          Your Budget: ${formData.rate}
        </Typography>
        <Slider
          value={formData.rate}
          onChange={handleSliderChange}
          min={minRate}
          max={maxRate}
          step={1}
          valueLabelDisplay="auto"
        />
        {warning && <Typography color="error">{warning}</Typography>}
        <TextField
          label="Email"
          type="email"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="dense"
          required
        />
        <TextField
          id="date-picker"
          label="Select Date"
          type="date"
          fullWidth
          variant="outlined"
          name="selectedDate"
          value={formData.selectedDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          margin="dense"
          required
        />
        <TextField
          label="Details"
          fullWidth
          multiline
          rows={4}
          name="details"
          value={formData.details}
          onChange={handleChange}
          margin="dense"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;
