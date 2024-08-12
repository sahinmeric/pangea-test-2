import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import useAuth from "../../../../../Hooks/use-auth";
import client from "../../../../../API";
import { Creator } from "../types";

interface ConversationsPopupProps {
  open: boolean;
  handleClose: () => void;
  creator: Creator;
  conversationId: string;
}

interface Message {
  sender_id: string;
  message: string;
  created_at: string;
  creator_id: string;
}

const ConversationsPopup: React.FC<ConversationsPopupProps> = ({
  open,
  handleClose,
  creator,
  conversationId,
}) => {
  const { getCurrrentUser } = useAuth();
  const userInfo = getCurrrentUser();

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data, error, isLoading, refetch } = useQuery(
    ["messages", conversationId],
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
        {
          sender_id: userInfo.id,
          message: newMessage.message,
          created_at: new Date().toISOString(),
          creator_id: creator.id,
        },
      ]);
      setMessage("");
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate({
        conversation_id: conversationId,
        message,
        user_id: userInfo.id,
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar src={creator.pfphref} alt={creator.name} />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              {creator.name}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading && (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          sx={{ minHeight: "300px", maxHeight: "500px", overflowY: "auto" }}
        >
          {messages.map((msg, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                color={
                  msg.sender_id === userInfo.id ? "primary" : "textPrimary"
                }
              >
                <strong>
                  {msg.sender_id === userInfo.id ? "You" : creator.name}:
                </strong>{" "}
                {msg.message}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(msg.created_at).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2 }}>
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
        <Button
          onClick={handleSendMessage}
          color="primary"
          variant="contained"
          disabled={sendMessageMutation.isLoading}
          endIcon={<SendIcon />}
          sx={{ ml: 1 }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConversationsPopup;
