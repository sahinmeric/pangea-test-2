import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CreatorMiscPopup = ({
  openDialog,
  handleCloseDialog,
  project,
  creatorData = [],
  handleRemoveCreator
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const navigate = useNavigate();

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="lg"
      fullWidth
      fullScreen={!isDesktop}
      scroll="paper"
    >
      <DialogTitle>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">
              Project Name: {project.name}
            </Typography>
            <Typography variant="h6">
              Project Status: {project.status}
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent dividers={true}>
        <Tabs
          value={0}
          aria-label="project details tabs"
          sx={{ overflow: "visible", mb: 2 }}
        >
          <Tab label="Overview" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {project.name === "Gifting" ? (
            creatorData.length > 0 ? (
              <TableContainer component={Paper} elevation={4}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Creator ID</TableCell>
                      <TableCell>Affiliate Code</TableCell>
                      <TableCell>Affiliate Percentage</TableCell>
                      <TableCell>Delivery Address</TableCell>
                      <TableCell>Delivery Confirmation Number</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {creatorData.map((creator) => (
                      <StyledTableRow key={creator.creator_id}>
                        <TableCell>{creator.creator_id}</TableCell>
                        <TableCell>{creator.affiliate_code}</TableCell>
                        <TableCell>{creator.affiliate_percentage}</TableCell>
                        <TableCell>{creator.delivery_address}</TableCell>
                        <TableCell>{creator.delivery_confirmation_number}</TableCell>
                        <TableCell padding="checkbox">
                          <Button
                            color="error"
                            onClick={() => handleRemoveCreator(creator.creator_id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No creator data available.</Typography>
            )
          ) : project.name === "Event Invite" ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Event Details</Typography>
                    <Typography><strong>Location:</strong> {project.event_details?.location}</Typography>
                    <Typography><strong>Date & Time:</strong> {project.event_details?.timeDate}</Typography>
                    <Typography><strong>Other Details:</strong> {project.event_details?.otherDetails}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" color="primary" onClick={() => navigate('/event-details')}>
                      View More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography>Unknown project type.</Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseDialog} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatorMiscPopup;
