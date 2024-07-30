import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useQuery } from 'react-query';
import { ConfigValue } from '../../../Config';

const TAX_WITHHOLDING_PERCENTAGE = 0.25; // 25% tax withholding

const PayoutsInvoicing = ({ username }) => {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [poNumber, setPoNumber] = useState('');

  const fetchPayouts = async () => {
    const response = await fetch(ConfigValue.PUBLIC_REST_API_ENDPOINT + `/creatorUsers/payouts_by_creator?username=${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched payouts:', data); // Debugging statement
    return data;
  };

  const fetchFinancials = async () => {
    const response = await fetch(ConfigValue.PUBLIC_REST_API_ENDPOINT + `/creatorUsers/financials?username=${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched financials:', data); // Debugging statement
    return data;
  };

  const { isLoading: isLoadingPayouts, error: errorPayouts, data: payouts } = useQuery(['payouts', username], fetchPayouts, {
    keepPreviousData: true
  });

  const { isLoading: isLoadingFinancials, error: errorFinancials, data: financials } = useQuery(['financials', username], fetchFinancials, {
    keepPreviousData: true
  });

  useEffect(() => {
    handleGeneratePO();
  }, []);

  const handleGeneratePO = () => {
    setPoNumber(`TCC-${Math.floor(Math.random() * 1000000)}`);
  };

  if (isLoadingPayouts || isLoadingFinancials) return <CircularProgress sx={{ color: 'white' }} />;
  if (errorPayouts) return <Typography sx={{ color: 'error' }} >Error fetching payouts: {errorPayouts.message}</Typography>;
  if (errorFinancials) return <Typography sx={{ color: 'error' }}>Error fetching financials: {errorFinancials.message}</Typography>;

  const totalEarnings = payouts?.reduce((sum, payout) => sum + payout.amount, 0) || 0;
  const taxWithholding = totalEarnings * TAX_WITHHOLDING_PERCENTAGE;

  const handleClickOpen = () => {
    setOpen(true);
    handleGeneratePO(); // Generate a new PO number each time the dialog opens
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInvoice = () => {
    fetch(ConfigValue.PUBLIC_REST_API_ENDPOINT + '/creatorUsers/create_invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: username, // Assuming username is the user ID
        creator_id: username, // Assuming username is the creator ID
        po_number: poNumber, // Use generated PO number
        amount,
        payout_date: new Date().toISOString(), // Example payout date, you should provide the actual value
        status: 'Pending', // Example status, you should provide the actual value
        blitzpay: true, // Example blitzpay value, you should provide the actual value
        unique_code: poNumber,
        interest_rate: 5, // Example interest rate, you should provide the actual value
        client_name: clientName,
        client_email: clientEmail,
        notes
      }),
    }).then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Add any additional handling if necessary
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    handleClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Invoicing and Tax Information
      </Typography>
      <Typography variant="body1">
        Total Earnings: ${totalEarnings.toFixed(2)}
      </Typography>
      <Typography variant="body1">
        Estimated Tax Withholding (25%): ${taxWithholding.toFixed(2)}
      </Typography>
      <Typography variant="body2" gutterBottom>
        Save ${taxWithholding.toFixed(2)} for taxes when you file.
      </Typography>
      <Button 
        variant="contained" 
        sx={{ mr: 1, mb: 1 }} 
        onClick={() => alert('Save for taxes')}
      >
        Save for Taxes
      </Button>
      <Button 
        variant="contained" 
        sx={{ mb: 1 }} 
        onClick={handleClickOpen}
      >
        Invoice Client
      </Button>

      <Typography variant="h6" gutterBottom>
        Payouts
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }} elevation={2}>
        <Table sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell>Payout ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payout Date</TableCell>
              <TableCell>Campaign ID</TableCell>
              <TableCell>Blitzpay</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Unique Code</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payouts && payouts.length > 0 ? payouts.map(payout => (
              <TableRow key={payout.id}>
                <TableCell>{payout.id}</TableCell>
                <TableCell>${payout.amount}</TableCell>
                <TableCell>{payout.status}</TableCell>
                <TableCell >{payout.payout_date}</TableCell>
                <TableCell >{payout.campaign_id}</TableCell>
                <TableCell >{payout.blitzpay}</TableCell>
                <TableCell >{payout.interest_rate}</TableCell>
                <TableCell >{payout.unique_code}</TableCell>
                <TableCell >{payout.notes}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No payouts available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom>
        Invoices
      </Typography>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payout Date</TableCell>
              <TableCell>Campaign ID</TableCell>
              <TableCell>Blitzpay</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Unique Code</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {financials && financials.invoices.length > 0 ? financials.invoices.map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell >${invoice.amount}</TableCell>
                <TableCell >{invoice.status}</TableCell>
                <TableCell >{invoice.payout_date}</TableCell>
                <TableCell >{invoice.campaign_id}</TableCell>
                <TableCell >{invoice.blitzpay}</TableCell>
                <TableCell >{invoice.interest_rate}</TableCell>
                <TableCell >{invoice.unique_code}</TableCell>
                <TableCell >{invoice.notes}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No invoices available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invoice Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details for the client you want to invoice.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Client Name"
            fullWidth
            variant="outlined"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Client Email"
            fullWidth
            variant="outlined"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Amount"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleInvoice}>Send Invoice</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayoutsInvoicing;
