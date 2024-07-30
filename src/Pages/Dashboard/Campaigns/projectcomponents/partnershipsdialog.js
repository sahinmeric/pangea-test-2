import React, { useState, useEffect } from "react";
import {
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Avatar,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  ListItemText,
  Checkbox,
  Snackbar,
  Alert
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { styled } from "@mui/system";
import useAuth from "../../../../Hooks/use-auth";
import client from "../../../../API";
import SendIcon from "@mui/icons-material/Send";
import OfferIcon from "@mui/icons-material/LocalOffer";
import ContractIcon from "@mui/icons-material/Description";
import PayoutIcon from "@mui/icons-material/MonetizationOn";
import MenuIcon from "@mui/icons-material/Menu";
import PartnershipsDetailView from "./detailview";  // Adjust the import path as needed

const StyledDialogTitle = styled(DialogTitle)`
  background-color: #424242;
  color: white;
`;

const StyledDialogContent = styled(DialogContent)`
  background-color: #333;
  color: white;
  display: flex;
  flex-direction: column;
  height: 600px;  // Adjust the height as needed
  overflow-y: auto;
`;

const StyledDialogActions = styled(DialogActions)`
  background-color: #424242;
`;

const CustomButton = styled(Button)`
  background-color: #616161;
  color: white;
  &:hover {
    background-color: #757575;
  }
`;

const ButtonBar = styled(Box)`
  background-color: #424242;
  display: flex;
  justify-content: flex-start;
  padding: 16px 24px;
`;

const SendOfferDialog = ({ open, onClose, partnershipId, creatorId, conversationId, onOfferSent }) => {
  const [deliverableType, setDeliverableType] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [revision, setRevision] = useState("");  // New state for revision
  const [script, setScript] = useState("");      // New state for script

  const createDeliverableMutation = useMutation(client.deliverables.create, {
    onSuccess: () => {
      onClose();
      onOfferSent();
    },
    onError: (error) => {
      console.error("Error creating deliverable:", error);
    },
  });

  const handleSubmit = () => {
    createDeliverableMutation.mutate({
      partnership_id: partnershipId,
      creator_id: creatorId,
      conversation_id: conversationId,
      deliverable_type: deliverableType,
      deliverable_link: null,
      amount,
      status: "sent",
      notes,
      due_date: dueDate,
      platforms,
      revision,  // Include revision in the request
      script     // Include script in the request
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <StyledDialogTitle>Send Offer</StyledDialogTitle>
      <StyledDialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Deliverable Type</InputLabel>
          <Select
            value={deliverableType}
            onChange={(e) => setDeliverableType(e.target.value)}
          >
            <MenuItem value="Brand Post">Brand Post</MenuItem>
            <MenuItem value="UGC Post">UGC Post</MenuItem>
            <MenuItem value="Story Post">Story Post</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Brief"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Revision"
          value={revision}
          onChange={(e) => setRevision(e.target.value)}
          type="number"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          multiline
          rows={4}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Platform Type</InputLabel>
          <Select
            multiple
            value={platforms}
            onChange={(e) => setPlatforms(e.target.value)}
            renderValue={(selected) => selected.join(', ')}
          >
            {["TikTok", "Instagram", "YouTube"].map((platform) => (
              <MenuItem key={platform} value={platform}>
                <Checkbox checked={platforms.indexOf(platform) > -1} />
                <ListItemText primary={platform} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </StyledDialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Send Offer</Button>
      </StyledDialogActions>
    </Dialog>
  );
};

const PayoutDialog = ({ open, onClose, partnershipId, creatorId, conversationId }) => {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [poNumber, setPoNumber] = useState("");

  useEffect(() => {
    if (!poNumber) {
      // Generate PO number if not provided
      setPoNumber(`PO-${Math.floor(Math.random() * 1000000)}`);
    }
  }, [poNumber]);

  const createDeliverableMutation = useMutation(client.deliverables.create, {
    onSuccess: () => {
      onClose();
    },
    onError: (error) => {
      console.error("Error creating deliverable:", error);
    },
  });

  const handleSubmit = () => {
    createDeliverableMutation.mutate({
      partnership_id: partnershipId,
      creator_id: creatorId,
      conversation_id: conversationId,
      deliverable_type: "Payout",
      deliverable_link: null,
      amount,
      status: "sent",
      notes,
      due_date: null,
      platforms: [],
      po_number: poNumber,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <StyledDialogTitle>Create Payout</StyledDialogTitle>
      <StyledDialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          margin="normal"
          label="PO Number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </StyledDialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Create Payout</Button>
      </StyledDialogActions>
    </Dialog>
  );
};

const OfferDialog = ({ open, onClose, offer }) => {
  const [daysSinceSent, setDaysSinceSent] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const calculateDaysSinceSent = () => {
      const sentDate = new Date(offer.sentDate);
      const currentDate = new Date();
      const differenceInTime = currentDate - sentDate;
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      setDaysSinceSent(Math.round(differenceInDays));
    };

    calculateDaysSinceSent();
  }, [offer.sentDate]);

  const completeOfferMutation = useMutation(
    () => client.deliverables.update(offer.id, { status: "COMPLETE" }),
    {
      onSuccess: () => {
        createPayoutAndInvoice();
      },
      onError: (error) => {
        console.error("Error completing offer:", error);
        setShowError(true);
        setErrorMessage("Error completing offer. Please try again.");
      }
    }
  );

  const createPayoutAndInvoice = () => {
    const poNumber = `PO-${Math.floor(Math.random() * 1000000)}`;

    const payoutData = {
      creator_id: offer.creator_id,  // Ensure this is correctly referenced
      amount: offer.amount,
      po_number: poNumber,
      notes: `Payout for completed offer ${offer.id}`,
      bypassSMSVerification: true,
      blitzPay: true
    };

    client.payouts.create(payoutData)
      .then(() => {
        setShowSuccess(true);
        onClose();
      })
      .catch(error => {
        console.error("Error creating payout and invoice:", error);
        setShowError(true);
        setErrorMessage("Error creating payout and invoice. Please try again.");
      });
  };

  const handleCompleteOffer = () => {
    completeOfferMutation.mutate();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <StyledDialogTitle>View Offer</StyledDialogTitle>
      <StyledDialogContent>
        <Typography variant="body1">Offer Details:</Typography>
        <Typography variant="body2">{offer.details}</Typography>
        <Typography variant="body1">Days Since Offer Sent: {daysSinceSent}</Typography>
      </StyledDialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="secondary">Close</Button>
        <Button onClick={handleCompleteOffer} color="primary">Complete Offer</Button>
      </StyledDialogActions>
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Offer completed and payout issued successfully.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

const DeliverableCard = ({ deliverable, onViewOffer }) => (
  <Card sx={{ marginBottom: 2, backgroundColor: "#424242", color: "white", display: "flex", flexDirection: "column" }}>
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

const PartnershipsDialog = ({ open, onClose, creator, partnershipId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sendOfferOpen, setSendOfferOpen] = useState(false);
  const [sendPayoutOpen, setSendPayoutOpen] = useState(false);
  const [viewOfferOpen, setViewOfferOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);  // New state for details view
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const [showMessageCapAlert, setShowMessageCapAlert] = useState(false);
  const { getCurrrentUser } = useAuth();
  const queryClient = useQueryClient();
  const [offerSent, setOfferSent] = useState(false);  // New state for offer sent status

  const userInfo = getCurrrentUser();

  const fetchMessages = useQuery(
    ['messages', conversationId],
    () => client.partnershipConversations.getMessages(conversationId),
    {
      enabled: !!conversationId,
      onSuccess: (data) => {
        const sortedMessages = data.sort((a, b) => a.id - b.id);
        setMessages(sortedMessages);
        const userMessages = sortedMessages.filter(msg => msg.sender_id === userInfo.id);
        const creatorMessages = sortedMessages.filter(msg => msg.sender_id !== userInfo.id);
        if (creatorMessages.length > 0) {
          const lastCreatorMessageTime = new Date(creatorMessages[creatorMessages.length - 1].created_at).getTime();
          const recentUserMessages = userMessages.filter(msg => new Date(msg.created_at).getTime() > lastCreatorMessageTime);
          setUserMessagesCount(recentUserMessages.length);
        } else {
          setUserMessagesCount(userMessages.length);
        }
      },
    }
  );

  const checkConversation = useMutation(client.partnershipConversations.check, {
    onSuccess: (data) => {
      if (data.exists) {
        setConversationId(data.conversation_id);
      } else {
        createConversation.mutate({ partnership_id: partnershipId, creator_id: creator.name });
      }
    },
    onError: (error) => {
      console.error("Error checking conversation:", error);
    },
  });

  const createConversation = useMutation(client.partnershipConversations.create, {
    onSuccess: (data) => {
      setConversationId(data.conversation_id);
    },
    onError: (error) => {
      console.error("Error creating conversation:", error);
    },
  });

  const sendMessageMutation = useMutation(client.partnershipConversations.sendMessage, {
    onSuccess: (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender_id: "You", message: newMessage.message, created_at: new Date() },
      ]);
      setMessage("");
      setUserMessagesCount(prevCount => prevCount + 1);
      queryClient.invalidateQueries(['messages', conversationId]);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  const handleSendMessage = () => {
    if (!offerSent) {
      alert("To start this collaboration, send an offer!");
      return;
    }

    if (userMessagesCount >= 5) {
      setShowMessageCapAlert(true);
      return;
    }

    if (conversationId) {
      sendMessageMutation.mutate({
        conversation_id: conversationId,
        message,
      });
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSendOfferClick = () => {
    setSendOfferOpen(true);
  };

  const handleSendPayoutClick = () => {
    setSendPayoutOpen(true);
  };

  const handleViewOfferClick = (offer) => {
    setSelectedOffer(offer);
    setViewOfferOpen(true);
  };

  const handleViewDetailsClick = () => {
    setViewDetailsOpen(true);
    handleMenuClose();
  };

  const handleOfferSent = () => {
    sendMessageMutation.mutate({
      conversation_id: conversationId,
      message: "An offer was made, see above.",
    });
    setOfferSent(true);  // Set offer sent status to true
  };

  useEffect(() => {
    if (open && partnershipId && creator) {
      checkConversation.mutate({ partnership_id: partnershipId, creator_id: creator.name });
    }
  }, [open, partnershipId, creator]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <StyledDialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar src={creator.pfphref || "/placeholder.png"} alt={creator.name} />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              {creator.name}
            </Typography>
          </Box>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Close Partnership</MenuItem>
            <MenuItem onClick={handleViewDetailsClick}>View Partnership Details</MenuItem>
          </Menu>
        </Box>
      </StyledDialogTitle>
      <StyledDialogContent>
        {fetchMessages.isLoading && <Typography>Loading messages...</Typography>}
        {fetchMessages.error && <Typography>Error loading messages</Typography>}
        <Box
          display="flex"
          flexDirection="column"
          sx={{ minHeight: "400px", maxHeight: "600px", overflowY: "auto" }}
        >
          {!offerSent && (
            <Typography variant="body1" color="error" sx={{ marginBottom: 2 }}>
              To start this collaboration, send an offer!
            </Typography>
          )}
          {messages.map((msg, index) => (
            msg.deliverable ? (
              <DeliverableCard key={index} deliverable={msg.deliverable} onViewOffer={handleViewOfferClick} />
            ) : (
              <Typography key={index} variant="body1" sx={{ marginBottom: 2 }}>
                <strong>{msg.sender_id === userInfo.id ? "You" : creator.name}:</strong> {msg.message}
              </Typography>
            )
          ))}
        </Box>
      </StyledDialogContent>
      <ButtonBar>
        <CustomButton variant="contained" startIcon={<OfferIcon />} onClick={handleSendOfferClick}>
          Send Offer
        </CustomButton>
        <CustomButton variant="contained" startIcon={<ContractIcon />} onClick={() => { /* Add handler for Send Contract */ }}>
          Schedule a meeting
        </CustomButton>
        <CustomButton variant="contained" startIcon={<PayoutIcon />} onClick={handleSendPayoutClick}>
          Send Payout
        </CustomButton>
      </ButtonBar>
      <StyledDialogActions>
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
          InputProps={{
            style: {
              color: 'white',
              backgroundColor: '#424242',
            },
          }}
        />
        <IconButton onClick={handleSendMessage} color="primary" sx={{ ml: 2 }}>
          <SendIcon />
        </IconButton>
      </StyledDialogActions>
      
      <SendOfferDialog
        open={sendOfferOpen}
        onClose={() => setSendOfferOpen(false)}
        partnershipId={partnershipId}
        creatorId={creator.name}
        conversationId={conversationId}
        onOfferSent={handleOfferSent}
      />
      <PayoutDialog
        open={sendPayoutOpen}
        onClose={() => setSendPayoutOpen(false)}
        partnershipId={partnershipId}
        creatorId={creator.name}
        conversationId={conversationId}
      />
      {selectedOffer && (
        <OfferDialog
          open={viewOfferOpen}
          onClose={() => setViewOfferOpen(false)}
          offer={selectedOffer}
        />
      )}
      <PartnershipsDetailView
        open={viewDetailsOpen}
        onClose={() => setViewDetailsOpen(false)}
        partnershipId={partnershipId}
        creator={creator}
      />

      <Snackbar
        open={showMessageCapAlert}
        autoHideDuration={6000}
        onClose={() => setShowMessageCapAlert(false)}
      >
        <Alert onClose={() => setShowMessageCapAlert(false)} severity="warning" sx={{ width: '100%' }}>
          Messages since last creator response: You are capped at 5
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default PartnershipsDialog;
