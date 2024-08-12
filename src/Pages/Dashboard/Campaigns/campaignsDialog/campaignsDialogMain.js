import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TextField,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Select,
  MenuItem,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { StyledTableRow } from "../../../../Utils/styledcell";
import { useNavigate } from "react-router-dom";
import { campaign } from "./mockData";

function formatIdealDueDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${month}/${day}/${year}`;
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

const CampaignDetailDialog = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [poNumber, setPoNumber] = useState("PO-12345");
  const [creatorsToRemove, setCreatorsToRemove] = useState([]);

  // Destructure the imported campaign data
  const { id, name, ideal_duedate, creators, campaign_manager, blitz_autocampaign, campaign_status } = campaign;

  const handleChangeTab = (event, newValue) => {
    setTabIndex(newValue);
  };

  const toggleCreatorRemoval = (creatorId) => {
    setCreatorsToRemove((prevCreators) => {
      if (prevCreators.includes(creatorId)) {
        return prevCreators.filter((id) => id !== creatorId);
      } else {
        return [...prevCreators, creatorId];
      }
    });
  };

  // Add a check to ensure creators is defined
  if (!creators) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog
      open={true}
      onClose={() => { }}
      maxWidth="xl"
      fullWidth
      fullScreen={!isDesktop}
      scroll="paper"
      keepMounted={false}
    >
      <DialogTitle>
        <Stack>
          <Typography variant="h6" >
            Campaign Name: {name}
          </Typography>
          <Typography variant="h6" >
            Ideal Due Date: {formatIdealDueDate(ideal_duedate)}
          </Typography>
        </Stack>
        <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          <Tabs
            value={tabIndex}
            onChange={handleChangeTab}
            aria-label="campaign details tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ overflow: "visible", flexGrow: 1 }}
          >
            <Tab label="Overview" />
            <Tab label="Assets" />
            <Tab label="Tools" />
            <Tab label="Conversations" />
            <Tab label="Timeline" />
          </Tabs>
          <TextField
            label="PO Number"
            required
            fullWidth
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            sx={{ maxWidth: 200 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="contained" color="success">Launch Campaign</Button>
            <Button variant="contained" color="success">Add Creators</Button>
            <Button variant="contained" color="error">Approve Changes</Button>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers={true}>
        <TabPanel value={tabIndex} index={0}>
          <TableContainer component={Paper} elevation={4}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Remove</TableCell>
                  <TableCell>Name/ID</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Offer Sent</TableCell>
                  <TableCell>Assets Sent</TableCell>
                  <TableCell>Live Link</TableCell>
                  <TableCell>Post Date</TableCell>
                  <TableCell>Total Views</TableCell>
                  <TableCell>Total Likes</TableCell>
                  <TableCell>Total Comments</TableCell>
                  <TableCell>Mark as Paid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {creators.map((creator) => (
                  <StyledTableRow
                    key={creator.id}
                    sx={{
                      bgcolor: creatorsToRemove.includes(creator.id)
                        ? "#ffcccc"
                        : "inherit",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <IconButton
                        onClick={() => toggleCreatorRemoval(creator.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`https://blitzpay.pro/creators/${encodeURIComponent(creator.name)}`}
                        target="_blank"
                      >
                        {creator.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        value={creator.price}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: ".875rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={creator.status || ""}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="Pitched">Pitched</MenuItem>
                        <MenuItem value="Accepted">Accepted</MenuItem>
                        <MenuItem value="Declined">Declined</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Drop">Drop</MenuItem>
                        <MenuItem value="Counter">Counter</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={creator.offerSent === "Yes"} color="primary" />
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={creator.assetsSent === "Yes"} color="primary" />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Live Link"
                        value={creator.liveLink}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="YYYY-MM-DD"
                        value={creator.postDate}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Total Views"
                        value={creator.totalViews}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Total Likes"
                        value={creator.likes}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Total Comments"
                        value={creator.comments}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox color="primary" />
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          Assets
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          Tools
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          Conversations
        </TabPanel>
        <TabPanel value={tabIndex} index={4}>
          Timeline
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}

export default CampaignDetailDialog;
