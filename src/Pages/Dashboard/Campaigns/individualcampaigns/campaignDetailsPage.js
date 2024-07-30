import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../../../API"; // Ensure this is the correct path
import { useMutation } from "react-query";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Select,
  MenuItem,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Tabs, Tab, useTheme } from "@mui/material";
import routes from "../../../../Config/routes.js";
import { ConfigValue } from "../../../../Config";
import CampaignsContainers from "./creatorcontainers.js";
import blitzLogo from "../../../../Components/globalAssets/platty.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CRMDialog from "../../../Misc/crmComponents/crmPopup.js";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const CampaignDetailsPage = () => {
  const { campaignId } = useParams();
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme(); // Access theme to use in styles
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // "list" or "pretty"
  const [showCRMDialog, setShowCRMDialog] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const { mutate: fetchCampaignDetails } = useMutation(client.campaigns.fetch, {
    onSuccess: (data) => {
      try {
        const creators = JSON.parse(data.creators);
        console.log(data.creators);
        setCampaignDetails({ ...data, creators });
        if (data.campaign_status === "Draft") {
          setShowInstructions(true);
        }
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        // Handle the error appropriately, perhaps setting some error state
      }
    },
  });

  useEffect(() => {
    fetchCampaignDetails(campaignId);
  }, [campaignId]);

  useEffect(() => {
    if (campaignDetails) {
      if (
        campaignDetails.campaign_status !== "Launched" &&
        campaignDetails.campaign_status !== "Completed"
      ) {
        setViewMode("pretty");
      } else {
        setViewMode("list");
      }
    }
  }, [campaignDetails]);

  const handleCloseCRMDialog = () => {
    setShowCRMDialog(false);
  };

  const handleStatusChange = (creatorId, newStatus) => {
    console.log(`Updating status for creator ${creatorId} to ${newStatus}`);
    const payload = {
      campaignId: campaignId, // Ensure campaignId is available in this scope or passed correctly
      creators: [{ id: creatorId, status: newStatus }],
    };

    fetch(
      `${ConfigValue.PUBLIC_REST_API_ENDPOINT}/campaigns/updateCreatorStats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Status update successful:", data);
        // Update local state to reflect the new status
        if (campaignDetails && campaignDetails.creators) {
          const updatedCreators = campaignDetails.creators.map((creator) => {
            if (creator.id === creatorId) {
              return { ...creator, status: newStatus }; // Update the specific creator's status
            }
            return creator;
          });
          setCampaignDetails({ ...campaignDetails, creators: updatedCreators });
        }
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
      });
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const downloadCSV = () => {
    const csvContent = convertToCSV(campaignDetails);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `campaign_details_${campaignId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToSheets = () => {
    fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/export_to_sheets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ campaignId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.sheetLink) {
          window.open(data.sheetLink, "_blank");
        } else {
          console.error("Error exporting to Google Sheets:", data.error);
        }
      })
      .catch((error) => {
        console.error("Failed to export to Google Sheets:", error);
      });
  };

  const convertToCSV = (data) => {
    if (!data || !data.creators) return "";

    const headers = [
      "Name",
      "Following",
      "Status",
      "Price",
      "Offer Sent",
      "Assets Sent",
      "Assets Approved",
      "Promotion Type",
      "Promotion Platform",
      "Likes",
      "Comments",
      "Total Views",
      "Post Date",
      "Platform Link",
    ];

    const rows = data.creators.map((creator) => [
      creator.name ?? "",
      creator.following ?? "",
      creator.status ?? "",
      creator.price ?? "",
      creator.offerSent ? "Yes" : "No",
      creator.assetsSent ? "Yes" : "No",
      creator.assetsApproved ? "Yes" : "No",
      creator.promotionType ?? "",
      creator.promotionPlatform ?? "",
      creator.likes ?? 0,
      creator.comments ?? 0,
      creator.totalViews ?? 0,
      creator.postDate ?? "",
      creator.platformLink ?? "",
      creator.liveLink ?? "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    return csvContent;
  };

  if (!campaignDetails) {
    return (
      <Typography
        sx={{
          width: "100vw",
          height: "100vh",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading campaign details...
      </Typography>
    );
  }

  const isCampaignActive =
    campaignDetails.campaign_status !== "Launched" &&
    campaignDetails.campaign_status !== "Completed";

  const renderOptionalDetail = (label, value) => {
    return value ? (
      <Typography variant="body1">{`${label}: ${value}`}</Typography>
    ) : null;
  };

  const costPerCreatorData = campaignDetails.creators.map((creator) => ({
    name: creator.name ?? "",
    price: creator.price
      ? parseFloat(creator.price.toString().replace(/[^0-9.-]+/g, ""), 10)
      : 0, // Assuming the price is a string like "$6,000"
  }));

  const reachData = campaignDetails.creators.map((creator) => ({
    name: creator.name ?? "",
    value: creator.following
      ? parseInt(creator.following.replace(/,/g, ""), 10)
      : 0,
  }));

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A83731",
    "#5A30B5",
    "#34A853",
  ];

  // Prepare data for the "Total Views by Day" chart
  const viewsByDayData = campaignDetails.creators
    .reduce((acc, creator) => {
      const date = creator.postDate ?? Date();
      const views = creator.totalViews ? parseInt(creator.totalViews, 10) : 0;
      const existingEntry = acc.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry.views += views;
      } else {
        acc.push({ date, views });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date for better chart display

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#000" }}>
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="logo"
              onClick={() => navigate(routes.campaigns)}
            >
              <img
                src={blitzLogo}
                alt="logo"
                style={{ width: "120px", height: "50px" }}
              />
            </IconButton>
          </Box>
          <Box
            display="flex"
            flexGrow={1}
            justifyContent="center"
            style={{ flexGrow: 2 }}
          >
            {/* Navigation items here */}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ margin: 4 }}>
        <Box
          sx={{
            margin: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Typography variant="h4" gutterBottom>
              Campaign Details: {campaignDetails.name}
            </Typography>
            {renderOptionalDetail("Brief", campaignDetails.brief)}
            {renderOptionalDetail("Proposal Date", campaignDetails.proposal_date)}
            {renderOptionalDetail("Ideal Due Date", campaignDetails.ideal_duedate)}
            {renderOptionalDetail(
              "Campaign Sum",
              `$${campaignDetails.campaign_sum}`
            )}
            {renderOptionalDetail(
              "Assets Drive",
              `${campaignDetails.drive_link || "Campaign Not Launched"}`
            )}
            <Button color="inherit" onClick={() => handleViewChange("list")}>
              See in List
            </Button>
            <Button color="inherit" onClick={() => handleViewChange("pretty")}>
              Make it Pretty
            </Button>
            <Button color="inherit" onClick={downloadCSV}>
              Download CSV
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={exportToSheets}
              style={{ marginLeft: 8 }}
            >
              Export to Google Sheets
            </Button>
          </div>
          {isCampaignActive && (
            <Typography sx={{ textAlign: "right", paddingRight: 2 }}>
              Use the filters here to approve or drop creators from this
              proposal.
            </Typography>
          )}
        </Box>

        <AppBar
          position="static"
          color="default"
          sx={{
            minHeight: "48px",
            maxWidth: "400px",
            justifyContent: "space-between",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            textColor="primary"
            indicatorColor="primary"
            centered
            sx={{ minHeight: "48px" }}
          >
            <Tab
              label="Campaign"
              sx={{ minHeight: "48px", fontSize: "0.875rem" }}
            />
            <Tab
              label="Reporting"
              sx={{ minHeight: "48px", fontSize: "0.875rem" }}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={selectedTab} index={0}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Creators</Typography>
          {viewMode === "list" ? (
            <List>
              {campaignDetails.creators.map((creator, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemText
                    primary={creator.name ?? ""}
                    secondary={`Following: ${creator.following ?? 0}`}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    {isCampaignActive && (
                      <Select
                        label="Status"
                        value={creator.status || "pitched"} // Use existing status or default to 'pitched'
                        onChange={(event) =>
                          handleStatusChange(creator.id, event.target.value)
                        }
                        style={{ marginLeft: "20px" }}
                      >
                        <MenuItem value="pitched">Pitched</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="drop">Drop</MenuItem>
                        <MenuItem value="counter">Counter</MenuItem>
                        <MenuItem value="Accepted">Accepted</MenuItem>
                        <MenuItem value="declined">Declined</MenuItem>
                      </Select>
                    )}
                    <Chip label={`Price: $${creator.price ?? 0}`} color="primary" />
                    <Chip label={`Offer Sent: ${creator.offerSent ? "Yes" : "No"}`} />
                    <Chip label={`Assets Sent: ${creator.assetsSent ? "Yes" : "No"}`} />
                    <Chip
                      label={`Assets Approved: ${creator.assetsApproved ? "Yes" : "No"}`}
                    />
                    <Chip
                      label={`Promotion Type: ${creator.promotionType ?? ""}`}
                    />
                    <Chip
                      label={`Promotion Platform: ${creator.promotionPlatform ?? ""}`}
                    />
                    <Chip label={`Likes: ${creator.likes ?? 0}`} />
                    <Chip label={`Comments: ${creator.comments ?? 0}`} />
                    <Chip label={`Total Views: ${creator.totalViews ?? 0}`} />
                    <Chip label={`Post Date: ${creator.postDate ?? 0}`} />
                    {creator.platformLink && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <a
                          href={creator.platformLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on {creator.promotionPlatform ?? ""}
                        </a>
                      </Typography>
                    )}
                    {creator.liveLink && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <a
                          href={creator.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Live Video {creator.liveLink ?? ""}
                        </a>
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            // Prettified view using the CampaignsContainers component
            <CampaignsContainers
              creators={campaignDetails.creators}
              handleStatusChange={handleStatusChange}
            />
          )}
        </TabPanel>
      </Box>

      <TabPanel value={selectedTab} index={1}>
        <Typography variant="h6" gutterBottom component="div">
          Reporting
        </Typography>
        <Grid container spacing={2}>
          {/* Cost Per Creator Chart */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Cost Per Creator
            </Typography>
            <ResponsiveContainer width="100%" aspect={1}>
              <BarChart data={costPerCreatorData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="price" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>

          {/* Total Views by Day Chart */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Total Views by Day
            </Typography>
            <ResponsiveContainer width="100%" aspect={1}>
              <LineChart data={viewsByDayData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>

          {/* Total Reach Pie Chart */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Total Reach by Creator
            </Typography>
            <ResponsiveContainer width="100%" aspect={1}>
              <PieChart>
                <Pie
                  data={reachData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {reachData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </TabPanel>
      {showCRMDialog && (
        <CRMDialog
          isOpen={showCRMDialog}
          handleClose={handleCloseCRMDialog}
          origin={`${campaignDetails.name} - campaign`} // Passing dynamic origin based on fetched creator details
        />
      )}
      <Dialog open={showInstructions} onClose={() => setShowInstructions(false)}>
        <DialogTitle>Instructions</DialogTitle>
        <DialogContent>
          <Typography>
            Hey! New To Blitz? This is our proposal sheet - a list of creators
            curated just for you by our team. Each creator listed has a
            recommended price for the deliverables you requested, with their
            media kit attached. In order to interact with this page, you are
            able to "Approve," "Drop," and "Negotiate" for each creator listed
            and we will continue forward with your interest! If you would like,
            you may also download this list as a CSV for your personal keeping.
            Once we launch our campaign together, this link will turn into a
            tracking sheet to show current creator activity, with which creators
            have created a draft, which has posted, and their analytics for your
            reporting! Let's Win!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstructions(false)}>Got it!</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CampaignDetailsPage;
