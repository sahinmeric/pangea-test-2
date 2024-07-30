import React, { useState, useEffect } from "react";
import { Button, Checkbox, IconButton, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LinkIcon from "@mui/icons-material/Link";
import { useMutation } from "react-query";
import client from "../../../../API";
import { StyledTableRow, StyledTableCell } from "../../../../Utils/styledcell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import InvoiceDialog from "../invoicedialog";
import { drawerWidth } from "../../../../Utils/constants";
import { useIsMounted } from "../../../../Hooks/use-is-mounted";
import { StyleButtonContainter, StyleButton, StyleContent, StyleContentWithNavBar } from "../../../../Utils/ThemedStyles";

const InvoiceDetailsView = () => {
  const isMounted = useIsMounted();
  const [invoices, setInvoices] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isInvoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const { mutate: fetchInvoices } = useMutation(client.invoices.listAdmin, {
    onSuccess: (data) => {
      setInvoices(data.invoices);
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  useEffect(() => {
    isMounted && fetchInvoices();
  }, [isMounted]);

  const onDeleteInvoices = async () => {
    if (selectedIds.length > 0) {
      try {
        const data = await client.invoices.delete({ invoiceIds: selectedIds })
        console.log("Deletion successful", data);
        fetchInvoices();
        setSelectedIds([]);

      } catch (error) {
        console.error("Error deleting invoices", error);
      }
    }
  };

  const handleDialogOpen = (invoice) => {
    setEditingInvoice(invoice);
    setInvoiceDialogOpen(true);
  };

  const handleLink = (invoice) => {
    window.open(`https://blitzpay.pro/invoicing/${invoice.id}`, "_blank");
  };

  const handleDialogClose = () => {
    setInvoiceDialogOpen(false);
    setEditingInvoice(null);
  };

  const handleSelectInvoice = (invoiceId) => {
    const newSelectedIds = selectedIds.includes(invoiceId)
      ? selectedIds.filter(id => id !== invoiceId)
      : [...selectedIds, invoiceId];
    setSelectedIds(newSelectedIds);
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredInvoices = statusFilter
    ? invoices.filter(invoice => invoice.status === statusFilter)
    : invoices;

  return (
    <Box sx={StyleContentWithNavBar}>
      <Box sx={StyleButtonContainter}>
        <Button
          variant="contained"
          onClick={onDeleteInvoices}
          startIcon={<DeleteIcon />}
          disabled={!selectedIds.length}
          sx={StyleButton}
        >
          Delete Selected
        </Button>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Sent">Sent</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={(theme) => ({ marginTop: theme.spacing(2) })}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filteredInvoices.length}
                  checked={selectedIds.length === filteredInvoices.length && filteredInvoices.length > 0}
                  onChange={(event) => setSelectedIds(
                    event.target.checked ? filteredInvoices.map((n) => n.id) : []
                  )}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Payment Name</TableCell>
              <TableCell>PO Number</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date Issued</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <StyledTableRow key={invoice.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    onChange={() => handleSelectInvoice(invoice.id)}
                    checked={selectedIds.includes(invoice.id)}
                  />
                </TableCell>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.campaign_name}</TableCell>
                <TableCell>{invoice.po_number}</TableCell>
                <TableCell>{invoice.amount_due}</TableCell>
                <TableCell>{invoice.created_at}</TableCell>
                <TableCell>{invoice.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDialogOpen(invoice)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleLink(invoice)}>
                    <LinkIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isInvoiceDialogOpen && (
        <InvoiceDialog
          open={isInvoiceDialogOpen}
          onClose={handleDialogClose}
          invoiceInfo={editingInvoice}
        />
      )}
    </Box>
  );
};

export default InvoiceDetailsView;
