import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  ListItemSecondaryAction,
  Drawer,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Box
} from "@mui/material";
import { styled } from '@mui/material/styles';
import DeleteIcon from "@mui/icons-material/Delete";
import CreatorDialog from "./creatorintake";
import SearchFilterSection from "../Search/leftColumnSearch";
import { useMutation } from "react-query";
import client from "../../../API";
import useAuth from "../../../Hooks/use-auth";
import { globalStyles } from "../../../Utils/Styles";

const StyleHeader = (theme) => ({
  margin: theme.spacing(1),
  fontWeight: "bold",
});

const CustomListItemText = styled(ListItemText)(({ theme }) => ({
  margin: theme.spacing(1, 0)
}));

const RightDrawerWidth = '20vw';

const classes = {
  drawer: {
    width: RightDrawerWidth,
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  drawerPaper: {
    width: RightDrawerWidth,
    boxSizing: 'border-box',
    resize: "horizontal",
    overflow: "auto",
    padding: 2,
    paddingBlockEnd: 4,
  },
  listItem: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  textField: {
    width: "100%",
  },
  dialogTitle: {
    color: "#424242",
  },
  dialogContentText: {
    color: "#424242",
  },
};

const SearchPage = () => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectedCreatorsData, setSelectedCreatorsData] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [campaignBrief, setCampaignBrief] = useState("");
  const [videoAmount, setVideoAmount] = useState("1");
  const [campaignType, setCampaignType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [campaignSum, setCampaignSum] = useState(0);
  const [idealDueDate, setIdealDueDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [selectedTab, setSelectedTab] = useState("Campaign");
  const [miscType, setMiscType] = useState("Gifting");
  const [eventDetails, setEventDetails] = useState({});
  const [managers, setManagers] = useState([]);
  const [currentManager, setCurrentManager] = useState("0");
  const [isAgency, setIsAgency] = useState(false);

  const filterRef = useRef(null);

  const { getCurrrentUser } = useAuth();
  const currentUser = getCurrrentUser();
  const userCompany = currentUser.company_name;

  useEffect(() => {
    const sum = calculateTotalCampaignSum();
    setCampaignSum(sum);
  }, [selectedCreatorsData]);

  useEffect(() => {
    if (filterRef.current) {
      setTableHeight(
        document.documentElement.offsetHeight -
        filterRef.current.clientHeight -
        82
      );
    }
  }, [filterRef]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.companies.listUsers();
        setManagers(data);
      } catch (error) {
        setManagers([]);
      }
    };
    fetchData();
  }, []);

  const calculateTotalCampaignSum = () => {
    const sum = selectedCreatorsData.reduce((accumulator, creator) => {
      const priceAsString = typeof creator.price === "string" ? creator.price : "0";
      const cleanedPriceString = priceAsString.replace(/[^0-9.-]+/g, "");
      const price = parseFloat(cleanedPriceString);
      if (isFinite(price)) {
        return accumulator + price;
      } else {
        console.error(`Invalid price format detected: ${creator.price}`);
        return accumulator;
      }
    }, 0);
    return sum;
  };

  const generateCampaignID = () => new Date().getTime().toString();

  const createProjectData = () => {
    const newCreators = selectedCreatorsData.map((creator) => {
      return {
        id: creator.id,
        name: creator.name,
        price: parseFloat(creator.price.replace(/[^0-9.-]+/g, "")),
        following: creator.following,
        promotionPlatform: creator.promotionPlatform,
        promotionType: creator.promotionType,
        platformLink: creator.platformLink,
        pfphref: creator.pfphref,
        deliveryAddress: creator.deliveryAddress,
        deliveryConfirmationNumber: creator.deliveryConfirmationNumber,
        affiliateCode: creator.affiliateCode,
        affiliatePercentage: creator.affiliatePercentage,
      };
    });

    const managerIndex = Number.parseInt(currentManager);
    const projectData = {
      id: generateCampaignID(),
      name: campaignName,
      brief: campaignBrief,
      videoAmount: parseInt(videoAmount, 10),
      campaignType:
        selectedTab === "Partnership"
          ? "partnership"
          : selectedTab === "Misc"
            ? miscType
            : campaignType,
      type: selectedTab === "Misc" ? miscType : campaignType,
      creators: newCreators,
      proposalDate: new Date().toISOString().slice(0, 10),
      campaign_sum: calculateTotalCampaignSum(),
      idealDueDate: idealDueDate,
      emailRecipient: emailRecipient,
      agency: isAgency,
      campaign_manager: {
        name: managers[managerIndex]
          ? `${managers[managerIndex].first_name} ${managers[managerIndex].last_name}`
          : "",
        email: managers[managerIndex] ? managers[managerIndex].email : "",
        phone_number: "",
      },
      description: campaignBrief,
      email: currentUser.email,
      company_id: currentUser.company_id,
      finish_date: idealDueDate,
      invoice_date: idealDueDate,
      paid_date: idealDueDate,
      total_sum: calculateTotalCampaignSum(),
      status: "pending",
      po_number: generateCampaignID(),
      drive_link: "",
      blitz_autocampaign: false,
      shared_with: [],
      tools: {},
      amount: newCreators[0]?.price,
      interest_rate: 0,
      unique_code: generateCampaignID(),
      notes: "",
      conversation_id: generateCampaignID(),
      creator: newCreators.length > 0 ? newCreators[0].id : null,
    };

    if (selectedTab === "Misc") {
      if (miscType === "Gifting") {
        projectData.creator_data = selectedCreatorsData.map((creator) => ({
          creator_id: creator.id,
          delivery_address: creator.deliveryAddress,
          delivery_confirmation_number: creator.deliveryConfirmationNumber,
          affiliate_code: creator.affiliateCode,
          affiliate_percentage: creator.affiliatePercentage,
        }));
      } else if (miscType === "Event Invite") {
        projectData.event_details = eventDetails;
        projectData.creator_data = selectedCreatorsData.map((creator) => ({
          creator_id: creator.id,
          name: creator.name,
        }));
      }
      delete projectData.campaign_sum;
      delete projectData.amount;
    }

    return projectData;
  };

  const { mutate: createProject, isLoading: isCreatingProject } = useMutation(
    (projectData) => {
      if (selectedTab === "Partnership") {
        return client.partnerships.create(projectData);
      } else if (selectedTab === "Misc") {
        return client.miscProjects.create(projectData);
      } else {
        return client.campaigns.create(projectData);
      }
    },
    {
      onSuccess: (data) => {
        console.log("Project saved successfully:", data);
        setDialogMessage("Project created successfully!");
        setOpenDialog(true);
        setSelectedItems(new Set());
        setSelectedCreatorsData([]);
        setCampaignName("");
        setCampaignBrief("");
        setIsAgency(isAgency);
      },
      onError: (error) => {
        console.error("Error saving project:", error);
        setDialogMessage(`Error: ${error.message}`);
        setOpenDialog(true);
      },
    }
  );

  const handleSelectItem = useCallback((creatorId, relevantData) => {
    if (selectedTab === "Partnership" && selectedItems.size > 0) {
      return;
    }

    const isSelected = selectedItems.has(creatorId);
    if (isSelected) {
      setSelectedItems((prev) => (prev.delete(creatorId), new Set(prev)));
    } else {
      setSelectedItems((prev) => (prev.add(creatorId), new Set(prev)));
      setIsDrawerOpen(true);
    }
    if (!isSelected) {
      setSelectedCreatorsData((prev) => [...prev, relevantData]);
    } else {
      setSelectedCreatorsData((prev) =>
        prev.filter((item) => item.id !== creatorId)
      );
    }
  }, [selectedItems, setSelectedItems, selectedCreatorsData, selectedTab]);

  const handleDeleteItem = (creatorId) => {
    setSelectedItems((prev) => (prev.delete(creatorId), new Set(prev)));
    setSelectedCreatorsData((prev) =>
      prev.filter((item) => item.id !== creatorId)
    );
  };

  const handlePriceChange = (creatorId, newPrice) => {
    setSelectedCreatorsData((prev) =>
      prev.map((creator) =>
        creator.id === creatorId ? { ...creator, price: newPrice } : creator
      )
    );
  };

  const handleCreatorDataChange = (index, key, value) => {
    setSelectedCreatorsData((prev) => {
      const updatedCreators = [...prev];
      updatedCreators[index][key] = value;
      return updatedCreators;
    });
  };

  const handleCreateProject = async () => {
    console.log("Creating project...");
    const projectData = createProjectData();
    createProject(projectData);
  };

  const handleCreatorSubmit = (formData) => {
    console.log(formData);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === "Partnership") {
      setSelectedItems(new Set());
      setSelectedCreatorsData([]);
    }
  };

  return (
    <>
      <Box sx={{ marginInlineEnd: RightDrawerWidth, boxSizing: 'border-box' }}>
        <SearchFilterSection
          onCreatorSelect={handleSelectItem}
          selectedItems={selectedItems}
        />
      </Box>
      <CreatorDialog
        open={isCreatorDialogOpen}
        onClose={() => setIsCreatorDialogOpen(false)}
        onSubmit={handleCreatorSubmit}
      />
      <Drawer
        sx={classes.drawer}
        variant="persistent"
        anchor="right"
        open={isDrawerOpen}
        PaperProps={{ sx: classes.drawerPaper, elevation: 3 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={StyleHeader}
          align="center"
        >
          Project Builder
        </Typography>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab value="Campaign" label="Campaign" />
          <Tab value="Partnership" label="Partnership" />
          <Tab value="Misc" label="Misc" />
        </Tabs>
        <Divider style={{ margin: "10px 0" }} />
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              label="Project Name"
              variant="outlined"
              fullWidth
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Project Brief"
              variant="outlined"
              fullWidth
              minRows={4}
              multiline={true}
              value={campaignBrief}
              onChange={(e) => setCampaignBrief(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="date-picker"
              label="Due Date"
              type="date"
              fullWidth
              variant="outlined"
              value={idealDueDate}
              onChange={(e) => setIdealDueDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Recipient"
              variant="outlined"
              fullWidth
              value={emailRecipient}
              onChange={(e) => setEmailRecipient(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={isAgency}
                  onChange={(e) => setIsAgency(e.target.checked)}
                  color="primary"
                />
              }
              label="Agency"
            />
          </Grid>
          {userCompany === "TCC" && managers && managers.length > 0 && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Manager</InputLabel>
                <Select
                  value={currentManager}
                  onChange={(e) => setCurrentManager(e.target.value)}
                  label="Manager"
                >
                  {managers.map((manager, index) => (
                    <MenuItem value={index} key={index}>
                      {manager.first_name} {manager.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {selectedTab === "Misc" && (
            <>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Misc Type</InputLabel>
                  <Select
                    value={miscType}
                    onChange={(e) => setMiscType(e.target.value)}
                    label="Misc Type"
                  >
                    <MenuItem value="Gifting">Gifting</MenuItem>
                    <MenuItem value="Event Invite">Event Invite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {miscType === "Gifting" && selectedCreatorsData.map((creator, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    label="Delivery Address"
                    variant="outlined"
                    fullWidth
                    value={creator.deliveryAddress || ""}
                    onChange={(e) =>
                      handleCreatorDataChange(index, "deliveryAddress", e.target.value)
                    }
                  />
                  <TextField
                    label="Delivery Confirmation Number"
                    variant="outlined"
                    fullWidth
                    value={creator.deliveryConfirmationNumber || ""}
                    onChange={(e) =>
                      handleCreatorDataChange(index, "deliveryConfirmationNumber", e.target.value)
                    }
                  />
                  <TextField
                    label="Affiliate Code"
                    variant="outlined"
                    fullWidth
                    value={creator.affiliateCode || ""}
                    onChange={(e) =>
                      handleCreatorDataChange(index, "affiliateCode", e.target.value)
                    }
                  />
                  <TextField
                    label="Affiliate Percentage"
                    variant="outlined"
                    fullWidth
                    value={creator.affiliatePercentage || ""}
                    onChange={(e) =>
                      handleCreatorDataChange(index, "affiliatePercentage", e.target.value)
                    }
                  />
                </Grid>
              ))}
              {miscType === "Event Invite" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Event Location"
                      variant="outlined"
                      fullWidth
                      value={eventDetails.location || ""}
                      onChange={(e) =>
                        setEventDetails((prev) => ({ ...prev, location: e.target.value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Event Date and Time"
                      variant="outlined"
                      fullWidth
                      type="datetime-local"
                      value={eventDetails.timeDate || ""}
                      onChange={(e) =>
                        setEventDetails((prev) => ({ ...prev, timeDate: e.target.value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Other Details"
                      variant="outlined"
                      fullWidth
                      value={eventDetails.otherDetails || ""}
                      onChange={(e) =>
                        setEventDetails((prev) => ({ ...prev, otherDetails: e.target.value }))
                      }
                    />
                  </Grid>
                </>
              )}
            </>
          )}
          {selectedTab !== "Misc" && (
            <>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>
                    Video Amount
                  </InputLabel>
                  <Select
                    value={videoAmount}
                    onChange={(e) => setVideoAmount(e.target.value)}
                    label="Video Amount"
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>
                    Project Type
                  </InputLabel>
                  <Select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                    label="Project Type"
                  >
                    <MenuItem value="product">Product Promotion</MenuItem>
                    <MenuItem value="app">App Promotion</MenuItem>
                    <MenuItem value="website">Website Promotion</MenuItem>
                    <MenuItem value="song">Song Promotion</MenuItem>
                    <MenuItem value="Consultant">Consultant</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              align="center"
            >
              {selectedTab !== "Partnership" &&
                selectedTab !== "Misc" &&
                `Project Sum: $${campaignSum}`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <List>
              {selectedCreatorsData.map((creator, index) => (
                <ListItem key={index} sx={classes.listItem}>
                  <CustomListItemText
                    primary={`${creator.name}`}
                    secondary={`Following: ${creator.following}`}
                  />
                  {selectedTab !== "Misc" && (
                    <TextField
                      label="Price"
                      variant="outlined"
                      value={creator.price}
                      onChange={(e) =>
                        handlePriceChange(creator.id, e.target.value)
                      }
                      sx={classes.textField}
                    />
                  )}
                  <CustomListItemText
                    primary={`Promotion: ${creator.promotionPlatform} ${creator.promotionType}`}
                  />
                  <ListItemSecondaryAction
                    onClick={() => handleDeleteItem(creator.id)}
                  >
                    <IconButton
                      edge="end"
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => {
                setSelectedItems(new Set());
                setSelectedCreatorsData([]);
              }}
            >
              Remove Creators
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCreateProject}
              startIcon={
                isCreatingProject && (
                  <CircularProgress size={20} color="inherit" />
                )
              }
            >
              Create {selectedTab}!
            </Button>
          </Grid>
        </Grid>
      </Drawer>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Project Creation Status"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
          >
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchPage;
