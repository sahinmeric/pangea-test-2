import React, { useState, useCallback } from "react";
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
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import useAuth from "../../../../Hooks/use-auth";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': { border: 0 }
}));

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

const MiscProjDialog = ({
  openDialog,
  handleCloseDialog,
  dialogContent,
  setDialogContent,
  handleToggleChange,
  creatorsToRemove = [],
  setCreatorsToRemove,
  blitzAutoCampaign,
  managers,
  isTcc,
  currentUserId
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const navigate = useNavigate();
  const { getCurrrentUser } = useAuth();
  const currentUser = getCurrrentUser();

  const [newPrices, setNewPrices] = useState({});
  const [liveLinks, setLiveLinks] = useState({});
  const [poNumber, setPoNumber] = useState("");
  const [isChanging, setChanging] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [currentManager, setCurrentManager] = useState("0");
  const [toggleManager, setToggleManager] = useState(false);
  const [newAgencyRate, setNewAgencyRate] = useState({});

  const isDraft = dialogContent?.project_status === "Draft";
  const isLaunched = dialogContent?.project_status === "Launched";
  const isAgency = dialogContent?.agency === true && (dialogContent?.user_id === currentUserId || currentUser.status === "admin");

  const totalProjectSum =
    dialogContent?.creators?.reduce((acc, creator) => {
      const price = parseFloat(
        (newPrices[creator.id] || creator.price || "0").toString().replace(/[^\d.]/g, "")
      );
      return acc + price;
    }, 0) || 0;

  const totalCreators = dialogContent?.creators?.length || 0;

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

  const handleAddCreatorsClick = (projectId) => {
    navigate(`/add-creators/${projectId}`);
  };

  const handleLaunchProject = async () => {
    // Launch project logic (gutted)
  };

  const handleCompleteProject = async () => {
    // Complete project logic (gutted)
  };

  const handleCreatorFieldChange = useCallback(
    (creatorId, field, value) => {
      if (field === "status" && value === "drop") {
        removeCreatorFromProject(creatorId);
        return;
      }

      const updatedCreators = dialogContent?.creator_data?.map((creator) => {
        if (creator.creator_id === creatorId) {
          return { ...creator, [field]: value };
        }
        return creator;
      });

      setDialogContent({ ...dialogContent, creator_data: updatedCreators });

    },
    [dialogContent?.creator_data]
  );

  function createCreatorPromotionType(creator) {
    return `${creator.platform}-${creator.promotionType}`;
  }

  const removeCreatorFromProject = useCallback(
    (creatorId) => {
      setDialogContent((prevContent) => {
        const updatedCreators = prevContent.creator_data.filter(
          (creator) => creator.creator_id !== creatorId
        );
        return { ...prevContent, creator_data: updatedCreators };
      });
      toggleCreatorRemoval(creatorId);
    },
    [toggleCreatorRemoval]
  );

  const applyChanges = async () => {
    if (isChanging) return;
    setChanging(true);

    try {
      if (Object.keys(newPrices).length > 0) {
        // Update prices logic (gutted)
        alert("Updated Prices have been applied.");
      }

      if (toggleManager) {
        // Update manager logic (gutted)
      }

      if (creatorsToRemove.length > 0) {
        // Remove creators logic (gutted)
      }

      // Update project details logic (gutted)

      alert("All changes have been successfully applied.");
      // fetchMiscProjects logic (gutted)
    } catch (error) {
      alert("Failed to apply changes: " + error.message);
    } finally {
      setChanging(false);
      handleCloseDialog();
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Creator ID", "Name", "Affiliate Code", "Affiliate Percentage", "Delivery Address", "Delivery Confirmation Number"],
      ...dialogContent.creator_data.map((creator) => [
        creator.creator_id,
        creator.name,
        creator.affiliate_code,
        creator.affiliate_percentage,
        creator.delivery_address,
        creator.delivery_confirmation_number
      ])
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

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="xl"
      fullWidth
      fullScreen={!isDesktop}
      scroll="paper"
    >
      <DialogTitle>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={14} md={3}>
            <Typography variant="h6">
              Project Type: {dialogContent?.type}
            </Typography>
            <Typography variant="h6">
              Ideal Due Date: {formatIdealDueDate(dialogContent?.ideal_duedate)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Tabs
              value={tabIndex}
              onChange={handleChangeTab}
              aria-label="project details tabs"
              sx={{ overflow: "visible" }}
            >
              <Tab label="Overview" />
            </Tabs>
            <Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography>Blitz This Project</Typography>
              <Switch
                checked={dialogContent?.blitz_autoproject}
                onChange={handleToggleChange}
                name="blitzautoproject"
                inputProps={{ "aria-label": "Blitz This Project" }}
                disabled={dialogContent?.blitz_autoproject}
              />
              <Tooltip title="Automate your projects with blitz so that the collaboration process is seamless for the creator over SMS, Whatsapp, and email. From our experience, this makes projects run 10x as fast!">
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
        </Grid>
      </DialogTitle>

      <DialogContent dividers={true}>
        <TabPanel value={tabIndex} index={0}>
          {dialogContent?.type === "Gifting" ? (
            dialogContent?.creator_data ? (
              <>
                <TableContainer component={Paper} elevation={4}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {isDraft && <TableCell>Remove</TableCell>}
                        <TableCell>Creator ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Offer Sent</TableCell>
                        <TableCell>Post Date</TableCell>
                        <TableCell>Affiliate Code</TableCell>
                        <TableCell>Affiliate Percentage</TableCell>
                        <TableCell>Delivery Address</TableCell>
                        <TableCell>Delivery Confirmation Number</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dialogContent.creator_data.map((creator, index) => (
                        <StyledTableRow
                          key={creator.creator_id}
                          sx={{
                            bgcolor: creatorsToRemove.includes(creator.creator_id)
                              ? "#ffcccc"
                              : "inherit",
                          }}
                        >
                          {isDraft && (
                            <TableCell padding="checkbox">
                              <IconButton
                                onClick={() => toggleCreatorRemoval(creator.creator_id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
                          <TableCell>{creator.creator_id}</TableCell>
                
                          <TableCell>
                            {blitzAutoCampaign ? (
                              creator.status
                            ) : (
                              <Select
                                value={creator.status || "Pitched"}
                                onChange={(e) =>
                                  handleCreatorFieldChange(
                                    creator.creator_id,
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
                                    creator.creator_id,
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
                              creator.postDate || "N/A"
                            ) : (
                              <TextField
                                variant="outlined"
                                size="small"
                                placeholder="YYYY-MM-DD"
                                value={creator.postDate || ""}
                                onChange={(e) =>
                                  handleCreatorFieldChange(
                                    creator.creator_id,
                                    "postDate",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </TableCell>
                          <TableCell>{creator.affiliate_code}</TableCell>
                          <TableCell>{creator.affiliate_percentage}</TableCell>
                          <TableCell>{creator.delivery_address}</TableCell>
                          <TableCell>{creator.delivery_confirmation_number}</TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Grid container display="flex" justifyContent="space-between" marginTop={2} spacing={2}>
                  <Grid item xs={12} md={6}>
                    
                    <Typography
                      variant="h6"
                      style={{ marginTop: 20, marginBottom: 10 }}
                    >
                      Project Manager:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Name:</strong>{" "}
                          {dialogContent?.project_manager?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Email:</strong>{" "}
                          {dialogContent?.project_manager?.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Phone:</strong>{" "}
                          {dialogContent?.project_manager?.phone_number}
                        </Typography>
                      </Grid>
                    </Grid>
                    {isTcc && managers && managers.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Checkbox
                          checked={toggleManager}
                          onChange={(e) => setToggleManager(e.target.checked)}
                          color="primary"
                        />
                        <Typography>Change Manager</Typography>

                        <FormControl variant="outlined" size="small" sx={{ minWidth: 240 }}>
                          <InputLabel id="label-managears">Manager</InputLabel>
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
            )
          ) : dialogContent?.type === "Event Invite" ? (
            <Box>
              <Typography variant="h6">Event Details</Typography>
              <Typography><strong>Location:</strong> {dialogContent.event_details?.location}</Typography>
              <Typography><strong>Date & Time:</strong> {dialogContent.event_details?.timeDate}</Typography>
              <Typography><strong>Other Details:</strong> {dialogContent.event_details?.otherDetails}</Typography>
            </Box>
          ) : (
            <Typography>Unknown project type.</Typography>
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}></TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MiscProjDialog;
