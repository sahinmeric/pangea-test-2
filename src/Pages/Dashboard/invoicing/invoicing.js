import React, { useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar/NavBar";
import {
  Box,
  Typography,
  TableBody,
  TableContainer,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tabs,
  Tab,
  TextField,
  Paper,
  Link,
} from "@mui/material";
import { StyledTableRow } from "../../../Utils/styledcell";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useMutation } from "react-query";
import client from "../../../API";
import { useIsMounted } from "../../../Hooks/use-is-mounted";
import InvoiceDialog from "./invoicedialog";
import EditIcon from "@mui/icons-material/Edit";
import InvoiceEdit from "./editInvoice";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import blitzLogo from "../../../Components/globalAssets/platty.png";

const Invoicing = () => {
  const isMounted = useIsMounted();
  const [statusFilter, setStatusFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 90)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoices, setInvoices] = useState([]);
  const [incomingInvoices, setIncomingInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [campaignNames, setCampaignNames] = useState({});
  const [creatorNames, setCreatorNames] = useState({});
  const [allCreatorIds, setAllCreatorIds] = useState([]);
  const [accountBalance, setAccountBalance] = useState("Loading...");
  const [creditline, setCreditline] = useState("Loading...");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchInvoices();
  };

  const handleEditDialogOpen = (invoice) => {
    setCurrentInvoice(invoice);
    setEditOpen(true);
  };

  const handleEditDialogClose = (refresh = false) => {
    setEditOpen(false);
    setCurrentInvoice(null);
    if (refresh) {
      fetchInvoices();
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const { mutate: fetchCompanyData } = useMutation(client.companies.listFetch, {
    onSuccess: (data) => {
      if (data && data.balance !== undefined && data.credit_line !== undefined) {
        setAccountBalance(`$${parseFloat(data.balance).toFixed(2)}`);
        setCreditline(
          data.credit_line
            ? `$${parseFloat(data.credit_line).toFixed(2)}`
            : "No Credit Line Established"
        );
      } else {
        setAccountBalance("Data format error");
        setCreditline("Data format error");
      }
    },
    onError: (error) => {
      console.error("Error fetching company data:", error);
      setAccountBalance("Error loading balance");
      setCreditline("Error loading credit line");
    },
  });

  useEffect(() => {
    if (!isMounted) return;
    fetchCompanyData();
    fetchInvoices();
    fetchCampaigns();
    fetchCreators();
    fetchAllCreatorIds();
    fetchIncomingInvoices();
  }, [isMounted]);

  const { mutate: fetchInvoices } = useMutation(client.invoices.list, {
    onSuccess: (data) => {
      setInvoices(data.invoices);
      const creatorIdsFromInvoices = data.invoices
        .filter(invoice => invoice.creator_id)
        .map(invoice => invoice.creator_id);
      setAllCreatorIds(prev => Array.from(new Set([...prev, ...creatorIdsFromInvoices])));
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  const { mutate: fetchCampaigns } = useMutation(client.campaigns.list, {
    onSuccess: (data) => {
      const campaignNamesMap = {};
      data.forEach((campaign) => {
        if (campaign) {
          campaignNamesMap[campaign.id] = campaign.name;
        }
      });
      setCampaignNames(campaignNamesMap);
    },
    onError: (error) => {
      console.error("Error fetching campaigns:", error);
    },
  });

  const { mutate: fetchCreators } = useMutation(client.creators.list, {
    onSuccess: (data) => {
      const creatorNamesMap = {};
      data.forEach((creator) => {
        if (creator) {
          creatorNamesMap[creator.id] = creator.name;
        }
      });
      setCreatorNames(creatorNamesMap);
    },
    onError: (error) => {
      console.error("Error fetching creators:", error);
    },
  });

  const { mutate: fetchAllCreatorIds } = useMutation(client.payouts.list, {
    onSuccess: (data) => {
      const uniqueCreatorIds = Array.from(new Set(data.map((payout) => payout.creator_id)));
      setAllCreatorIds(prev => Array.from(new Set([...prev, ...uniqueCreatorIds])));
    },
    onError: (error) => {
      console.error("Error fetching creator IDs:", error);
    },
  });

  const { mutate: fetchIncomingInvoices } = useMutation(client.invoices.creatorList, {
    onSuccess: (data) => {
      setIncomingInvoices(data.incoming_invoices);
    },
    onError: (error) => {
      console.error("Error fetching incoming invoices:", error);
    },
  });

  useEffect(() => {
    setFilteredInvoices(
      invoices.filter(
        (invoice) =>
          (statusFilter === "" || invoice.status === statusFilter) &&
          (creatorFilter === "" || invoice.creator_id === creatorFilter) &&
          (new Date(invoice.created_at) >= new Date(startDate) && new Date(invoice.created_at) <= new Date(endDate))
      )
    );
  }, [invoices, statusFilter, creatorFilter, startDate, endDate]);

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleCreatorFilterChange = (event) => {
    setCreatorFilter(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const formatAmount = (amount) => {
    const formattedAmount = parseFloat(amount).toFixed(2);
    return `$${formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const getPaymentName = (invoice) => {
    if (invoice.campaign_id) {
      return campaignNames[invoice.campaign_id] || "Unknown Campaign";
    } else if (invoice.campaign_name) {
      return invoice.campaign_name;
    } else {
      return "Unknown Payment";
    }
  };

  const totalInvoices = invoices.length;
  const totalAmountDue = invoices.reduce(
    (acc, invoice) => acc + parseFloat(invoice.amount_due),
    0
  );
  const invoicesByStatus = invoices.reduce((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] || 0) + 1;
    return acc;
  }, {});

  const getChartData = () => {
    const sortedInvoices = [...invoices].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    const chartData = sortedInvoices.reduce((acc, invoice) => {
      const date = new Date(invoice.created_at).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.cost += parseFloat(invoice.amount_due);
      } else {
        acc.push({ date, cost: parseFloat(invoice.amount_due) });
      }
      return acc;
    }, []);
    return chartData;
  };

  const renderCampaignCostsLineChart = () => {
    const chartData = getChartData();

    return (
      <>
        <Typography variant="h6" style={{ margin: "20px 0" }}>
          Invoice Amounts Over Time
        </Typography>
        <LineChart width={500} height={300} data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cost" stroke="#8884d8" />
        </LineChart>
      </>
    );
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Add header with logo and divider
    pdf.setFillColor(0, 0, 0); // Black background
    pdf.rect(0, 0, pdfWidth, 30, "F"); // Header rectangle

    pdf.addImage(blitzLogo, "PNG", 10, 5, 50, 20); // Adjust the position as needed

    pdf.setFontSize(18);
    pdf.setTextColor(255, 255, 255); // White text color
    pdf.setFont("helvetica", "bold");
    pdf.text("Financial Statement", pdfWidth / 2, 20, { align: "center" });

    // Divider
    pdf.setDrawColor(255, 255, 255); // White divider color
    pdf.line(10, 30, pdfWidth - 10, 30);

    // Report generated timestamp
    const timestamp = new Date().toLocaleString();
    pdf.setFontSize(12);
    pdf.text(`Report generated at: ${timestamp}`, 10, 35);

    // Add account information
    pdf.setTextColor(0, 0, 0); // Reset text color to black
    pdf.text(`Account Balance: ${accountBalance}`, 10, 50);
    pdf.text(`Line of Credit: ${creditline}`, 10, 60);

    // Add table of invoices
    pdf.autoTable({
      startY: 70,
      head: [
        ["Payment Name", "PO Number", "Amount Due", "Status", "Created At", "Notes"]
      ],
      body: filteredInvoices.map(invoice => [
        getPaymentName(invoice),
        invoice.po_number || "N/A",
        formatAmount(invoice.amount_due),
        invoice.status,
        new Date(invoice.created_at).toLocaleDateString(),
        invoice.notes || ""
      ]),
      theme: "striped",
      headStyles: { fillColor: [66, 66, 66] },
      bodyStyles: { fillColor: [230, 230, 230] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    pdf.save("financial_statement.pdf");
  };

  return (
    <>
      <Paper elevation={2} square={true} sx={{ width: '100%', padding: 2, marginBlockEnd:2, overflowX:'auto'}}>
        <Typography variant="h4" gutterBottom component="div" sx={{ textAlign: "center", position:'sticky', left:0 }}>
          Invoicing
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, my: 4, width:'fit-content'}}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Upload Balance
          </Button>
          <InvoiceDialog open={open} onClose={handleClose} invoiceInfo={undefined} />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 240 }}>
            <InputLabel id="status-filter-label">
              Select Filter
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Select Filter"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Sent">Sent</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 240 }}>
            <InputLabel id="creator-filter-label">
              Select Creator
            </InputLabel>
            <Select
              labelId="creator-filter-label"
              value={creatorFilter}
              onChange={handleCreatorFilterChange}
              label="Select Creator"
            >
              <MenuItem value="">All</MenuItem>
              {allCreatorIds.map((creatorId) => (
                <MenuItem key={creatorId} value={creatorId}>
                  {creatorNames[creatorId] || `Creator ID ${creatorId}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mx: 1, minWidth: 240 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mx: 1, minWidth: 240 }}
          />
          <Button variant="contained" color="secondary" onClick={downloadPDF} sx={{minWidth: 240}}>
            Download Financial Statement
          </Button>
        </Box>
      </Paper>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h6">Summary</Typography>
        <Typography>Account Balance: {accountBalance}</Typography>
        <Typography>Line of Credit: {creditline}</Typography>
        <Typography>Total Invoices: {totalInvoices}</Typography>
        {Object.entries(invoicesByStatus).map(([status, count]) => (
          <Typography key={status}>
            {status}: {count}
          </Typography>
        ))}
      </Box>

      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="History" />
        <Tab label="Visualization" />
        <Tab label="Incoming Invoices" />
      </Tabs>
      {tabIndex === 0 && (
        <TableContainer sx={{ width: '80vw', marginInline: 'auto', marginBlockEnd:2 }} component={Paper} id="table-to-pdf" elevation={1}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" width={'100%'}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Payment Name</TableCell>
                <TableCell align="center">PO Number</TableCell>
                <TableCell align="center">Amount Due</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Created At</TableCell>
                <TableCell align="center">Notes</TableCell>
                <TableCell align="center">Invoice Link</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <StyledTableRow key={invoice.id}>
                  <TableCell align="center">
                    {getPaymentName(invoice)}
                  </TableCell>
                  <TableCell align="center">
                    {invoice.po_number || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {formatAmount(invoice.amount_due)}
                  </TableCell>
                  <TableCell align="center">
                    {invoice.status}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {invoice.notes}
                  </TableCell>
                  <TableCell align="center">
                    <Link href={`https://blitzpay.pro/invoicing/${invoice.id}`} target="_blank" rel="noopener noreferrer">
                      View Invoice
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {invoice.status !== "Paid" && (
                      <Button
                        onClick={() => handleEditDialogOpen(invoice)}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {tabIndex === 1 && (
        <Paper sx={{ textAlign: "center", mt: 4, mb: 4, overflowX:'auto', paddingInline:1, marginInline:2}} elevation={1}>
          {renderCampaignCostsLineChart()}
        </Paper>
      )}
      {tabIndex === 2 && (
        <TableContainer sx={{ width: '80vw', marginInline: 'auto', marginBlockEnd:2 }} component={Paper} id="table-to-pdf" elevation={1}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" width={'100%'}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Client Name</TableCell>
                <TableCell align="center">PO Number</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Payout Date</TableCell>
                <TableCell align="center">Notes</TableCell>
                <TableCell align="center">Invoice Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomingInvoices.map((invoice) => (
                <StyledTableRow key={invoice.id}>
                  <TableCell align="center">
                    {invoice.client_name}
                  </TableCell>
                  <TableCell align="center">
                    {invoice.po_number || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {formatAmount(invoice.amount)}
                  </TableCell>
                  <TableCell align="center">
                    {invoice.status}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(invoice.payout_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {invoice.notes}
                  </TableCell>
                  <TableCell align="center">
                    <Link href={`https://blitzpay.pro/invoicing/${invoice.id}`} target="_blank" rel="noopener noreferrer">
                      View Invoice
                    </Link>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {currentInvoice && (
        <InvoiceEdit
          open={editOpen}
          onClose={handleEditDialogClose}
          invoiceInfo={currentInvoice}
        />
      )}
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

export default Invoicing;
