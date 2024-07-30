import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import routes from "../../../../Config/routes.js";
import blitzLogo from "../../../../Components/globalAssets/platty.png";

const CreatorDeliverables = () => {
  const { partnershipId, creatorId } = useParams();
  const [deliverableData, setDeliverableData] = useState([]);
  const [partnershipName, setPartnershipName] = useState("");
  const navigate = useNavigate();

  const fetchDeliverableData = async ({ partnershipId, creatorId }) => {
    const response = await fetch(
      `https://blitz-backend-nine.vercel.app/api/deliverables/getByPartnershipAndCreator/${partnershipId}/${creatorId}`
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching deliverable data:", errorText);
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { mutate: fetchCreatorDeliverables, data, error, isLoading } = useMutation(
    fetchDeliverableData,
    {
      onSuccess: (data) => {
        const updatedData = data.filter((deliverable) => deliverable.deliverable_type !== "Payout");
        setDeliverableData(updatedData);
        // Assuming you have a way to fetch partnership name by partnershipId
        setPartnershipName("Partnership Name Placeholder");
      },
    }
  );

  useEffect(() => {
    fetchCreatorDeliverables({ partnershipId, creatorId });
  }, [partnershipId, creatorId, fetchCreatorDeliverables]);

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
        Loading deliverable data...
      </Typography>
    );
  }

  if (error) {
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
        Failed to load deliverable data.
      </Typography>
    );
  }

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
        <Typography variant="h4" gutterBottom textAlign="center">
          Deliverables for {partnershipName} and Creator @{creatorId}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {deliverableData.map((deliverable, index) => (
            <Card key={index} sx={{ width: "80%" }}>
              <CardContent>
                <Typography variant="h6">Contract for {deliverable.deliverable_type}</Typography>
                <Typography color="textSecondary">
                  Status: {deliverable.status}
                </Typography>
                <Typography color="textSecondary">
                  Due Date: {deliverable.due_date ? new Date(deliverable.due_date).toLocaleString() : 'N/A'}
                </Typography>
                <Typography color="textSecondary">
                  Amount: ${deliverable.amount}
                </Typography>
                <Typography color="textSecondary">
                  Notes: {deliverable.notes}
                </Typography>
                {deliverable.deliverable_link && (
                  <Typography color="textSecondary">
                    Link: <a href={deliverable.deliverable_link} target="_blank" rel="noopener noreferrer">{deliverable.deliverable_link}</a>
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/creatorPortal/${creatorId}`)}>
                  Check Your Creator Portal
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default CreatorDeliverables;
