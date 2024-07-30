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
    Divider
  } from "@mui/material";
import { useMutation } from "react-query";
import client from "../../API";
import { useIsMounted } from "../../Hooks/use-is-mounted";

const BatchPayCreatorDialog = ({ open, onClose }) => {
    const [batchPayouts, setBatchPayouts] = useState([
      { paymentAmount: "", selectedCreator: null, bypassSMSVerification: false },
      { paymentAmount: "", selectedCreator: null, bypassSMSVerification: false },
    ]);
    const [notes, setNotes] = useState("");
    const [poNumber, setPoNumber] = useState("");
    const [creators, setCreators] = useState([]);
  
    const { mutate: fetchCreatorsData } = useMutation(() => client.creators.list({ is_vendor: true }), {
      onSuccess: (data) => {
        setCreators(data.map(creator => ({ ...creator, label: creator.creator })));  // Ensure this aligns with your actual data structure
      },
      onError: (error) => console.error("Error fetching creators:", error),
    });
  
    const { mutate: createBatchPayout } = useMutation(client.payouts.createBatch, {
      onSuccess: (data) => {
        console.log("Batch payout successful:", data);
        onClose(); // Consider passing some state or identifier if needed
      },
      onError: (error) => {
        console.error("Error during batch payout creation:", error);
        onClose();

      }
    });
  
    const handleSubmit = () => {
      const payload = {
        payouts: batchPayouts.map(payout => ({
          creator_id: payout.selectedCreator?.creator,  // Ensure that `id` is the correct identifier
          amount: payout.paymentAmount,
          bypassSMSVerification: payout.bypassSMSVerification
        })),
        notes,
        poNumber
      };
  
      createBatchPayout(payload);
      onClose();

    };
  
    useEffect(() => {
      if (open) {
        fetchCreatorsData(); // Call to fetch creators only when the dialog is open
      }
    }, [open, fetchCreatorsData]);
  
    const handleChange = (index, field, value) => {
      const updatedBatchPayouts = batchPayouts.map((payout, idx) =>
        idx === index ? { ...payout, [field]: value } : payout
      );
      setBatchPayouts(updatedBatchPayouts);
    };
  const handleGeneratePO = () => {
    setPoNumber(`TCC-${Math.floor(Math.random() * 1000000)}`);
  };

 
  const handleAddPayout = () => {
    setBatchPayouts([
      ...batchPayouts,
      {
        paymentAmount: "",
        poNumber: "",
        notes: "",
        selectedCreator: null,
        bypassSMSVerification: false,
      },
    ]);
  };

  const handleRemovePayout = (index) => {
    const newBatch = [...batchPayouts];
    newBatch.splice(index, 1);
    setBatchPayouts(newBatch);
  };


  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Batch Pay Creators</DialogTitle>
      <DialogContent>
        {batchPayouts.map((payout, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Autocomplete
              options={creators}
              getOptionLabel={(option) => option.label || ""}
              value={payout.selectedCreator}
              onChange={(event, newValue) =>
                handleChange(index, "selectedCreator", newValue)
              }
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
              label="Payment Amount"
              type="number"
              fullWidth
              value={payout.paymentAmount}
              onChange={(e) =>
                handleChange(index, "paymentAmount", e.target.value)
              }
              variant="outlined"
              required
            />
            <FormControlLabel
                            control={
                                <Checkbox
                                    checked={payout.bypassSMSVerification}
                                    onChange={(e) => handleChange(index, "bypassSMSVerification", e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Bypass SMS Verification"
                        />
            {index > 0 && <Divider />}
            {index > 0 && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemovePayout(index)}
                sx={{ mt: 1 }}
              >
                Remove Creator
              </Button>
            )}
          </Box>
        ))}
        <TextField
          label="PO Number"
          fullWidth
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          variant="outlined"
          required
        />
        <Button variant="outlined" onClick={handleGeneratePO}>
          Generate PO
        </Button>
        <TextField
          label="Notes"
          fullWidth
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
        />
        {batchPayouts.length < 5 && (
          <Button onClick={handleAddPayout} color="primary">
            Add Another Creator
          </Button>
        )}
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

export default BatchPayCreatorDialog;
