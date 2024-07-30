import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TextField,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Select,
  MenuItem,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Link,
  Switch,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import client from "../../../../API";
import { ConfigValue } from "../../../../Config";
import AssetsTab from "./assets";
import Tools from "./tools";
import Conversations from "./conversations/conversationtab";
import useAuth from "../../../../Hooks/use-auth";
import TimelineTab from "./timeline";
import { StyledTableRow } from "../../../../Utils/styledcell";
import { TimelineStatus } from "../../../../Utils/constants";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

const CampaignDetailDialog = ({
  openDialog,
  handleCloseDialog,
  dialogContent,
  setDialogContent,
  handleToggleChange,
  creatorsToRemove,
  setCreatorsToRemove,
  blitzAutoCampaign,
  fetchCampaigns,
  managers,
  isTcc,
  currentUserId
}) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const navigate = useNavigate();
  const { getCurrrentUser } = useAuth();
  const currentUser = getCurrrentUser();

  const [newPrices, setNewPrices] = useState({});
  const [timelineEvents, setTimelineEvents] = useState(undefined);
  const changedEvents = useRef(false);
  const [poNumber, setPoNumber] = useState("");
  const [isChanging, setChanging] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentManager, setCurrentManager] = useState("0");
  const [toggleManager, setToggleManager] = useState(false);
  const [newAgencyRate, setNewAgencyRate] = useState({});

  const isDraft = dialogContent?.campaign_status === "Draft";
  const isLaunched = dialogContent?.campaign_status === "Launched";
  const isAgency = dialogContent?.agency === true && (dialogContent?.user_id === currentUserId || currentUser.type === "admin");

  const { isLoading, data: projectDetails, refetch } = useQuery({
    queryKey: ['campaign', dialogContent.id],
    queryFn: () => client.campaigns.details(dialogContent.id),
    enabled: !!dialogContent && openDialog,
    refetchInterval: false,
    refetchOnMount: 'always'
  }
  )

  useEffect(() => {
    if (openDialog == true) {
      changedEvents.current = false;
      //setTimelineEvents(undefined);
      refetch();
    }
  }, [openDialog]);

  useEffect(() => {
    if (projectDetails !== undefined && projectDetails !== null) {
      setTimelineEvents(projectDetails.timelineEvents.map((event)=>({...event, projected_date: new Date(event.projected_date), will_delete: false})));
      console.log("Loaded timelineEvents", projectDetails.timelineEvents)
    }
  }, [projectDetails]);

  const AddTimelineEvent = (creator) => {
    changedEvents.current = true;
    setTimelineEvents((prev) => (
      [
        ...prev,
        {
          "campaign_id": dialogContent.id,
          "id": null,
          "last_updated": null,
          "manager_completed": false,
          "objective": "",
          "projected_date": new Date(Date.now()),
          "status": TimelineStatus[0],
          "notes": "",
          "manager_notes": "",
          "username": creator,
          will_delete: false
        }
      ]
    ))
  }

  const OnEditTimelineField = (targetIndex, target, value) => {
    changedEvents.current = true;
    setTimelineEvents(timelineEvents.map((event, index) => {
      if (index === targetIndex) {
        return { ...event, [target]: value }
      }
      else
        return event;
    })
    )
  }

  const totalCampaignSum =
    dialogContent?.creators?.reduce((acc, creator) => {
      const price = parseFloat(
        (newPrices[creator.id] || creator.price || "0").toString().replace(/[^\d.]/g, "")
      );
      return acc + price;
    }, 0) || 0;

  const totalCreators = dialogContent?.creators?.length || 0;

  const creatorExpenseSum =
    dialogContent?.creators?.reduce((acc, creator) => {
      const rate = parseFloat(
        (newAgencyRate[creator.id] || creator.agencyRate || "0").toString().replace(/[^\d.]/g, "")
      );
      return acc + rate;
    }, 0) || 0;

  const toggleCreatorRemoval = (creatorId) => {
    setCreatorsToRemove((prevCreators) => {
      if (prevCreators.includes(creatorId)) {
        return prevCreators.filter((id) => id !== creatorId);
      } else {
        return [...prevCreators, creatorId];
      }
    });
    handleCreatorFieldChange(creatorId, "status", "drop");
  };

  const handleAddCreatorsClick = (campaignId) => {
    navigate(`/add-creators/${campaignId}`);
  };

  const { mutate: launchCampaign, isLoading: isLaunching } = useMutation(
    client.campaigns.launch,
    {
      onSuccess: () => {
        alert("Campaign launched successfully!");
        fetchCampaigns();
      },
      onError: (error) => {
        if (error.response && error.response.data)
          alert(`Error launching campaign: ${error.response.data.error}`);
        else
          alert(`Error launching campaign: ${error.message}`);
      },
    }
  );

  const handleLaunchCampaign = async () => {
    const creatorNames =
      dialogContent?.creators?.map((creator) => creator.name) || [];
    const creatorPromotionTypes =
      dialogContent?.creators?.map((creator) => ({
        name: creator.name,
        promotionType: createCreatorPromotionType(creator),
      })) || [];
    const creatorPrices =
      dialogContent?.creators?.reduce((acc, creator) => {
        acc[creator.name] = creator.price;
        return acc;
      }, {}) || {};

    const agencyRates = isAgency
      ? dialogContent?.creators?.reduce((acc, creator) => {
        acc[creator.name] = newAgencyRate[creator.id] || creator.agencyRate || "0";
        return acc;
      }, {}) || {}
      : {};

    setPoNumber(`PO-${Math.floor(Math.random() * 100000)}`);
    launchCampaign({
      campaignId: dialogContent?.id,
      campaignName: dialogContent?.name,
      campaignBrief: dialogContent?.brief,
      creatorNames,
      creatorPromotionTypes,
      creatorPrices,
      agencyRates,
      blitzautocampaign: blitzAutoCampaign,
      idealduedate: dialogContent?.ideal_duedate,
      userEmail: dialogContent.user_email,
      sharedWithEmail: dialogContent.shared_with_email
    });
  };

  const { mutate: completeCampaign, isLoading: isCompleting } = useMutation(
    client.campaigns.complete,
    {
      onSuccess: () => {
        alert("Campaign completed successfully");
        fetchCampaigns();
      },
      onError: (error) => {
        if (error.response && error.response.data && error.response.data.error)
          alert(`Error: ${error.response.data.error}`);
        else
          alert(`Error: ${error.message}`);
      },
    }
  );

  const { mutateAsync: updateTimeline, isLoading: isUpdatingTimeline } = useMutation(
    ({ id, input }) => client.campaigns.timeline_edit(id, input),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['campaign', dialogContent.id]);
        alert("Timeline updated succesfully.");
      },
      onError: (error) => {
        if (error.response && error.response.data && error.response.data.error)
          alert(`Error: ${error.response.data.error}`);
        else
          alert(`Error: ${error.message}`);
      },
    }
  );

  const handleCompleteCampaign = async () => {
    if (!dialogContent?.id) {
      alert("Campaign ID is missing");
      return;
    }

    const agencyRates = isAgency
      ? dialogContent?.creators?.reduce((acc, creator) => {
        acc[creator.name] = newAgencyRate[creator.id] || creator.agencyRate || "0";
        return acc;
      }, {}) || {}
      : {};

    completeCampaign({
      index: dialogContent.id, params: { poNumber, agencyRates },
    });
  };

  const handleCreatorFieldChange = (creatorId, field, value) => {
    if (field === "status" && value === "drop") {
      removeCreatorFromCampaign(creatorId);
      return;
    }

    const updatedCreators = dialogContent?.creators?.map((creator) => {
      if (creator.id === creatorId) {
        return { ...creator, [field]: value };
      }
      return creator;
    });

    setDialogContent({ ...dialogContent, creators: updatedCreators });

    if (field === "assetsApproved" && value === true) {
      handleAssetsApproved(creatorId);
    }
  };

  const handleAssetsApproved = async (creatorId) => {
    const creator = dialogContent?.creators?.find(
      (creator) => creator.id === creatorId
    );
    if (!creator || !creator.postingInstructions) {
      alert("No instructions found for creator", creatorId);
      return;
    }

    sendPostingInstructions(creatorId, creator.postingInstructions);
  };

  function createCreatorPromotionType(creator) {
    return `${creator.platform}-${creator.promotionType}`;
  }

  const removeCreatorFromCampaign = useCallback(
    (creatorId) => {
      setDialogContent((prevContent) => {
        const updatedCreators = prevContent.creators.filter(
          (creator) => creator.id !== creatorId
        );
        return { ...prevContent, creators: updatedCreators };
      });
      toggleCreatorRemoval(creatorId);
    },
    [toggleCreatorRemoval]
  );

  //TODO -> Integrate all of the following code with the api client at least

  const applyChanges = async () => {
    if (isChanging)
      return;
    setChanging(true);

    try {
      if (changedEvents.current === true) {
        console.log('Uploading events: ', timelineEvents)
        await updateTimeline({ id: dialogContent.id, input: timelineEvents.filter((event)=>(event.will_delete === false)).map(({will_delete, ...event})=>({...event, projected_date: event.projected_date.toUTCString()}))});
        changedEvents.current = false;
      }

      if (Object.keys(newPrices).length > 0) {
        await updatePrices();
        alert("Updated Prices have been applied.");
      }

      if (toggleManager)
        updateManager();

      if (creatorsToRemove.length > 0) {
        await removeCreators();
      }

      const detailsResponse = await fetch(
        `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/updateCreatorDetails`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: dialogContent?.id,
            creators: dialogContent?.creators,
            blitzAutoCampaign: dialogContent?.blitz_autocampaign,
          }),
        }
      );

      if (!detailsResponse.ok) {
        throw new Error("Failed to update campaign details.");
      }

      await updateCampaignSum();

      alert("All changes have been successfully applied.");
      fetchCampaigns();
    } catch (error) {
      alert("Failed to apply changes: " + error.message);
    } finally {
      setChanging(false);
      setTabIndex(0);
      handleCloseDialog();
    }
  };

  const updatePrices = async () => {
    const priceResponse = await fetch(
      `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/updateCreatorPrices`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: dialogContent?.id,
          newPrices,
        }),
      }
    );

    if (!priceResponse.ok) {
      const errorData = await priceResponse.json();
      throw new Error(`Failed to update prices: ${errorData.message}`);
    }

    setNewPrices({});
  };

  const updateManager = async () => {
    const managerIndex = Number.parseInt(currentManager);
    console.log("Selected manager: ", managers[managerIndex]);

    const managerResponse = await fetch(
      `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/updateManager`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: dialogContent?.id,
          manager: {
            name: `${managers[managerIndex].first_name} ${managers[managerIndex].last_name}`,
            email: managers[managerIndex].email,
            phone_number: "",
          },
        }),
      }
    );

    if (!managerResponse.ok) {
      const errorData = await managerResponse.json();
      throw new Error(`Failed to update manager: ${errorData.message}`);
    }

    setToggleManager(false);
    setCurrentManager("0");
  };

  const removeCreators = async () => {
    const removalResponse = await fetch(
      `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/removeCreators`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: dialogContent?.id,
          creatorIds: creatorsToRemove,
        }),
      }
    );

    if (!removalResponse.ok) {
      const errorData = await removalResponse.json();
      throw new Error(`Failed to remove creators: ${errorData.message}`);
    }

    setCreatorsToRemove([]);
  };

  const { mutate: doUpdateCampaginSum } = useMutation(
    client.campaigns.updateCampaignSum,
    {
      onSuccess: () => {
        alert("Campaign sum updated successfully");
        fetchCampaigns();
      },
      onError: (error) => {
        alert("Error updating campaign sum:", error);
      },
    }
  );

  const updateCampaignSum = async () => {
    const campaignSumToUpdate = totalCampaignSum;
    doUpdateCampaginSum({
      campaignId: dialogContent?.id,
      campaignSum: campaignSumToUpdate.toString(),
    });
  };

  const { mutate: sendPosting } = useMutation(
    client.campaigns.sendPostingInstructions,
    {
      onSuccess: () => {
        alert("Posting instructions sent successfully.");
      },
      onError: (error) => {
        alert(`Error sending posting instructions: ${error.message}`);
      },
    }
  );

  const sendPostingInstructions = async (creatorId, instructions) => {
    if (!creatorId || !instructions) {
      alert("Missing creator ID or instructions");
      return;
    }

    sendPosting({
      creatorId: creatorId,
      postingInstructions: instructions,
    });
  };

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      [
        "Name/ID",
        "Price",
        ...(isAgency ? ["Agency Rate"] : []),
        "Status",
        "Offer Sent",
        "Assets Sent",
        "Live Link",
        "Post Date",
        "Total Views",
        "Total Likes",
        "Total Comments",
        "Actions"
      ],
      ...dialogContent.creators.map((creator) => [
        creator.name,
        creator.price,
        ...(isAgency ? [creator.agencyRate || "0"] : []),
        creator.status,
        creator.offerSent ? "Yes" : "No",
        creator.assetsSent ? "Yes" : "No",
        creator.liveLink,
        creator.postDate,
        creator.totalViews,
        creator.likes,
        creator.comments,
        isLaunched && !creator.status ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleResendOffer(creator.id)}
          >
            Resend Offer
          </Button>
        ) : null,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${dialogContent.name}_creators.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { mutate: resendOffer, isLoading: isResending } = useMutation(
    client.campaigns.resendOffer,
    {
      onSuccess: () => {
        alert("Offer resent successfully!");
        fetchCampaigns();
      },
      onError: (error) => {
        alert(`Error resending offer: ${error.response?.data?.message ?? error.message}`);
      },
    }
  );

  const handleResendOffer = (creatorId) => {
    resendOffer({
      campaignId: dialogContent?.id,
      creatorId,
    });
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="xl"
      fullWidth
      fullScreen={!isDesktop}
      scroll="paper"
      keepMounted={false}
    >
      <DialogTitle>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={14} md={3}>
            <Typography variant="h6">
              Campaign Name: {dialogContent?.name}
            </Typography>
            <Typography variant="h6">
              Ideal Due Date: {formatIdealDueDate(dialogContent?.ideal_duedate)}
            </Typography>
            <Typography>
              {dialogContent?.drive_link && (
                <Link
                  href={dialogContent.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="text.primary"
                >
                  View Campaign Assets
                </Link>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              aria-label="campaign details tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ overflow: "visible" }}
            >
              <Tab label="Overview" />
              <Tab label="Assets" />
              <Tab label="Tools" />
              <Tab label="Conversations" />
              {isTcc && <Tab label="Timeline" />}
            </Tabs>
            <Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography>Blitz This Campaign</Typography>
              <Switch
                checked={dialogContent?.blitz_autocampaign}
                onChange={handleToggleChange}
                name="blitzautocampaign"
                inputProps={{ "aria-label": "Blitz This Campaign" }}
                disabled={dialogContent?.blitz_autocampaign}
              />
              <Tooltip title="Automate your campaigns with blitz so that the collaboration process is seamless for the creator over SMS, Whatsapp, and email. From our experience, this makes campaigns run 10x as fast!">
                <IconButton>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownloadCSV}
              >
                Download as CSV
              </Button>
            </Box>
          </Grid>
          <Grid item xs={8} md={2}>
            <TextField
              label="PO Number"
              required
              fullWidth
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </Grid>

          <Grid item xs={10} md={2}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {isDraft && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleLaunchCampaign}
                  startIcon={
                    isLaunching && (
                      <CircularProgress size={20} color="inherit" />
                    )
                  }
                >
                  Launch Campaign
                </Button>
              )}
            {isDraft && (
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAddCreatorsClick(dialogContent?.id)}
              >
                Add Creators
              </Button>
              )}

              {isLaunched && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCompleteCampaign}
                  startIcon={
                    isCompleting && (
                      <CircularProgress size={20} color="inherit" />
                    )
                  }
                >
                  Complete Campaign
                </Button>
              )}
              <Button
                variant="contained"
                color="error"
                onClick={applyChanges}
                startIcon={
                  isChanging && <CircularProgress size={20} color="inherit" />
                }
              >
                Approve Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers={true}>
        <TabPanel value={tabIndex} index={0}>
          {dialogContent?.creators ? (
            <>
              <TableContainer component={Paper} elevation={4}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {isDraft && (
                        <TableCell>Remove</TableCell>
                      )}
                      <TableCell >Name/ID</TableCell>
                      <TableCell >Price</TableCell>
                      {isAgency && (
                        <TableCell >Agency Rate</TableCell>
                      )}
                      <TableCell >Status</TableCell>
                      <TableCell >Offer Sent</TableCell>
                      <TableCell >Assets Sent</TableCell>
                      <TableCell >Live Link</TableCell>
                      <TableCell >Post Date</TableCell>
                      <TableCell >Total Views</TableCell>
                      <TableCell >Total Likes</TableCell>
                      <TableCell >
                        Total Comments
                      </TableCell>
                      {isLaunched && (
                        <TableCell >
                          Approve Assets
                        </TableCell>
                      )}
                      <TableCell >
                        Mark as Paid
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dialogContent.creators.map((creator, index) => (
                      <StyledTableRow
                        key={creator.id}
                        sx={{
                          bgcolor: creatorsToRemove.includes(creator.id)
                            ? "#ffcccc"
                            : "inherit",
                        }}
                      >
                        {isDraft && (
                          <TableCell padding="checkbox">
                            <IconButton
                              onClick={() => toggleCreatorRemoval(creator.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        )}
                        <TableCell>
                          <Link
                            href={`https://blitzpay.pro/creators/${encodeURIComponent(
                              creator.name
                            )}`}
                            target="_blank"
                          >
                            {creator.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            value={
                              newPrices[creator.id] ||
                              creator.price
                            }
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "price",
                                e.target.value
                              )
                            }
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{ fontSize: ".875rem" }}
                          />
                        </TableCell>
                        {isAgency && (
                          <TableCell>
                            <TextField
                              type="text"
                              value={
                                newAgencyRate[creator.id] ||
                                (creator.agencyRate ? creator.agencyRate : "")
                              }
                              onChange={(e) =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "agencyRate",
                                  e.target.value
                                )
                              }
                              fullWidth
                              variant="outlined"
                              size="small"
                              sx={{ fontSize: ".875rem" }}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          {blitzAutoCampaign ? (
                            creator.status
                          ) : (
                            <Select
                              value={creator.status || "Pitched"}
                              onChange={(e) =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "status",
                                  e.target.value
                                )
                              }
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                              variant="outlined"
                              size="small"
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value="Accepted">Accepted</MenuItem>
                              <MenuItem value="Declined">Declined</MenuItem>
                              <MenuItem value="Pitched">Pitched</MenuItem>
                              <MenuItem value="Approved">Approved</MenuItem>
                              <MenuItem value="Drop">Drop</MenuItem>
                              <MenuItem value="Counter">Counter</MenuItem>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {blitzAutoCampaign ? (
                            creator.offerSent ? "Yes" : "No"
                          ) : (
                            <Checkbox
                              checked={creator.offerSent || false}
                              onChange={(e) =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "offerSent",
                                  e.target.checked
                                )
                              }
                              color="primary"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {blitzAutoCampaign ? (
                            creator.assetsSent ? "Yes" : "No"
                          ) : (
                            <Checkbox
                              checked={creator.assetsSent || false}
                              onChange={(e) =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "assetsSent",
                                  e.target.checked
                                )
                              }
                              color="primary"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Live Link"
                            value={
                              creator.liveLink || ""
                            }
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "liveLink",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {blitzAutoCampaign ? (
                            creator.postDate || "N/A"
                          ) : (
                            <TextField
                              variant="outlined"
                              size="small"
                              placeholder="YYYY-MM-DD"
                              value={creator.postDate || ""}
                              onChange={(e) =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "postDate",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {blitzAutoCampaign ? (
                            creator.totalViews || "N/A"
                          ) : (
                            <TextField
                              variant="outlined"
                              size="small"
                              placeholder="Total Views"
                              value={creator.totalViews || ""}
                              onChange={(e) =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "totalViews",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {blitzAutoCampaign ? (
                            creator.likes || "N/A"
                          ) : (
                            <TextField
                              variant="outlined"
                              size="small"
                              placeholder="Likes"
                              value={creator.likes || ""}
                              onChange={(e) =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "likes",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {blitzAutoCampaign ? (
                            creator.comments || "N/A"
                          ) : (
                            <TextField
                              variant="outlined"
                              size="small"
                              placeholder="Comments"
                              value={creator.comments || ""}
                              onChange={(e) =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "comments",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        </TableCell>
                        {isLaunched && (
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                handleCreatorFieldChange(
                                  creator.id,
                                  "assetsApproved",
                                  !creator.assetsApproved
                                )
                              }
                              color={
                                creator.assetsApproved ? "success" : "default"
                              }
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </TableCell>
                        )}
                        <TableCell>
                          <Checkbox
                            checked={creator.skipPayout !== undefined ? creator.skipPayout : false}
                            onChange={(e) =>
                              handleCreatorFieldChange(
                                creator.id,
                                "skipPayout",
                                e.target.checked
                              )
                            }
                            color="primary"
                          />
                        </TableCell>
                      </StyledTableRow>
                    ))}
                    {isAgency && (
                      <StyledTableRow>
                        <TableCell colSpan={13} align="right">
                          <Typography variant="h6">
                            Creator Expense Sum: ${creatorExpenseSum.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Grid
                container
                display="flex"
                justifyContent="space-between"
                marginTop={2}
                spacing={2}
              >
                <Grid item xs={12} md={6}>
                  <Typography>
                    Total Campaign Sum: ${totalCampaignSum.toFixed(2)}
                  </Typography>
                  <Typography>Total Creators: {totalCreators}</Typography>
                  <Typography
                    variant="h6"
                    style={{ marginTop: 20, marginBottom: 10 }}
                  >
                    Campaign Manager:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2">
                        <strong>Name:</strong>{" "}
                        {dialogContent?.campaign_manager?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2">
                        <strong>Email:</strong>{" "}
                        {dialogContent?.campaign_manager?.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2">
                        <strong>Phone:</strong>{" "}
                        {dialogContent?.campaign_manager?.phone_number}
                      </Typography>
                    </Grid>
                  </Grid>
                  {isTcc && managers && managers.length > 0 && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Checkbox
                      checked={toggleManager}
                      onChange={(e) =>
                        setToggleManager(e.target.checked)}
                      color="primary"
                    />
                    <Typography>Change Manager</Typography>

                    <FormControl variant="outlined"
                      size="small"
                      sx={{ minWidth: 240 }}>
                      <InputLabel id="label-managears" >Manager</InputLabel>
                      <Select
                        value={currentManager}
                        onChange={(e) => setCurrentManager(e.target.value)}
                        label="label-managers"
                        disabled={!toggleManager}
                      >
                        {managers.map((manager, index) => (
                          <MenuItem value={index} key={index}>
                            {manager.first_name} {manager.last_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  )}

                </Grid>
                <Grid item xs={12} sm={6}></Grid>
              </Grid>
            </>
          ) : (
            <Typography>No creator data available.</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <AssetsTab
            campaignDetails={dialogContent}
            onUpdate={setDialogContent}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <Tools campaignDetails={dialogContent} onUpdate={setDialogContent} />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <Conversations
            creators={dialogContent?.creators}
            handleStatusChange={handleCreatorFieldChange}
            campaignId={dialogContent?.id}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={4}>
          <TimelineTab
            campaignDetails={dialogContent}
            timelineEvents={timelineEvents}
            onEditField={OnEditTimelineField}
            onCreateRow={AddTimelineEvent}
          />
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CampaignDetailDialog;
