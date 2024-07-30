import React, { useState, useEffect } from "react";
import { Button, Checkbox, IconButton, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import PayoutDialog from "../payoutdialog";
import { drawerWidth } from "../../../../Utils/constants";
import { useIsMounted } from "../../../../Hooks/use-is-mounted";
import {
  StyleButton,
  StyleContent,
  StyleStickyButtonContainter, StyleContentWithNavBar
} from "../../../../Utils/ThemedStyles";

const PayoutDetailsView = () => {
  const isMounted = useIsMounted();
  const [payouts, setPayouts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isPayoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [editingPayout, setEditingPayout] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const { mutate: fetchPayouts } = useMutation(client.payouts.listAdmin, {
    onSuccess: (data) => {
      setPayouts(data.payouts);
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching payouts:", error);
    },
  });

  useEffect(() => {
    isMounted && fetchPayouts();
  }, [isMounted]);

  const onDeletePayouts = async () => {
    if (selectedIds.length > 0) {
      try {
        const data = await client.payouts.delete({ payoutIds: selectedIds });
        console.log("Deletion successful", data);
        fetchPayouts();
        setSelectedIds([]);
      } catch (error) {
        console.error("Error deleting payouts", error);
      }
    }
  };

  const handleDialogOpen = (payout) => {
    setEditingPayout(payout);
    setPayoutDialogOpen(true);
  };

  const handleDialogClose = () => {
    setPayoutDialogOpen(false);
    setEditingPayout(null);
  };

  const handleSelectPayout = (payoutId) => {
    const newSelectedIds = selectedIds.includes(payoutId)
      ? selectedIds.filter(id => id !== payoutId)
      : [...selectedIds, payoutId];
    setSelectedIds(newSelectedIds);
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredPayouts = statusFilter
    ? payouts.filter(payout => payout.status === statusFilter)
    : payouts;

  return (
    <Box sx={StyleContentWithNavBar}>
      <Box sx={StyleStickyButtonContainter}>
        <Button
          variant="contained"
          onClick={onDeletePayouts}
          startIcon={<DeleteIcon />}
          disabled={!selectedIds.length}
          sx={StyleButton}
        >
          Delete Selected
        </Button>
        <FormControl variant="outlined" sx={{ minWidth: 120, }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>

            <MenuItem value="approved">Approved</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={(theme) => ({ marginTop: theme.spacing(2) })}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filteredPayouts.length}
                  checked={selectedIds.length === filteredPayouts.length && filteredPayouts.length > 0}
                  onChange={(event) => setSelectedIds(
                    event.target.checked ? filteredPayouts.map((n) => n.id) : []
                  )}
                />
              </TableCell>
              <TableCell>Payout ID</TableCell>
              <TableCell>PO Number</TableCell>
              <TableCell>Creator Name</TableCell>
              <TableCell>Creator Payout Destination</TableCell>
              <TableCell>Payout Date</TableCell>
              <TableCell>Is Creator Connected</TableCell>
              <TableCell>Preferred Payout</TableCell>
              <TableCell>StripeID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>BlitzPay</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Amount to Send</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayouts.map((payout) => (
              <StyledTableRow key={payout.id}>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    onChange={() => handleSelectPayout(payout.id)}
                    checked={selectedIds.includes(payout.id)}
                  />
                </StyledTableCell>
                <StyledTableCell>{payout.id}</StyledTableCell>
                <StyledTableCell>{payout.po_number}</StyledTableCell>
                <StyledTableCell>{payout.creatorName}</StyledTableCell>
                <StyledTableCell>{payout.creatorPayoutEmail}</StyledTableCell>
                <StyledTableCell>{payout.payout_date}</StyledTableCell>
                <StyledTableCell>{payout.isCreatorConnected}</StyledTableCell>
                <StyledTableCell>{payout.preferredPayout}</StyledTableCell>
                <StyledTableCell>{payout.stripeID}</StyledTableCell>
                <StyledTableCell>{payout.status}</StyledTableCell>
                <StyledTableCell>{payout.blitzpay ? "Yes" : "No"}</StyledTableCell>
                <StyledTableCell>${payout.amount}</StyledTableCell>
                <StyledTableCell>
                  {payout.blitzpay ? (
                    `${payout.creatorStatus.toLowerCase() === 'partner'
                      ? (payout.amount * (1 - 0.027)).toFixed(2)  // 2.7% for partners
                      : (payout.amount * (1 - 0.05)).toFixed(2)   // 5% for others
                    } (${payout.creatorStatus})`
                  ) : payout.amount}
                </StyledTableCell>
                <StyledTableCell>{payout.clientName}</StyledTableCell>
                <StyledTableCell>{payout.companyName}</StyledTableCell>
                <StyledTableCell>
                  <IconButton onClick={() => handleDialogOpen(payout)}>
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isPayoutDialogOpen && (
        <PayoutDialog
          open={isPayoutDialogOpen}
          onClose={handleDialogClose}
          payoutInfo={editingPayout}
        />
      )}
    </Box>
  );
};

export default PayoutDetailsView;
