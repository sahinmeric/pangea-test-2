import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Switch,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Paper,
} from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ShareIcon from "@mui/icons-material/Share";
import { useIsMounted } from "../../../Hooks/use-is-mounted";
import { useMutation } from "react-query";
import client from "../../../API";
import CampaignDetailDialog from "./campaignsDialog/campaignsDialogMain";
import useAuth from "../../../Hooks/use-auth";
import Partnerships from "./projectcomponents/partnerships";
import MiscProjects from "./miscProjects/miscprojects";
import { StyledTableRow, StyledTableCell } from "../../../Utils/styledcell";
import CampaignCardList from "./campaignCardList";

function formatIdealDueDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year}`;
  }
}

function summarizeText(text, maxLength = 50) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}
const formatProposalDate = (dateString) => {
  const date = new Date(dateString);
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${date.getFullYear().toString().substr(-2)}`;
};
const Campaigns = () => {
  const isMounted = useIsMounted();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [managers, setManagers] = useState([]);
  const [currentManager, setCurrentManager] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [blitzAutoCampaign, setBlitzAutoCampaign] = useState(false);

  const [selectedAction, setSelectedAction] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const [creatorsToRemove, setCreatorsToRemove] = useState([]);
  const [view, setView] = useState("campaigns");
  const [tabValue, setTabValue] = useState("All");
  const [isPrettyView, setIsPrettyView] = useState(true);

  const { getCurrrentUser } = useAuth();
  const currentUser = getCurrrentUser();
  const currentUserId = currentUser.id;
  const userCompany = currentUser.company_name;
  const isTcc = userCompany === "TCC";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.companies.listUsers();
        setManagers(data);
      } catch (error) {
        setManagers([]);
      }
    };
    if (!isTcc) return;
    fetchData();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [tabValue, searchQuery, currentManager]);

  const handleToggleChange = async (event) => {
    const newBlitzAutoCampaignValue = event.target.checked;
    setBlitzAutoCampaign(newBlitzAutoCampaignValue);
    setDialogContent((prevState) => ({
      ...prevState,
      blitz_autocampaign: newBlitzAutoCampaignValue,
    }));
  };

  const { mutate: fetchCampaigns } = useMutation(client.campaigns.list, {
    onSuccess: (data) => {
      let filteredData = data;
      filteredData = filteredData.map((campaign) => ({
        ...campaign,
        creators: JSON.parse(campaign.creators),
      }));
      setCampaigns(filteredData);
      setFilteredCampaigns(filteredData);
    },
    onError: (error) => {
      console.error("Error fetching campaigns:", error);
    },
  });

  useEffect(() => {
    if (!isMounted) return;
    fetchCampaigns();
  }, [isMounted]);

  const handleActionChange = (event) => {
    setSelectedAction(event.target.value);
  };

  const handleCheckboxChange = (campaignId) => {
    const selectedIndex = selectedCampaigns.indexOf(campaignId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCampaigns, campaignId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedCampaigns.slice(1));
    } else if (selectedIndex === selectedCampaigns.length - 1) {
      newSelected = newSelected.concat(selectedCampaigns.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedCampaigns.slice(0, selectedIndex),
        selectedCampaigns.slice(selectedIndex + 1)
      );
    }

    setSelectedCampaigns(newSelected);
  };

  const handleRowDoubleClick = (campaign) => {
    setDialogContent(campaign);
    setOpenDialog(true);
  };
  const handleOpenDialog = useCallback((campaignData) => {
    setDialogContent(campaignData);
    setOpenDialog(true);
  });
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const formatCampaignSum = (sum) => {
    const numericSum = typeof sum === "number" ? sum : parseFloat(sum.replace(/[^\d.]/g, ""));
    return `$${numericSum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };
  const { mutate: deleteCampaign, isLoading: isDeletingCampaign } = useMutation(
    client.campaigns.delete,
    {
      onSuccess: (data) => {
        console.log(data);
        alert("Campaign deleted successfully!");
        fetchCampaigns();
      },
      onError: (error) => {
        console.error("Error deleting campaign:", error);
        alert("Error deleting campaign: " + error.message);
      },
    }
  );

  const { mutate: updateCampaignStatus, isLoading: isUpdatingCampagingStatus } =
    useMutation(client.campaigns.update, {
      onSuccess: (data) => {
        console.log(data);
        alert("Campaign status updated successfully!");
        fetchCampaigns();
      },
      onError: (error) => {
        console.error("Error updating campaign:", error);
        alert("Error updating campaign: " + error.message);
      },
    });

  const applyAction = async () => {
    if (selectedAction.length === 0) {
      alert("Please choose action!");
      return;
    }
    if (selectedAction === "delete") {
      deleteCampaign({ id: selectedCampaigns });
    } else if (selectedAction === "archive" || selectedAction === "pause") {
      const status = selectedAction === "archive" ? "Archived" : "Paused";
      updateCampaignStatus({ campaignIds: selectedCampaigns, status });
    }
    setSelectedCampaigns([]);
  };

  const sortedCampaigns = campaigns.sort(
    (a, b) => new Date(b.proposal_date) - new Date(a.proposal_date)
  );

  const handleSelectCampaign = (campaign) => {
    setDialogContent(campaign);
    setOpenDialog(true);
  };

  const handleShareCampaign = useCallback((campaignId) => {
    const url = `${window.location.origin}/campaigns/${campaignId}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied to clipboard!");
  });

  const handleCopyCampaign = useCallback(async (campaignId) => {
    try {
      const response = await fetch(
        "https://blitz-backend-nine.vercel.app/api/campaigns/copyCampaign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ campaignId: campaignId }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      alert(data.message);
      fetchCampaigns();
    } catch (error) {
      console.error("Failed to copy campaign:", error);
      alert("Error copying campaign");
    }
  });

  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePrettyToggleChange = (event) => {
    setIsPrettyView(event.target.checked);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filterCampaigns = () => {
    const filtered = campaigns.filter((campaign) => {
      const ifSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      let ifStatus = true;
      switch (tabValue) {
        case "All":
          ifStatus = campaign.campaign_status !== "Archived";
          break;
        case "Draft":
          ifStatus = campaign.campaign_status === "Draft";
          break;
        case "Archived":
          ifStatus = campaign.campaign_status === "Archived";
          break;
        case "Completed":
          ifStatus = campaign.campaign_status === "Completed";
          break;
        case "Launched":
          ifStatus = campaign.campaign_status === "Launched";
          break;
        default:
          break;
      }
      const ifManager = currentManager !== '' ? campaign.campaign_manager && campaign.campaign_manager.email === currentManager : true;

      return ifSearch && ifStatus && ifManager;
    });

    setFilteredCampaigns(filtered);
  };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          sx={{ textAlign: "center" }}
        >
          Your Projects
        </Typography>
        <Tabs
          value={view}
          onChange={handleViewChange}
          centered
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Campaigns" value="campaigns" />
          <Tab label="Partnerships" value="partnerships" />
          <Tab label="Misc" value="misc" />
        </Tabs>
        {view === "campaigns" && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                my: 4,
                width: '100%',
                boxSizing: 'border-box',
                overflowX: 'auto',
                padding: 0
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ minWidth: 240 }}
              />
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 240 }}
              >
                <InputLabel id="action-type-label">
                  Action Type
                </InputLabel>
                <Select
                  labelId="action-type-label"
                  value={selectedAction}
                  onChange={handleActionChange}
                  label="Action Type"
                >
                  <MenuItem value="edit">Edit</MenuItem>
                  <MenuItem value="delete">Delete</MenuItem>
                  <MenuItem value="archive">Archive</MenuItem>
                  <MenuItem value="pause">Pause</MenuItem>
                </Select>
              </FormControl>
              {isTcc && managers && managers.length > 0 && (
                <FormControl variant="outlined"
                  size="small"
                  sx={{ minWidth: 240 }}>
                  <InputLabel id="label-managears">Manager</InputLabel>
                  <Select
                    value={currentManager}
                    onChange={(e) => setCurrentManager(e.target.value)}
                    label="label-managers"
                  >
                    <MenuItem value={''}>
                      None
                    </MenuItem>
                    {managers.map((manager, index) => (
                      <MenuItem value={manager.email} key={index}>
                        {manager.first_name} {manager.last_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Typography>Make it Pretty</Typography>
              <Switch
                checked={isPrettyView}
                onChange={handlePrettyToggleChange}
                color="secondary"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={applyAction}
                startIcon={
                  (isDeletingCampaign || isUpdatingCampagingStatus) && (
                    <CircularProgress size={20} color="inherit" />
                  )
                }
              >
                Apply
              </Button>
            </Box>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All" value="All" />
              <Tab label="Draft" value="Draft" />
              <Tab label="Archived" value="Archived" />
              <Tab label="Completed" value="Completed" />
              <Tab label="Launched" value="Launched" />
            </Tabs>
            {isPrettyView ? (
              <CampaignCardList campaigns={filteredCampaigns} handleOpenDialog={handleOpenDialog} handleShareCampaign={handleShareCampaign} handleCopyCampaign={handleCopyCampaign}></CampaignCardList>
            ) : (
              <TableContainer component={Paper} sx={{ maxWidth: "80vw", marginInline: "auto" }}>
                <Table aria-label="campaigns table" width={"100%"}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Select</StyledTableCell>
                      <StyledTableCell>Campaign Name</StyledTableCell>
                      {isTcc && <StyledTableCell>Manager</StyledTableCell>}
                      <StyledTableCell>Brief</StyledTableCell>
                      <StyledTableCell>Campaign Sum</StyledTableCell>
                      <StyledTableCell>Proposal Date</StyledTableCell>
                      <StyledTableCell>Product Type</StyledTableCell>
                      <StyledTableCell>Creators</StyledTableCell>
                      <StyledTableCell>Ideal Due Date</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Created By / Company Name</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.map((campaign) => (
                        <StyledTableRow
                          key={campaign.id}
                          onDoubleClick={() => handleRowDoubleClick(campaign)}
                          hover
                        >
                          <StyledTableCell padding="checkbox">
                            <Checkbox
                              checked={
                                selectedCampaigns.indexOf(campaign.id) !== -1
                              }
                              onChange={() => handleCheckboxChange(campaign.id)}
                            />
                          </StyledTableCell>
                          <StyledTableCell
                            onClick={() => handleOpenDialog(campaign)}
                            sx={{
                              maxWidth: "6rem",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            {campaign.name}
                          </StyledTableCell>
                          {isTcc && campaign.campaign_manager ? (
                            <StyledTableCell>
                              {`${campaign.campaign_manager.name} \n ${campaign.campaign_manager.email}`}
                            </StyledTableCell>
                          ) : null}
                          <StyledTableCell sx={{ maxWidth: "20rem", overflow: "clip" }}>
                            {summarizeText(campaign.brief)}
                          </StyledTableCell>
                          <StyledTableCell>
                            {formatCampaignSum(campaign.campaign_sum)}
                          </StyledTableCell>
                          <StyledTableCell>
                            {formatProposalDate(campaign.proposal_date)}
                          </StyledTableCell>
                          <StyledTableCell>
                            {campaign.campaign_type}
                          </StyledTableCell>
                          <StyledTableCell sx={{ maxWidth: "15rem" }}>
                            {campaign.creators
                              .map((creator) => creator.name)
                              .join(", ")}
                          </StyledTableCell>
                          <StyledTableCell>
                            {formatIdealDueDate(campaign.ideal_duedate)}
                          </StyledTableCell>
                          <StyledTableCell>
                            {campaign.campaign_status}
                          </StyledTableCell>
                          <StyledTableCell>
                            {campaign.user
                              ? `${campaign.user.first_name} ${campaign.user.last_name} / ${campaign.user.company_name}`
                              : "N/A"}
                          </StyledTableCell>
                          <StyledTableCell>
                            <IconButton
                              onClick={() => handleShareCampaign(campaign.id)}
                            >
                              <ShareIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleCopyCampaign(campaign.id)}
                            >
                              <FileCopyIcon />
                            </IconButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <TableRow>
                        <StyledTableCell colSpan="13" align="center">
                          No campaigns available
                        </StyledTableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        {view === "partnerships" && <Partnerships />}
        {view === "misc" && <MiscProjects />}
      </Box>
      <CampaignDetailDialog
        selectedAction={selectedAction}
        dialogContent={dialogContent}
        setDialogContent={setDialogContent}
        openDialog={openDialog}
        fetchCampaigns={fetchCampaigns}
        handleCloseDialog={handleCloseDialog}
        handleToggleChange={handleToggleChange}
        creatorsToRemove={creatorsToRemove}
        setCreatorsToRemove={setCreatorsToRemove}
        blitzAutoCampaign={blitzAutoCampaign}
        managers={managers}
        isTcc={isTcc}
        currentUserId={currentUserId}
      />
    </>
  );
};

export default Campaigns;