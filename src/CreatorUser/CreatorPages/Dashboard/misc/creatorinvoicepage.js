import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, AppBar, IconButton, Toolbar } from '@mui/material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import blitzLogo from "../../../../Components/globalAssets/platty.png";
import { ConfigValue } from '../../../../Config';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const CreatorInvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(ConfigValue.PUBLIC_REST_API_ENDPOINT + `/creatorUsers/creator-invoice/${id}`);
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleDownloadPDF = () => {
    const input = document.getElementById('invoice-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${id}.pdf`);
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
        <Box id="invoice-content" sx={{ py: 4 }}>
          <Paper sx={{ p: 4, mb: 4, bgcolor: '#fff', boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
              PANGEA OMNINATIONAL CORPORATION - DBA: The Culture Club Inc
            </Typography>
            <Typography variant="body1" align="center">8724 Cavell Lane, Houston, TX 77055</Typography>
            <Typography variant="body1" align="center">Invoice ID: {id}</Typography>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" gutterBottom>Billed To</Typography>
                <Typography variant="body1">{invoice.client_name}</Typography>
                <Typography variant="body1">{invoice.client_email}</Typography>
              </Box>
              <Box>
                <Button variant="contained" color="primary" onClick={handleDownloadPDF} sx={{ mt: 4 }}>
                  Download PDF
                </Button>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body1">Date of Issue: {formattedDate(invoice.invoice_created_at)}</Typography>
              <Typography variant="body1">Due Date: {formattedDate(invoice.payout_date)}</Typography>
              <Typography variant="body1">Invoice Number: {invoice.id}</Typography>
              <Typography variant="body1">Amount Due (USD): ${getAmountDue(invoice.amount).toFixed(2)}</Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ bgcolor: '#0000', color: '#fff' }}>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Line Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{invoice.po_number}</TableCell>
                      <TableCell>${getAmountDue(invoice.amount).toFixed(2)}</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>${getAmountDue(invoice.amount).toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body1">Subtotal: ${getAmountDue(invoice.amount).toFixed(2)}</Typography>
              <Typography variant="body1">Platform Fee: ${(getAmountDue(invoice.amount) * 0.05).toFixed(2)}</Typography>
              <Typography variant="body1">Total: ${(getAmountDue(invoice.amount) * 1.05).toFixed(2)}</Typography>
              <Typography variant="body1">Amount Paid: ${getAmountDue(invoice.amount_paid).toFixed(2)}</Typography>
              <Typography variant="body1">Amount Due (USD): ${(getAmountDue(invoice.amount) - getAmountDue(invoice.amount_paid)).toFixed(2)}</Typography>
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

export default CreatorInvoicePage;
