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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Switch,
  IconButton,
  Button,
  Tabs,
  Tab
} from "@mui/material";
import { useMutation } from "react-query";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import client from "../../../../API";
import PartnershipsDialog from "./partnershipsdialog"; // Ensure correct import path
import profilePhoto from "../../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo
import { StyledTableRow } from "../../../../Utils/styledcell";

const Partnerships = () => {
  const [partnerships, setPartnerships] = useState([]);
  const [tabValue, setTabValue] = useState("Active");
  const [actionStatus, setActionStatus] = useState("");
  const [isPrettyView, setIsPrettyView] = useState(true);
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const { mutate: fetchPartnerships } = useMutation(client.partnerships.list, {
    onSuccess: (data) => {
      setPartnerships(data);
    },
    onError: (error) => {
      console.error("Error fetching partnerships:", error);
    },
  });

  const { mutate: updateStatus } = useMutation(
    ({ id, status }) => client.partnerships.updateStatus(id, { status }),
    {
      onSuccess: () => {
        fetchPartnerships();
      },
      onError: (error) => {
        console.error("Error updating partnership status:", error);
      },
    }
  );

  useEffect(() => {
    fetchPartnerships();
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleToggleChange = (event) => {
    setIsPrettyView(event.target.checked);
  };

  const handleRowClick = (partnership) => {
    setSelectedPartnership(partnership);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPartnership(null);
  };

  const handleStatusChange = (partnershipId, status) => {
    updateStatus({ id: partnershipId, status });
  };

  const handleDelete = (partnershipId) => {
    handleStatusChange(partnershipId, "DELETED");
  };

  const handleSelectChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const applyStatusChange = () => {
    selectedIds.forEach((id) => {
      handleStatusChange(id, actionStatus);
    });
    setSelectedIds([]);
  };

  const checkConversation = useMutation(client.partnershipConversations.check, {
    onSuccess: (data, variables) => {
      if (data.exists) {
        setConversationId(data.conversation_id);
        setOpenDialog(true);
      } else {
        createConversation.mutate(variables);
      }
    },
    onError: (error) => {
      console.error("Check response error:", error);
    },
  });

  const createConversation = useMutation(client.partnershipConversations.create, {
    onSuccess: (data, variables) => {
      setConversationId(data.conversation_id);
      setOpenDialog(true);
    },
    onError: (error) => {
      console.error("Create response error:", error);
    },
  });

  const startConversation = (creatorId) => {
    const payload = {
      partnership_id: selectedPartnership.id,
      creator_id: selectedPartnership.creator_id, // Ensure the creator ID is taken from selectedPartnership
    };
    console.log("Payload for starting conversation:", payload); // Debugging log
    checkConversation.mutate(payload);
  };

  const handleClosePopup = () => {
    setOpenDialog(false);
    setConversationId(null);
  };

  const filteredPartnerships = partnerships.filter(partnership => partnership.status === tabValue);

  return (
    <Box sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          my: 4,
          width:'100%',
          overflowX:'auto'
        }}
      >
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 240}}
        >
          <InputLabel id="action-status-label" >
            Change Status To
          </InputLabel>
          <Select
            labelId="action-status-label"
            value={actionStatus}
            onChange={(event) => setActionStatus(event.target.value)}
            label="Change Status To"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="Archive">Archive</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={applyStatusChange}>
          Apply Status Change
        </Button>
        <Typography>Make it Pretty</Typography>
        <Switch
          checked={isPrettyView}
          onChange={handleToggleChange}
          color="secondary"
        />
      </Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Active" value="Active" />
        <Tab label="pending" value="pending" />
        <Tab label="Archived" value="Archived" />
      </Tabs>
      {isPrettyView ? (
        <Grid container spacing={2}>
          {filteredPartnerships.map((partnership) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={partnership.id}>
              <Card sx={{ backgroundColor: "#333", color: "#fff" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={partnership.pfphref || profilePhoto} // Use pfphref if available
                  alt={partnership.creator}
                  onClick={() => handleRowClick(partnership)}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {partnership.name}
                  </Typography>
                  <Typography variant="body2">
                    Creator: {partnership.creator}
                  </Typography>
                  <Typography variant="body2">
                    Description: {partnership.description}
                  </Typography>
                  <Typography variant="body2">
                    Email: {partnership.email}
                  </Typography>
                  <Typography variant="body2">
                    Proposal Date: {partnership.proposal_date}
                  </Typography>
                  <Typography variant="body2">
                    Finish Date: {partnership.finish_date || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    Invoice Date: {partnership.invoice_date || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    Paid Date: {partnership.paid_date || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    Total Sum: {partnership.total_sum
                      ? `$${parseFloat(partnership.total_sum).toFixed(2)}`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    Status: {partnership.status}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card click from being triggered
                      handleDelete(partnership.id);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer sx={{ width: "75vw", marginInline: "auto" }}>
          <Table aria-label="partnerships table" width={"100%"}>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Partnership Name</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Proposal Date</TableCell>
                <TableCell>Finish Date</TableCell>
                <TableCell>Invoice Date</TableCell>
                <TableCell>Paid Date</TableCell>
                <TableCell>Total Sum</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPartnerships.length > 0 ? (
                filteredPartnerships.map((partnership, index) => (
                  <StyledTableRow
                    key={partnership.id}
                    hover
                    onClick={() => handleRowClick(partnership)}
                  >
                    <TableCell padding="checkbox" >
                      <Checkbox
                        checked={selectedIds.includes(partnership.id)}
                        onChange={() => handleSelectChange(partnership.id)}
                      />
                    </TableCell>
                    <TableCell >
                      {partnership.name}
                    </TableCell>
                    <TableCell >
                      {partnership.creator}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: "20rem",
                        overflow: "clip",
                      }}
                    >
                      {partnership.description}
                    </TableCell>
                    <TableCell>
                      {partnership.email}
                    </TableCell>
                    <TableCell>
                      {partnership.proposal_date}
                    </TableCell>
                    <TableCell>
                      {partnership.finish_date || "N/A"}
                    </TableCell>
                    <TableCell>
                      {partnership.invoice_date || "N/A"}
                    </TableCell>
                    <TableCell>
                      {partnership.paid_date || "N/A"}
                    </TableCell>
                    <TableCell>
                      {partnership.total_sum
                        ? `$${parseFloat(partnership.total_sum).toFixed(2)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {partnership.status}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the row click from being triggered
                          handleDelete(partnership.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="12" align="center">
                    No partnerships available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedPartnership && (
        <PartnershipsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          creator={{
            name: selectedPartnership.creator,
            pfphref: selectedPartnership.pfphref,
            id: selectedPartnership.creator_id,
          }} // Ensure the creator ID is passed correctly
          partnershipId={selectedPartnership.id}
        />
      )}
    </Box>
  );
};

export default Partnerships;
