import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
} from "@mui/material";
import { useMutation } from "react-query";
import PayCreatorDialog from "./payCreator";
import CreatorDialog from "./vendorintake";
import BatchPayCreatorDialog from "./batchpay";
import client from "../../API";
import { StyledTableRow } from "../../Utils/styledcell";



const BlitzPay = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [filterStatus, setFilterStatus] = useState("");
  const [isPayCreatorDialogOpen, setIsPayCreatorDialogOpen] = useState(false);
  const [payouts, setPayouts] = useState([]);
  const [filteredPayouts, setFilteredPayouts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);
  const [isBatchPayDialogOpen, setIsBatchPayDialogOpen] = useState(false);

  const { mutate: fetchPayouts } = useMutation(client.payouts.list, {
    onSuccess: (data) => {
      if (Array.isArray(data.payouts)) {
        setPayouts(data.payouts);
      } else {
        console.error("Expected an array for payouts, received:", data);
        setPayouts([]);
      }
    },
    onError: (error) => {
      console.error("Error fetching payouts:", error);
      let errorMessage = "An error occurred, please try again.";
      if (error.code === "ERR_NETWORK") {
        errorMessage = "Network is disconnected!";
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    },
  });

  useEffect(() => {
    fetchPayouts();
  }, []);

  useEffect(() => {
    if (Array.isArray(payouts)) {
      setFilteredPayouts(
        payouts.filter(
          (payout) => filterStatus === "" || payout.status === filterStatus
        )
      );
    }
  }, [payouts, filterStatus]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "pay") setIsPayCreatorDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsPayCreatorDialogOpen(false);
    setIsBatchPayDialogOpen(false);
  };

  const handleOpenBatchPayDialog = () => {
    setIsBatchPayDialogOpen(true);
  };

  const { mutate: createPayout } = useMutation(client.payouts.create, {
    onSuccess: (data) => {
      handleDialogClose();
      fetchPayouts();
    },
    onError: (error) => {
      console.error("Error creating payout:", error);
      let errorMessage = "An error occurred, please try again.";
      if (error.code == "ERR_NETWORK") {
        errorMessage = "Network is disconnected!";
      } else {
        if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }
        alert(errorMessage);
      }
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    },
  });

  const handleCreatorSubmit = (formData) => {
    setIsCreatorDialogOpen(false);
  };

  const handleDialogSubmit = (submissionData) => {
    createPayout(submissionData);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const creatorsPaid = payouts.length;
  const amountInEscrow = Array.isArray(payouts)
    ? payouts.reduce((acc, curr) => {
        if (["Pending", "queued"].includes(curr.status)) {
          const sanitizedAmount = Number(curr.amount.toString().replace(/[$,]/g, ""));
          return acc + sanitizedAmount;
        } else {
          return acc;
        }
      }, 0)
    : 0;

  const blitzPaysUsed = Array.isArray(payouts)
    ? payouts.filter((payout) => payout.blitzpay).length
    : 0;

  return (
    <>
      <Box sx={{ py: 4}}>
        <Typography variant="h4" gutterBottom component="div" sx={{ textAlign: "center" }}>
          Blitz Pay
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, my: 4, width:'100%', overflowX:'auto',boxSizing:'border-box'}}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 240, color: "white" }}>
            <InputLabel id="status-filter-label" sx={{ color: "white" }}>
              Status Filter
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status Filter"
              sx={{ color: "white" }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Sent">Sent</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={() => handleTabClick("pay")}>
            Pay a Creator
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenBatchPayDialog}>
            Batch Pay Creators
          </Button>
          <Button variant="contained" color="primary" onClick={() => setIsCreatorDialogOpen(true)}>
            Add a Vendor
          </Button>
        </Box>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h6">Summary</Typography>
          <Typography>Creators Paid: {creatorsPaid}</Typography>
          <Typography>Amount in Escrow: ${amountInEscrow}</Typography>
          <Typography>BlitzPays Used: {blitzPaysUsed}</Typography>
        </Box>
        <TableContainer sx={{width:'80%', marginInline:'auto', overflowX:'auto'}} component={Paper} elevation={1}>
          <Table aria-label="payouts table">
            <TableHead>
                <TableCell>Creator Name</TableCell>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Payout Date</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>BlitzPay</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Notes</TableCell>
            </TableHead>
            <TableBody>
              {filteredPayouts.map((payout) => (
                <StyledTableRow key={payout.payout_id || "N/A"}>
                  <TableCell>{payout.creator_id}</TableCell>
                  <TableCell>{payout.campaignname || "Creator Payout"}</TableCell>
                  <TableCell>{payout.payout_date}</TableCell>
                  <TableCell>{payout.status}</TableCell>
                  <TableCell>{payout.blitzpay ? "true" : "false"}</TableCell>
                  <TableCell>${payout.amount}</TableCell>
                  <TableCell>{payout.notes}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {isPayCreatorDialogOpen && (
        <PayCreatorDialog open={isPayCreatorDialogOpen} onClose={handleDialogClose} onSubmit={handleDialogSubmit} />
      )}
      {isBatchPayDialogOpen && (
        <BatchPayCreatorDialog open={isBatchPayDialogOpen} onClose={handleDialogClose} onSubmit={handleDialogSubmit} />
      )}
      <CreatorDialog open={isCreatorDialogOpen} onClose={() => setIsCreatorDialogOpen(false)} onSubmit={handleCreatorSubmit} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={<Button color="inherit" size="small" onClick={handleCloseSnackbar}>Close</Button>}
      />
    </>
  );
};

export default BlitzPay;
