import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Toolbar,
} from "@mui/material";
import BlitzHeader from "../../../../Components/BlitzHeader.js";
import API from "../../../../API/index.js";

const CreatorCampaignTimelines = () => {
  const { campaignId, creatorId } = useParams();
  const navigate = useNavigate();

  const { isLoading, data: timelineFetch, error, isError } = useQuery({
    queryKey: ['campaign', campaignId, 'timeline', creatorId],
    queryFn: () => API.campaigns.timeline_by_creator(campaignId, creatorId),
    refetchInterval: false,
    refetchOnMount: 'always',
    onError: (error) => { alert(`Error: ${(error.response && error.response.data) ? error.response.data.error : error.message}`); }
  }
  )

  const timelineData = useMemo(() => {
    if (timelineFetch === undefined || timelineFetch === null)
      return [];
    return timelineFetch.events.map((event) => ({
      ...event,
      status: event.status || "incomplete",
    }))
  }, [timelineFetch])

  const campaignName = useMemo(() => {
    if (timelineFetch === undefined || timelineFetch === null)
      return 'Loading';
    return timelineFetch.campaignName;
  }, [timelineFetch])


  if (isLoading) {
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
        Loading timeline data...
      </Typography>
    );
  }

  if (isError) {
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
        Failed to load timeline data.
      </Typography>
    );
  }

  return (
    <>
      <BlitzHeader></BlitzHeader>
      <Toolbar></Toolbar>
      <Box sx={{ margin: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Timeline for {campaignName} and Creator @{creatorId}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {timelineData.map((event, index) => (
            <Card key={index} sx={{ width: "80%" }}>
              <CardContent>
                <Typography variant="h6">{event.objective}</Typography>
                <Typography color="textSecondary">
                  Status: {event.status}
                </Typography>
                <Typography color="textSecondary">
                  Date: {new Date(event.projected_date).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Typography size="small">Check Your Creator Portal To Update the status</Typography>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default CreatorCampaignTimelines;
