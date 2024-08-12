import React, { useState, useMemo } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import profilePhoto from "../../../../../Components/globalAssets/ppfLogo.png";
import ConversationsPopup from "./ConversationPopup";
import { Creator } from "../types";

type ConversationsProps = {
  creators: Creator[];
};

const Conversations: React.FC<ConversationsProps> = ({ creators = [] }) => {
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const startConversation = (creatorId: string) => {
    console.log("Starting conversation for creator:", creatorId);
    setConversationId(`conversation_${creatorId}`);
    setSelectedCreator(creators.find((c) => c.id === creatorId) || null);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedCreator(null);
    setConversationId(null);
  };

  const consolidatedCreators = useMemo(() => {
    const creatorMap: Record<
      string,
      Omit<Creator, "platforms" | "types"> & {
        platforms: string[];
        types: string[];
      }
    > = {};

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
    <Stack direction="column" spacing={2}>
      {consolidatedCreators.map((creator, index) => (
        <Card
          key={index}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 2,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: 120, // Fixed width for the image
              borderRadius: "8px",
            }}
            image={creator.pfphref || profilePhoto}
            alt={creator.name}
          />
          <CardContent>
            <Stack direction="column" spacing={1}>
              <Typography variant="h6">
                <a
                  href={`https://blitzpay.pro/creators/${creator.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  @{creator.name}
                </a>
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Price: ${creator.price}
              </Typography>
              <Typography variant="body2">{`Platforms: ${creator.platforms}`}</Typography>
              <Typography variant="body2">{`Types: ${creator.types}`}</Typography>
              <Typography variant="body2">{`Status: ${creator.status}`}</Typography>
              {creator.status !== "Accepted" && (
                <Typography color="error">
                  Creator must accept the initial campaign message to start a
                  conversation
                </Typography>
              )}
            </Stack>
          </CardContent>
          <Button
            variant="contained"
            color="primary"
            onClick={() => startConversation(creator.id)}
            disabled={creator.status !== "Accepted"}
            sx={{ marginLeft: "auto" }}
          >
            Start Conversation
          </Button>
        </Card>
      ))}
      {selectedCreator && conversationId && (
        <ConversationsPopup
          open={openPopup}
          handleClose={handleClosePopup}
          creator={selectedCreator}
          conversationId={conversationId}
        />
      )}
    </Stack>
  );
};

export default Conversations;
