import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Box,
} from "@mui/material";
//import "./blitzpay.css";
import { useMutation } from "react-query";
import client from "../../API";
import { useIsMounted } from "../../Hooks/use-is-mounted";

const PayCreatorDialog = ({ open, onClose, onSubmit }) => {
  const isMounted = useIsMounted();

  const [paymentAmount, setPaymentAmount] = useState("0");
  const [poNumber, setPoNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [creators, setCreators] = useState([]);
  const [bypassSMSVerification, setBypassSMSVerification] = useState(false);
  const [includeBlitzPayFee, setIncludeBlitzPayFee] = useState(false);

  const { mutate: fetchCreatorsData } = useMutation(() => client.creators.list({ is_vendor: true }), {
    onSuccess: (data) => {
      const formattedData = data.map((creator) => ({
        ...creator,
        label: creator.creator, // Assuming 'creator' field is the name of the creator
      }));
      setCreators(formattedData);
    },
    onError: (error) => {
      console.error("Error fetching creators:", error);
    },
  });

  useEffect(() => {
    if (!isMounted) return;

    fetchCreatorsData();
  }, [isMounted]);

  const handleGeneratePO = () => {
    setPoNumber(`TCC-${Math.floor(Math.random() * 1000000)}`);
  };

  const calculateTotalAmount = () => {
    const amount = parseFloat(paymentAmount);
    return includeBlitzPayFee ? (amount * 1.05).toFixed(2) : amount.toFixed(2);
  };

  const handleSubmit = () => {
    if (!selectedCreator || !paymentAmount || !poNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    const amount = includeBlitzPayFee ? parseFloat(paymentAmount) * 1.05 : parseFloat(paymentAmount);

    const submissionData = {
      creator_id: selectedCreator.creator, // Assuming id is the correct identifier
      amount, // Ensure amount is a float
      po_number: poNumber,
      blitzPay: includeBlitzPayFee,
      bypassSMSVerification, // Include bypass flag in submission data
      notes, // Include notes in submission data
    };

    onSubmit(submissionData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Pay a Creator</DialogTitle>
      <DialogContent>
        <Autocomplete
          sx={{ marginTop: 2 }}
          options={creators}
          getOptionLabel={(option) => option.label || ""} // Use the label property
          value={selectedCreator}
          onChange={(event, newValue) => {
            setSelectedCreator(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a Creator"
              variant="outlined"
              required
            />
          )}
        />

        <TextField
          margin="dense"
          label="Payment Amount"
          type="number"
          fullWidth
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          variant="outlined"
          required
        />

        <Box display="flex" flexDirection={"row"} alignItems="center" gap={2}>
          <TextField
            margin="dense"
            label="PO #"
            fullWidth
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            variant="outlined"
            required
          />
          <Button variant="outlined" onClick={handleGeneratePO}>
            Generate PO
          </Button>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={bypassSMSVerification}
              onChange={(e) => setBypassSMSVerification(e.target.checked)}
              color="primary"
            />
          }
          label="Bypass SMS Verification"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeBlitzPayFee}
              onChange={(e) => setIncludeBlitzPayFee(e.target.checked)}
              color="primary"
            />
          }
          label={`Add 5% to total amount to cover your creator's BlitzPay fee - your new total would be $${(parseFloat(paymentAmount) * 1.05).toFixed(2)}`}
        />
        <TextField
          margin="dense"
          label="Notes"
          fullWidth
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
        />
        <Box mt={2}>
          <strong>SubTotal: ${calculateTotalAmount()}</strong>

        </Box>
        <Box> <strong>Platform Fee: ${calculateTotalAmount() * 0.05}</strong>
</Box>

<Box>           <strong>Total Amount (including 5% Platform fee): ${calculateTotalAmount() *1.05}</strong>
</Box>
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

export default PayCreatorDialog;
