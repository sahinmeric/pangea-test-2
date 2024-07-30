import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TableHead,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "react-query";
import client from "../../../API";
import { StyledTableRow } from '../../../Utils/styledcell';

const Commissions = () => {
  const { data: commissions, error, isLoading } = useQuery('commissions', client.commissions.list);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">Error fetching commissions</Typography>;
  }

  return (
    <>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom component="div" sx={{ textAlign: "center", pt: 4 }}>
          Your Commissions
        </Typography>
        <TableContainer component={Paper} elevation={2} sx={{ width: '80%', marginInline: 'auto' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
                <TableCell align="center">PO Number</TableCell>
                <TableCell align="center">Invoice ID</TableCell>
                <TableCell align="center">Date Created</TableCell>
                <TableCell align="center">Date Paid</TableCell>
                <TableCell align="center">Commission Amount</TableCell>
                <TableCell align="center">Commission Balance</TableCell>
                <TableCell align="center">Company ID</TableCell>
                <TableCell align="center">Campaign ID</TableCell>
                <TableCell align="center">Project ID</TableCell>
                <TableCell align="center">Total Sum</TableCell>
                <TableCell align="center">Total Expense</TableCell>
                <TableCell align="center">Total Profit</TableCell>
                <TableCell align="center">Rebate Percentage</TableCell>
                <TableCell align="center">Invoice Status</TableCell>
                <TableCell align="center">Commission Paid</TableCell>
            </TableHead>
            <TableBody>
              {commissions.map(commission => (
                <StyledTableRow key={commission.id}>
                  <TableCell align="center">{commission.po_number}</TableCell>
                  <TableCell align="center">{commission.invoice_id}</TableCell>
                  <TableCell align="center">{new Date(commission.date_created).toLocaleString()}</TableCell>
                  <TableCell align="center">{commission.date_paid ? new Date(commission.date_paid).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell align="center">{commission.commission_amount}</TableCell>
                  <TableCell align="center">{commission.commission_balance}</TableCell>
                  <TableCell align="center">{commission.company_id}</TableCell>
                  <TableCell align="center">{commission.campaign_id}</TableCell>
                  <TableCell align="center">{commission.project_id}</TableCell>
                  <TableCell align="center">{commission.total_sum}</TableCell>
                  <TableCell align="center">{commission.total_expense}</TableCell>
                  <TableCell align="center">{commission.total_profit}</TableCell>
                  <TableCell align="center">{commission.rebate_percentage}</TableCell>
                  <TableCell align="center">{commission.invoice_status}</TableCell>
                  <TableCell align="center">{commission.commission_paid}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Commissions;
