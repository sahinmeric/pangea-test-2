import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import {
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import client from "../../../../API";
import { useCreatorAuth } from "../../../../Hooks/creator-use-auth";
import { styled } from "@mui/system";

const CustomButton = styled(Button)`
  background-color: #616161;
  color: white;
  &:hover {
    background-color: #757575;
  }
`;

const DeliverableCard = ({ deliverable, onViewOffer }) => (
  <Card sx={{ marginBottom: 2, height: "750px", display: "flex", flexDirection: "column"}}  elevation={2}>
    <CardHeader title={`Deliverable: ${deliverable.deliverable_type}`} />
    <CardContent sx={{ overflowY: "auto", flexGrow: 1 }}>
      <Typography variant="body2">
        Amount: {deliverable.amount || 'N/A'}
      </Typography>
      <Typography variant="body2">
        Status: {deliverable.status}
      </Typography>
      <Typography variant="body2">
        Notes: {deliverable.notes}
      </Typography>
      <Typography variant="body2">
        Revision Amount: {deliverable.revision}
      </Typography>
      <Typography variant="body2">
        Due Date: {deliverable.due_date}
      </Typography>
      <Typography variant="body2">
        Platforms: {deliverable.platforms.join(', ')}
      </Typography>
    </CardContent>
    <Box sx={{ padding: 2 }}>
      <Button onClick={() => onViewOffer(deliverable)} color="primary" variant="contained" fullWidth>
        View Offer
      </Button>
    </Box>
  </Card>
);

const ViewOfferDialog = ({ open, onClose, deliverable, onUpdateDeliverable, onSendMessage }) => {
  const [status, setStatus] = useState(deliverable.status);
  const [amount, setAmount] = useState(deliverable.amount);
  const [revision, setRevision] = useState(deliverable.revision);
  const [isNegotiating, setIsNegotiating] = useState(false);

  useEffect(() => {
    if (status === 'NEGOTIATE') {
      setIsNegotiating(true);
    } else {
      setIsNegotiating(false);
    }
  }, [status]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (newStatus === 'NEGOTIATE') {
      setIsNegotiating(true);
    } else {
      setIsNegotiating(false);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleRevisionChange = (e) => {
    setRevision(e.target.value);
  };

  const handleSubmit = () => {
    onUpdateDeliverable(deliverable.id, { status, amount: isNegotiating ? amount : amount, revision: isNegotiating ? revision : deliverable.revision });
    onSendMessage(`Your offer was ${status.toLowerCase()}ed.`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>View Offer</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Deliverable Type: {deliverable.deliverable_type}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Notes: {deliverable.notes}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Due Date: {deliverable.due_date}
        </Typography>
        <Typography variant="body2">
          Revision Amount: {deliverable.revision}
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Platforms: {deliverable.platforms.join(', ')}
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={handleStatusChange}>
            <MenuItem value="ACCEPT">Accept</MenuItem>
            <MenuItem value="DECLINE">Decline</MenuItem>
            <MenuItem value="NEGOTIATE">Negotiate</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
          type="number"
        />
        {isNegotiating && (
          <TextField
            fullWidth
            margin="normal"
            label="Revision Amount"
            value={revision}
            onChange={handleRevisionChange}
            type="number"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

const CreatorConversation = ({ partnershipId }) => {
  const { creatorToken } = useCreatorAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [selectedDeliverable, setSelectedDeliverable] = useState(null);

  const { data: checkResults, isLoading: isChecking, error: checkError } = useQuery({
    queryKey: ['checkConversation', partnershipId],
    queryFn: () => client.partnershipConversations.check({ partnership_id: partnershipId, creator_id: creatorToken.creator_user.username }),
    onSuccess: (data) => {
      if (data.exists) {
        setConversationId(data.conversation_id);
      }
    }
  });

  const { data: messagesData, error, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => client.partnershipConversations.getMessages(conversationId),
    enabled: !!conversationId,
    onSuccess: (data) => {
      setMessages(data);
    }
  });

  const sendMessageMutation = useMutation(client.partnershipConversations.sendMessage, {
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

  const updateDeliverableMutation = useMutation(({ id, update }) => client.deliverables.update(id, update), {
    onSuccess: () => {
      setSelectedDeliverable(null);
      client.partnershipConversations.getMessages(conversationId)
        .then(data => setMessages(data))
        .catch(error => console.error("Error fetching messages:", error));
    },
    onError: (error) => {
      console.error("Error updating deliverable:", error);
    }
  });

  const handleSendMessage = () => {
    if (message && conversationId) {
      sendMessageMutation.mutate({
        conversation_id: conversationId,
        message,
        creator_id: creatorToken.creator_user.username, // Using creator's username as creator_id
        partnership_id: partnershipId // Include partnership_id in the message data
      });
      setMessage("");
    } else {
      console.error("Conversation ID is not available or message is empty.");
    }
  };

  const handleViewOffer = (deliverable) => {
    setSelectedDeliverable(deliverable);
  };

  const handleUpdateDeliverable = (id, update) => {
    updateDeliverableMutation.mutate({ id, update });
  };

  const handleSendStatusMessage = (statusMessage) => {
    if (conversationId) {
      sendMessageMutation.mutate({
        conversation_id: conversationId,
        message: statusMessage,
        creator_id: creatorToken.creator_user.username, // Using creator's username as creator_id
        partnership_id: partnershipId // Include partnership_id in the message data
      });
    }
  };

  useEffect(() => {
    if (!conversationId && partnershipId && checkResults && !checkResults.exists) {
      client.partnershipConversations.create({ partnership_id: partnershipId, creator_id: creatorToken.creator_user.username })
        .then(data => setConversationId(data.conversation_id))
        .catch(error => console.error("Error creating conversation:", error));
    }
  }, [partnershipId, checkResults]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {isChecking && <CircularProgress />}
      {checkError && <Typography>Error loading conversation</Typography>}
      {messages && messages.length === 0 && !isLoading && !error && <Typography>No messages</Typography>}
      <Box display="flex" flexDirection="column" flexGrow={1} sx={{ minHeight: "300px", maxHeight: "70vh", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          msg.deliverable ? (
            <DeliverableCard key={index} deliverable={msg.deliverable} onViewOffer={handleViewOffer} />
          ) : (
            <Typography key={index} variant="body1" sx={{ marginBottom: 2 }}>
              <strong>
                {msg.sender_id === "You" 
                  ? "You" 
                  : msg.sender_id 
                    ? `Client ${msg.sender_id}` 
                    : `You`}
              </strong>: {msg.message}
            </Typography>
          )
        ))}
      </Box>
      <Box display="flex" alignItems="center" mt={2}>
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
        <IconButton onClick={handleSendMessage} color="primary" sx={{ ml: 2 }}>
          <SendIcon />
        </IconButton>
      </Box>
      {selectedDeliverable && (
        <ViewOfferDialog
          open={!!selectedDeliverable}
          onClose={() => setSelectedDeliverable(null)}
          deliverable={selectedDeliverable}
          onUpdateDeliverable={handleUpdateDeliverable}
          onSendMessage={handleSendStatusMessage}
        />
      )}
    </Box>
  );
};

export default CreatorConversation;
