import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, AppBar, IconButton, Toolbar } from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import blitzLogo from "../../../Components/globalAssets/platty.png";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});


const InvoicePage = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`https://blitz-backend-nine.vercel.app/api/invoice/${invoiceId}`);
        const data = await response.json();
        setInvoice(data.invoice);
        setUser(data.user);
        setCompany(data.company);
        setPayouts(data.payouts);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handleDownloadPDF = () => {
    const input = document.getElementById('invoice-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoice.id}.pdf`);
    });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!invoice) {
    return <Typography>Invoice not found.</Typography>;
  }

  const formattedDate = (date) => new Date(date).toLocaleDateString();
  const getAmountDue = (amount) => parseFloat(amount) || 0;

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ bgcolor: '#f4f4f4', color: '#333', minHeight: '100vh', p: 4 }}>
        <AppBar position="static" sx={{ backgroundColor: "#000" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <img src={blitzLogo} alt="logo" style={{ width: "120px", height: "50px" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box id="invoice-content" sx={{ py: 4}}>
          <Paper sx={{ p: 4, mb: 4}} elevation={1}>
            <Typography variant="h4" gutterBottom align="center">
              PANGEA OMNINATIONAL CORPORATION - DBA: The Culture Club Inc
            </Typography>
            <Typography variant="body1" align="center">8724 Cavell Lane, Houston, TX 77055</Typography>
            <Typography variant="body1" align="center">Invoice ID: {invoiceId}</Typography>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" gutterBottom>Billed To</Typography>
                <Typography variant="body1">{`${user?.first_name} ${user?.last_name}` || 'Client Name'}</Typography>
                <Typography variant="body1">{user?.company_name || 'Client Company'}</Typography>
              </Box>
              <Box>
                <Button variant="contained" color="primary" onClick={handleDownloadPDF} sx={{ mt: 4 }}>
                  Download PDF
                </Button>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body1">Date of Issue: {formattedDate(invoice.created_at)}</Typography>
              <Typography variant="body1">Due Date: {formattedDate(invoice.due_date)}</Typography>
              <Typography variant="body1">Invoice Number: {invoice.invoice_number}</Typography>
              <Typography variant="body1">Amount Due (USD): ${getAmountDue(invoice.amount_due).toFixed(2)}</Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead sx={{ bgcolor: '#0000', color: '#fff' }}>
                    <TableRow>
                      <TableCell>Creator ID</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Line Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{payout.creator_id}</TableCell>

                        <TableCell>{payout.description || `PO Number ${payout.po_number}`}</TableCell>
                        <TableCell>${getAmountDue(payout.amount).toFixed(2)}</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>${getAmountDue(payout.amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body1">Subtotal: ${payouts.reduce((acc, payout) => acc + getAmountDue(payout.amount), 0).toFixed(2)}</Typography>
              <Typography variant="body1">Platform Fee: ${(payouts.reduce((acc, payout) => acc + getAmountDue(payout.amount), 0) * .05).toFixed(2)}</Typography>
              <Typography variant="body1">Total: ${(payouts.reduce((acc, payout) => acc + getAmountDue(payout.amount), 0) * 1.05).toFixed(2)}</Typography>
              <Typography variant="body1">Amount Paid: ${getAmountDue(invoice.amount_paid).toFixed(2)}</Typography>
              <Typography variant="body1">Amount Due (USD): ${(getAmountDue(invoice.amount_due) - getAmountDue(invoice.amount_paid)).toFixed(2)}</Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>Terms</Typography>
              <Typography variant="body1">Make all checks payable to "DBA Pangea Omnination Corporation"</Typography>
              <Typography variant="body1">Account holder: Houston Alexander Roa</Typography>
              <Typography variant="body1">Account Name: Pangea</Typography>
              <Typography variant="body1">Address of Beneficiary: 8724 Cavell Lane, Houston, TX 77055</Typography>
              <Typography variant="body1">Name of The Bank: Prosperity Bank</Typography>
              <Typography variant="body1">Address of bank: 2117 N. Fry Road, Katy, TX 77449</Typography>
              <Typography variant="body1">Bank Account: 217841714</Typography>
              <Typography variant="body1">Swift Code: proyus44</Typography>
              <Typography variant="body1">ABA / Routing number/IBAN: 113122655</Typography>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h5">Pay with PayPal, Credit Card, and more!</Typography>
              <Button variant="contained" color="secondary" href={invoice.invoice_link} sx={{ mt: 2 }}>
                Pay Invoice
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default InvoicePage;
