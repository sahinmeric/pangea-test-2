import React, { useState, useMemo, useEffect } from "react";
import { useMutation } from "react-query";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import profilePhoto from "../../../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo
import ConversationsPopup from "./conversationPopup";
import useAuth from "../../../../../Hooks/use-auth";
import client from "../../../../../API";

const Conversations = ({ creators = [], campaignId }) => {
  const { getCurrrentUser } = useAuth();
  const userInfo = getCurrrentUser();

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    console.log("Campaign ID:", campaignId);
  }, [campaignId]);

  const checkConversation = useMutation(client.conversations.check, {
    onSuccess: (data, variables) => {
      console.log("Check response data:", data);
      if (data.exists) {
        setConversationId(data.conversation_id);
        setSelectedCreator(creators.find((c) => c.id === variables.creator_id));
        setOpenPopup(true);
      } else {
        createConversation.mutate(variables);
      }
    },
    onError: (error) => {
      console.error("Check response error:", error);
    },
  });

  const createConversation = useMutation(client.conversations.create, {
    onSuccess: (data, variables) => {
      console.log("Create response data:", data);
      setConversationId(data.conversation_id);
      setSelectedCreator(creators.find((c) => c.id === variables.creator_id));
      setOpenPopup(true);
    },
    onError: (error) => {
      console.error("Create response error:", error);
    },
  });

  const startConversation = (creatorId) => {
    const payload = {
      campaign_id: campaignId,
      creator_id: creatorId,
    };
    console.log("Payload for check:", payload);
    checkConversation.mutate(payload);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedCreator(null);
    setConversationId(null);
  };

  const consolidatedCreators = useMemo(() => {
    const creatorMap = {};

    creators.forEach((creator) => {
      if (!creatorMap[creator.name]) {
        creatorMap[creator.name] = {
          ...creator,
          platforms: [],
          types: [],
        };
      }
      creatorMap[creator.name].platforms.push(creator.promotionPlatform);
      creatorMap[creator.name].types.push(creator.promotionType);
    });

    return Object.values(creatorMap).map((creator) => ({
      ...creator,
      platforms: creator.platforms.join(", "),
      types: creator.types.join(", "),
    }));
  }, [creators]);

  return (
    <>
      <Grid container spacing={2}>
        {consolidatedCreators.map((creator, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={creator.pfphref || profilePhoto}
                alt={creator.name}
              />
              <CardContent>
                <Typography variant="h5">
                  <a
                    href={`https://blitzpay.pro/creators/${creator.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    @{creator.name}
                  </a>
                </Typography>
                <Typography variant="h6">{`Price: ${creator.price}`}</Typography>
                <Typography variant="body2">{`Platforms: ${creator.platforms}`}</Typography>
                <Typography variant="body2">{`Types: ${creator.types}`}</Typography>
                <Typography variant="body2">{`Status: ${creator.status}`}</Typography>
                {creator.status !== "Accepted" && (
                  <Typography color="error">
                    Creator must accept the initial campaign message to start a conversation
                  </Typography>
                )}
                {creator.status === "Accepted" && (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 20 }}
                    onClick={() => startConversation(creator.id)}
                  >
                    Start Conversation
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedCreator && conversationId && (
        <ConversationsPopup
          open={openPopup}
          handleClose={handleClosePopup}
          creator={selectedCreator}
          conversationId={conversationId}
        />
      )}
    </>
  );
};

export default Conversations;