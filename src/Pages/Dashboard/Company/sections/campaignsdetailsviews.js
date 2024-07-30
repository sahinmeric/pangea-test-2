import React, { useState, useEffect } from "react";
import { Button, Checkbox, MenuItem, Select, FormControl, InputLabel, TextField , Box} from "@mui/material";
import { useMutation } from "react-query";
import client from "../../../../API";
import { StyledTableRow, StyledTableCell } from "../../../../Utils/styledcell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { useIsMounted } from "../../../../Hooks/use-is-mounted";
import Paper from "@mui/material/Paper";
import CampaignDialog from "../campaigndialog";
import { StyleButton, StyleStickyButtonContainter, StyleContent, StyleContentWithNavBar} from "../../../../Utils/ThemedStyles";

const classes = {
  filter: {
    minWidth: 120,
  },
};

const CampaignDetailsView = () => {
  const isMounted = useIsMounted();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCampaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { mutate: fetchCampaigns } = useMutation(client.campaigns.listAdmin, {
    onSuccess: (data) => {
      setCampaigns(data);
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Error fetching campaigns:", error);
    },
  });

  useEffect(() => {
    isMounted && fetchCampaigns();
  }, [isMounted]);

  const deleteCampaignMutation = useMutation((campaignIds) =>
    client.campaigns.deleteCampaignAdmin({ campaignIds })
  );

  const onDeleteCampaigns = () => {
    if (selectedIds.length > 0) {
      deleteCampaignMutation.mutate(selectedIds, {
        onSuccess: () => {
          fetchCampaigns();
        },
        onError: (error) => {
          console.error("Error deleting campaigns:", error);
        },
      });
    }
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const onAddOrEditCampaign = () => {
    setCampaignDialogOpen(true);
  };

  const handleSelectCampaign = (campaignId) => {
    const newSelectedIds = selectedIds.includes(campaignId)
      ? selectedIds.filter((id) => id !== campaignId)
      : [...selectedIds, campaignId];
    setSelectedIds(newSelectedIds);
  };

  const handleDialogClose = (bRefresh) => {
    setCampaignDialogOpen(false);
    bRefresh && fetchCampaigns();
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCampaigns = campaigns
    .filter(campaign => statusFilter ? campaign.campaign_status === statusFilter : true)
    .filter(campaign => campaign.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Box sx={StyleContentWithNavBar}>
      <Box sx={StyleStickyButtonContainter}>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedIds.length !== 1}
          onClick={onAddOrEditCampaign}
          sx={StyleButton}
        >
          Edit Campaign
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedIds.length}
          onClick={onDeleteCampaigns}
          sx={StyleButton}
        >
          Delete Campaign(s)
        </Button>
        <FormControl variant="outlined" className={classes.filter}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TextField
        label="Search by Campaign Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        sx={(theme)=>({marginBottom: theme.spacing(2)})}
      />
      <TableContainer component={Paper} sx={(theme)=>({marginTop: theme.spacing(2)})}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filteredCampaigns.length}
                  checked={selectedIds.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                  onChange={(event) => setSelectedIds(
                    event.target.checked ? filteredCampaigns.map((n) => n.id) : []
                  )}
                />
              </TableCell>
              <TableCell>Campaign Name</TableCell>
              <TableCell>Brief</TableCell>
              <TableCell>Campaign Sum</TableCell>
              <TableCell>Proposal Date</TableCell>
              <TableCell>Product Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Creators</TableCell>
              <TableCell>Video Amount</TableCell>
              <TableCell>PO Number</TableCell>
              <TableCell>Blitz Auto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCampaigns.map((campaign) => (
              <StyledTableRow key={campaign.id}>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedIds.includes(campaign.id)}
                    onChange={() => handleSelectCampaign(campaign.id)}
                  />
                </StyledTableCell>
                <StyledTableCell>{campaign.name}</StyledTableCell>
                <StyledTableCell>{campaign.brief}</StyledTableCell>
                <StyledTableCell>{formatAmount(campaign.campaign_sum)}</StyledTableCell>
                <StyledTableCell>{campaign.proposal_date}</StyledTableCell>
                <StyledTableCell>{campaign.campaign_type}</StyledTableCell>
                <StyledTableCell>{campaign.campaign_status}</StyledTableCell>
                <StyledTableCell>
                  {JSON.parse(campaign.creators)
                    .map((creator) => creator.id)
                    .join(",")}
                </StyledTableCell>
                <StyledTableCell>{campaign.video_amount}</StyledTableCell>
                <StyledTableCell>{campaign.po_number}</StyledTableCell>
                <StyledTableCell>{campaign.blitz_autocampaign}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isCampaignDialogOpen && (
        <CampaignDialog
          open={isCampaignDialogOpen}
          info={
            selectedIds.length > 0
              ? campaigns.filter((item) => item.id === selectedIds[0])[0]
              : undefined
          }
          onClose={handleDialogClose}
        />
      )}
    </Box>
  );
};

export default CampaignDetailsView;
