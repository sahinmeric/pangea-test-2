import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
} from "@mui/material";
import { useMutation } from "react-query";
import client from "../../../../API";
import { StyledTableRow, StyledTableCell } from "../../../../Utils/styledcell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CompanyDialog from "../info";
import { useIsMounted } from "../../../../Hooks/use-is-mounted";
import { StyleButtonContainter, StyleContent, StyleContentWithNavBar } from "../../../../Utils/ThemedStyles";

const CompanyDetailsView = () => {
  const isMounted = useIsMounted();
  const [companies, setCompanies] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isPayCreatorDialogOpen, setPayCreatorDialogOpen] = useState(false);

  const { mutate: fetchCompanies } = useMutation(client.companies.list, {
    onSuccess: async (data) => {
      setCompanies(data); // Adjust based on actual API response
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  const { mutate: deleteCompanies } = useMutation(client.companies.delete, {
    onSuccess: async (data) => {
      fetchCompanies();
    },
    onError: (error) => {
      console.error("Error fetching invoices:", error);
    },
  });

  useEffect(() => {
    isMounted && fetchCompanies();
  }, [isMounted]);

  const onDeleteCompanies = () => {
    deleteCompanies({ companyIds: selectedIds });
  };

  const onCompany = () => {
    setPayCreatorDialogOpen(true);
  };

  const formatAmount = (amount) => {
    // Format the number to a currency format
    return `$${parseFloat(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const handleSelectItem = (companyId) => {
    if (selectedIds.includes(companyId)) {
      setSelectedIds(selectedIds.filter((item) => item != companyId));
    } else {
      setSelectedIds([...selectedIds, companyId]);
    }
  };

  const handleDialogClose = (bRefresh) => {
    setPayCreatorDialogOpen(false);
    bRefresh && fetchCompanies();
  };

  return (
    <Box sx={StyleContentWithNavBar}>
      <Box sx={StyleButtonContainter}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onCompany()}
        >
          Add Company
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedIds.length !== 1}
          onClick={() => onCompany()}
        >
          Edit Company
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedIds.length}
          onClick={onDeleteCompanies}
        >
          Delete Company(s)
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center">ID</StyledTableCell>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Balance</StyledTableCell>
              <StyledTableCell align="center">Seats</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Created At</StyledTableCell>
              <StyledTableCell align="center">Updated At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <StyledTableRow key={company.id}>
                <StyledTableCell align="center" style={{ width: 50 }}>
                  <Checkbox
                    color="primary"
                    checked={selectedIds.includes(company.id)}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent row click event from firing
                      handleSelectItem(company.id);
                    }}
                    inputProps={{
                      "aria-labelledby": `enhanced-table-checkbox_${company.id}`,
                    }}
                  />
                </StyledTableCell>

                <StyledTableCell align="center">{company.id}</StyledTableCell>
                <StyledTableCell align="center">{company.name}</StyledTableCell>
                <StyledTableCell align="center">
                  {formatAmount(company.balance)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {company.seats.join(", ")}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {company.account_status}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(company.account_updated).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(company.account_updated).toLocaleDateString()}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isPayCreatorDialogOpen && (
        <CompanyDialog
          open={isPayCreatorDialogOpen}
          info={
            selectedIds.length > 0
              ? companies.filter((item) => item.id == selectedIds[0])[0]
              : undefined
          }
          onClose={handleDialogClose}
        />
      )}
    </Box>
  );
};

export default CompanyDetailsView;
