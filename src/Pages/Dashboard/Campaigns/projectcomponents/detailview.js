import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardHeader
} from "@mui/material";
import { useQuery } from "react-query";
import { styled } from "@mui/system";
import client from "../../../../API";
import MenuIcon from "@mui/icons-material/Menu";

const StyledDialogTitle = styled(DialogTitle)`
  background-color: #424242;
  color: white;
`;

const StyledDialogContent = styled(DialogContent)`
  background-color: #333;
  color: white;
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

const DeliverableCard = ({ deliverable }) => (
  <Card sx={{ marginBottom: 2, backgroundColor: "#424242", color: "white" }}>
    <CardHeader title={`Deliverable: ${deliverable.deliverable_type}`} />
    <CardContent>
      <Typography variant="body2">Amount: {deliverable.amount || 'N/A'}</Typography>
      <Typography variant="body2">Status: {deliverable.status}</Typography>
      <Typography variant="body2">Notes: {deliverable.notes}</Typography>
      <Typography variant="body2">Due Date: {deliverable.due_date}</Typography>
      <Typography variant="body2">Platforms: {deliverable.platforms.join(', ')}</Typography>
    </CardContent>
  </Card>
);

const PartnershipsDetailView = ({ open, onClose, partnershipId, creator }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { data: deliverables, isLoading, error } = useQuery(
    ["deliverables", partnershipId],
    () => client.deliverables.getByPartnership(partnershipId),
    {
      enabled: !!partnershipId,
    }
  );

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) return <Typography>Loading deliverables...</Typography>;
  if (error) return <Typography>Error loading deliverables</Typography>;

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
            <MenuItem onClick={handleMenuClose}>View Partnership Details</MenuItem>
          </Menu>
        </Box>
      </StyledDialogTitle>
      <StyledDialogContent>
        {deliverables.length === 0 ? (
          <Typography>No deliverables assigned to this partnership.</Typography>
        ) : (
          deliverables.map((deliverable, index) => (
            <DeliverableCard key={index} deliverable={deliverable} />
          ))
        )}
      </StyledDialogContent>
      <StyledDialogActions>
        <CustomButton onClick={onClose}>Close</CustomButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default PartnershipsDetailView;
