import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
} from "@mui/material";
import client from "../../../API"; // Adjust the path to your API client
import { useMutation } from "react-query";

const PayoutsDialog = ({ open, onClose, payoutInfo = undefined }) => {
  const [poNumber, setPONumber] = useState(payoutInfo?.po_number ?? "");
  const [amount, setAmount] = useState(payoutInfo?.amount ?? ""); // Changed to 'amount' as per backend serialization
  const [status, setStatus] = useState(payoutInfo?.status ?? "");
  const [creatorName, setCreatorName] = useState(payoutInfo?.creatorName ?? "");
  const [payoutDate, setPayoutDate] = useState(payoutInfo?.payout_date ?? "");
  const [creatorPayoutEmail, setCreatorPayoutEmail] = useState(
    payoutInfo?.creatorPayoutEmail ?? "",
  );
  const [blitzPay, setBlitzPay] = useState(payoutInfo?.blitzPay ?? false);

  useEffect(() => {
    if (payoutInfo) {
      setPONumber(payoutInfo.po_number);
      setAmount(payoutInfo.amount);
      setStatus(payoutInfo.status);
      setCreatorName(payoutInfo.creatorName);
      setPayoutDate(payoutInfo.payout_date);
      setCreatorPayoutEmail(payoutInfo.creatorPayoutEmail);
      setBlitzPay(payoutInfo.blitzpay);
    }
  }, [payoutInfo]);
  const handleSubmit = async () => {
    const submissionData = {
      id: payoutInfo?.id,
      po_number: poNumber,
      amount: amount,
      status: status,
      creatorName: creatorName,
      payoutDate: payoutDate, // Verify this is not null
      creatorPayoutEmail: creatorPayoutEmail,
      blitzPay: blitzPay,
    };

    console.log("Submitting data:", submissionData); // Check what's being sent

    try {
      const data = client.payouts.editAdmin(submissionData)
      console.log("Edit successful", data);
      onClose(true);
    } catch (error) {
      console.error("Error editing payout", error);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{"Edit Payout"}</DialogTitle>
      <DialogContent>
        {/* Existing fields */}
        <TextField
          label="PO Number"
          fullWidth
          margin="dense"
          value={poNumber}
          onChange={(e) => setPONumber(e.target.value)}
          required
        />
        <TextField
          label="Creator Name"
          fullWidth
          margin="dense"
          value={creatorName}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Amount Due"
          type="number"
          fullWidth
          margin="dense"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <TextField
          label="Payout Date"
          type="date"
          fullWidth
          margin="dense"
          value={payoutDate}
          onChange={(e) => setPayoutDate(e.target.value)}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>

          </Select>
        </FormControl>
        <TextField
          label="Creator Payout Email"
          fullWidth
          margin="dense"
          value={creatorPayoutEmail}
          onChange={(e) => setCreatorPayoutEmail(e.target.value)}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="blitzPay-label">BlitzPay</InputLabel>
          <Select
            labelId="blitzPay-label"
            id="blitzPay-select"
            value={blitzPay}  // Ensure the value is a string
            label="BlitzPay"
            onChange={(e) => setBlitzPay(e.target.value === "true")}  // Correctly convert to boolean
            required
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>

        </FormControl>{" "}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayoutsDialog;
