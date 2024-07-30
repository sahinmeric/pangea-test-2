import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Avatar
} from "@mui/material";
import useAuth from "../../../../../Hooks/use-auth";
import client from "../../../../../API";

const ConversationsPopup = ({ open, handleClose, creator, conversationId }) => {
  const { getCurrrentUser } = useAuth();
  const userInfo = getCurrrentUser();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { data, error, isLoading, refetch } = useQuery(
    ['messages', conversationId],
    () => client.conversations.getMessages(conversationId),
    {
      enabled: !!conversationId,
      onSuccess: (data) => {
        setMessages(data);
      },
    }
  );

  useEffect(() => {
    if (open && conversationId) {
      refetch();
    }
  }, [open, conversationId, refetch]);

  const sendMessageMutation = useMutation(client.conversations.sendMessage, {
    onSuccess: (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender_id: userInfo.id, message: newMessage.message, created_at: new Date(), creator_id: creator.id },
      ]);
      setMessage("");
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  const handleSendMessage = () => {
    sendMessageMutation.mutate({ conversation_id: conversationId, message, user_id: userInfo.id });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Avatar src={creator.pfphref} alt={creator.name} />
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            {creator.name}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading && <Typography>Loading messages...</Typography>}
        {error && <Typography>Error loading messages</Typography>}
        <Box
          display="flex"
          flexDirection="column"
          sx={{ minHeight: "300px", maxHeight: "500px", overflowY: "auto" }}
        >
          {messages.map((msg, index) => (
            <Typography key={index} variant="body1" sx={{ marginBottom: 2 }}>
              <strong>{msg.sender_id === userInfo.id ? "You" : creator.name}:</strong> {msg.message}
            </Typography>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Type a message"
          fullWidth
          variant="outlined"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage} color="primary" variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConversationsPopup;
