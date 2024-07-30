import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
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
} from "@mui/material";
import client from "../../../../API"; // Ensure this is the correct path
import CreatorCampaignConversation from "./conversation";
import { useCreatorAuth } from "../../../../Hooks/creator-use-auth";
import AssetsTab from "./campaignAssets";
import CreatorTimeline from "./creatorTimeline";
import { useMutation } from "react-query";

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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const CreatorCampaignDialog = ({
  openDialog,
  handleCloseDialog,
  campaignId,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState(undefined);
  const editedEvents = useRef(false)
  const [isLoading, setIsLoading] = useState(true);
  const { creatorToken } = useCreatorAuth();

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const data = await client.campaigns.fetch(campaignId);
        const eventData = await client.campaigns.timeline_by_creator(campaignId, creatorToken.creator_user.username);
        if (openDialog) {
          editedEvents.current = false;
          console.log(data);
          console.log(eventData);
          setCampaign(data);
          setTimelineEvents(eventData.events.map((event) => ({ ...event, projected_date: new Date(event.projected_date) })));
          setIsLoading(false);
        }
      } catch (err) {
        handleCloseDialog();
      }
    };
    if (openDialog) fetchCampaignData();
  }, [openDialog]);

  const OnEditTimelineField = (targetIndex, target, value) => {
    editedEvents.current = true;
    setTimelineEvents(timelineEvents.map((event, index) => {
      if (index === targetIndex) {
        return { ...event, [target]: value }
      }
      else
        return event;
    })
    )
  }

  const { mutate: updateTimeline, isLoading: isUpdatingTimeline } = useMutation(
    ({ input }) => client.campaigns.timeline_by_creator_update(campaignId, creatorToken.creator_user.username, input),
    {
      onSuccess: () => {
        alert("Timeline updated succesfully.");
      },
      onError: (error) => {
        if (error.response && error.response.data && error.response.data.error)
          alert(`Error: ${error.response.data.error}`);
        else
          alert(`Error: ${error.message}`);
        handleCloseDialog();
      },
    }
  );

  const onSaveChanges = () => {
    //console.log(JSON.stringify(timelineEvents));
    updateTimeline({input: timelineEvents});
  }

  const creator = useMemo(() => {
    if (!campaign) {
      return undefined;
    }
    const creators = JSON.parse(campaign.creators);
    return creators.find(
      (creator) => creator.id === creatorToken.creator_user.username
    );
  }, [campaign]);

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth={isLoading ? "sm" : "xl"}
      fullWidth
      scroll="paper"
    >
      {isLoading && (
        <DialogContent style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
          <CircularProgress />
        </DialogContent>
      )}

      {!isLoading && (
        <>
          <DialogTitle sx={{ padding: 0, overflowY: 'clip' }}>
            <Grid container alignItems={'end'} spacing={2} padding={0} margin={0} width={'100%'}>
              <Grid item xs={14} md={3} padding={2}>
                <Typography variant="h6">
                  Campaign Name: {campaign.name}
                </Typography>
                <Typography variant="h6">
                  Ideal Due Date: {formatIdealDueDate(campaign.ideal_duedate)}
                </Typography>
                <Typography variant="h6">
                  Brief: {campaign.brief}
                </Typography>
                <Typography variant="h6">
                  Status: {campaign.campaign_status}
                </Typography>

                <Typography>
                  {false && (
                    <Link
                      href={"dialogContent.drive_link"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Campaign Assets
                    </Link>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} padding={0} margin={0}>
                <Paper elevation={1}>
                  <Tabs
                    value={tabIndex}
                    onChange={handleChangeTab}
                    aria-label="campaign details tabs"
                  >
                    <Tab label="Overview" />
                    <Tab label="Assets" />
                    <Tab label="Conversations" />
                  </Tabs>
                </Paper>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent dividers={true}>
            <TabPanel value={tabIndex} index={0}>
              <>
                <Grid
                  container
                  display="flex"
                  justifyContent="space-between"
                  marginBottom={2}
                  spacing={2}
                >
                  <Grid item xs={12} md={6}>
                    {creator && (
                      <>
                        <Typography variant="h6">
                          Creator Brief: {creator.creatorBrief || "N/A"}
                        </Typography>
                        <Typography variant="h6">
                          Rate: {creator.agencyRate ? `$${creator.agencyRate}` : creator.price ? `$${creator.price}` : "N/A"}
                        </Typography>

                      </>
                    )}
                    <Typography variant="h6" style={{ marginTop: 20, marginBottom: 10 }}>
                      Campaign Manager:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Name:</strong> {campaign.campaign_manager.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Email:</strong> {campaign.campaign_manager.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          <strong>Phone:</strong> {campaign.campaign_manager.phone_number}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Typography variant="h6">Timeline</Typography>
                <CreatorTimeline timelineEvents={timelineEvents} onEditField={OnEditTimelineField} onSaveChanges={onSaveChanges} isSavingChanges={isUpdatingTimeline}></CreatorTimeline>
              </>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <AssetsTab campaignDetails={campaign} creator={creator} />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <CreatorCampaignConversation campaignId={campaign.id} />
            </TabPanel>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatorCampaignDialog;
