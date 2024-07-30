import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  Box,
  TextField,
  Button,
  Typography
} from "@mui/material";
import client from "../../../../API";
import { useCreatorAuth } from "../../../../Hooks/creator-use-auth";

const CreatorCampaignConversation = ({ campaignId }) => {
  const { creatorToken } = useCreatorAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { data: checkResults, isLoading: isChecking, error: checkError } = useQuery({
    queryKey: ['messagesId', campaignId],
    queryFn: () => client.conversations.check({ campaign_id: campaignId, creator_id: creatorToken.creator_user.username })
  });

  const convId = checkResults?.exists ? checkResults.conversation_id : null;

  const { data: messagesData, error: messagesError, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['messages', convId],
    queryFn: () => client.conversations.getMessages(convId),
    enabled: !!convId,
    onSuccess: (data) => {
      setMessages(data);
    }
  });

  const sendMessageMutation = useMutation(client.conversations.sendMessage, {
    onSuccess: (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender_id: "You", message: newMessage.message, created_at: new Date(), creator_id: creatorToken.creator_user.username },
      ]);
      setMessage("");
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    }
  });

  const handleSendMessage = () => {
    if (convId && message.trim()) {
      sendMessageMutation.mutate({
        conversation_id: convId,
        message,
        creator_id: creatorToken.creator_user.username, // Using creator's username as creator_id
        campaign_id: campaignId // Include campaign_id in the message data
      });
    } else {
      console.error("Conversation ID is not available or message is empty.");
    }
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      {isChecking && <Typography>Loading messages...</Typography>}
      {checkError && <Typography>Error loading messages</Typography>}
      {(!messages || messages.length === 0) && !isMessagesLoading && !messagesError && <Typography>No messages</Typography>}
      <Box
        display="flex"
        flexDirection="column"
        sx={{ minHeight: "300px", maxHeight: "500px", overflowY: "auto" }}
        style={{ flex: 1 }}
      >
        {messages.map((msg, index) => (
          <Typography key={index} variant="body1" sx={{ marginBottom: 2 }}>
            <strong>
              {msg.sender_id === "You" 
                ? "You" 
                : msg.sender_id 
                  ? `Client ${msg.sender_id}` 
                  : `You`}
            </strong>: {msg.message}
          </Typography>
        ))}
      </Box>
      <Box style={{ height: "3em", display: "flex", flexDirection: "row" }}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Type a message"
          fullWidth
          variant="outlined"
          style={{ height: "100%" }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button color="primary" variant="contained" style={{ flex: 0.25 }} onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default CreatorCampaignConversation;
