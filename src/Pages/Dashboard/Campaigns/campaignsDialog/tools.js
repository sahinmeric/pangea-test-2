import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useMutation } from "react-query";
import { useDropzone } from "react-dropzone";
import * as Papa from "papaparse";
import { styled } from "@mui/material/styles";

const StyledTableHead = styled(TableHead)`
  background-color: #424242;
  & th {
    color: white !important;
  }
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #3b3b3b;
  }
  &:nth-of-type(even) {
    background-color: #2b2b2b;
  }
`;

const StyledTableCell = styled(TableCell)`
  color: white !important;
`;

const Tools = ({ campaignDetails, onUpdate }) => {
  const [email, setEmail] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [productDeliveryDialogOpen, setProductDeliveryDialogOpen] = useState(false);
  const [hashtagDialogOpen, setHashtagDialogOpen] = useState(false);
  const [bonuses, setBonuses] = useState([]);
  const [productDeliveries, setProductDeliveries] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const [selectedCreator, setSelectedCreator] = useState(null);
  const [creatorName, setCreatorName] = useState("");
  const [toolDescription, setToolDescription] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [cameThrough, setCameThrough] = useState(false);
  const [deliveryMade, setDeliveryMade] = useState(false);
  const [hashtagName, setHashtagName] = useState("");
  const [hashtagDescription, setHashtagDescription] = useState("");
  const [hashtagPerformance, setHashtagPerformance] = useState("");

  useEffect(() => {
    const bonuses = campaignDetails.tools?.filter((tool) => tool.type === "bonus") || [];
    const productDeliveries = campaignDetails.tools?.filter((tool) => tool.type === "productDelivery") || [];
    const hashtags = campaignDetails.tools?.filter((tool) => tool.type === "hashtagPerformance") || [];
    setBonuses(bonuses);
    setProductDeliveries(productDeliveries);
    setHashtags(hashtags);
  }, [campaignDetails.tools]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleShare = () => {
    if (email) {
      shareCampaign.mutate();
    } else {
      alert("Please enter an email address.");
    }
  };

  const shareCampaign = useMutation(
    () => {
      const token = localStorage.getItem("jwtToken");
      return fetch(`https://blitz-backend-nine.vercel.app/api/campaigns/${campaignDetails.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
    },
    {
      onSuccess: () => {
        alert("Campaign shared successfully!");
        setEmail("");
        onUpdate({ ...campaignDetails, shared_with: [...campaignDetails.shared_with, email] });
      },
      onError: (error) => {
        alert(`Error sharing campaign: ${error.message}`);
      },
    }
  );

  const addTool = useMutation(
    (newTool) => {
      const token = localStorage.getItem("jwtToken");
      return fetch(`https://blitz-backend-nine.vercel.app/api/campaigns/${campaignDetails.id}/add_tool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTool),
      });
    },
    {
      onSuccess: (data) => {
        alert("Tool added successfully!");
        onUpdate(data.campaign);
      },
      onError: (error) => {
        alert(`Error adding tool: ${error.message}`);
      },
    }
  );

  const handleToolSelection = (event) => {
    setSelectedTool(event.target.value);
    if (event.target.value === "bonus") {
      setBonusDialogOpen(true);
    } else if (event.target.value === "productDelivery") {
      setProductDeliveryDialogOpen(true);
    } else if (event.target.value === "hashtagPerformance") {
      setHashtagDialogOpen(true);
    }
  };

  const handleBonusSubmit = () => {
    addTool.mutate({
      type: "bonus",
      info: { creatorId: selectedCreator, creatorName, toolDescription, bonusAmount },
      meta: { cameThrough },
    });
    setBonusDialogOpen(false);
    setBonusAmount("");
    setCreatorName("");
    setToolDescription("");
    setCameThrough(false);
  };

  const handleProductDeliverySubmit = () => {
    addTool.mutate({
      type: "productDelivery",
      info: { creatorId: selectedCreator, creatorName, toolDescription, deliveryAddress },
      meta: { deliveryMade },
    });
    setProductDeliveryDialogOpen(false);
    setDeliveryAddress("");
    setCreatorName("");
    setToolDescription("");
    setDeliveryMade(false);
  };

  const handleHashtagSubmit = () => {
    addTool.mutate({
      type: "hashtagPerformance",
      info: { creatorId: "all", hashtagName, hashtagDescription, hashtagPerformance },
    });
    setHashtagDialogOpen(false);
    setHashtagName("");
    setHashtagDescription("");
    setHashtagPerformance("");
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const parsedData = Papa.parse(text, { header: true }).data;
        parsedData.forEach((row) => {
          addTool.mutate({
            type: "hashtagPerformance",
            info: { creatorId: "all", hashtagName: row.hashtagName, hashtagDescription: row.hashtagDescription, hashtagPerformance: row.hashtagPerformance },
          });
        });
      };
      reader.readAsText(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
        Share this Campaign
      </Typography>
      <TextField
        label="Email Address"
        type="email"
        fullWidth
        value={email}
        onChange={handleEmailChange}
        variant="outlined"
        margin="normal"
        sx={{ mb: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { borderColor: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
      />
      <Button variant="contained" onClick={handleShare} fullWidth sx={{ mb: 2 }}>
        Add Email
      </Button>

      {campaignDetails.shared_with && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ color: 'white' }}>Shared With:</Typography>
          <Typography sx={{ color: 'white' }}>{campaignDetails.shared_with.join(", ")}</Typography>
        </Box>
      )}

      <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
        Tools
      </Typography>
      <Select
        value={selectedTool}
        onChange={handleToolSelection}
        displayEmpty
        fullWidth
        sx={{ mt: 2, mb: 2, color: 'white', backgroundColor: '#424242' }}
      >
        <MenuItem value="">
          <em>Select a Tool</em>
        </MenuItem>
        <MenuItem value="bonus">Bonus</MenuItem>
        <MenuItem value="productDelivery">Product Delivery</MenuItem>
        <MenuItem value="hashtagPerformance">Capture Hashtag Performance</MenuItem>
      </Select>

      {bonusDialogOpen && (
        <Dialog open={bonusDialogOpen} onClose={() => setBonusDialogOpen(false)}>
          <DialogTitle>Assign Bonus</DialogTitle>
          <DialogContent>
            <Typography>Select a creator and assign a bonus:</Typography>
            <Select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ mt: 2, mb: 2, color: 'white', backgroundColor: '#424242' }}
            >
              {campaignDetails.creators.map((creator) => (
                <MenuItem key={creator.id} value={creator.id}>
                  {creator.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              label="Tool Description"
              type="text"
              value={toolDescription}
              onChange={(e) => setToolDescription(e.target.value)}
              sx={{ mt: 2, mb: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { borderColor: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Bonus Amount ($)"
              type="number"
              value={bonusAmount}
              onChange={(e) => setBonusAmount(e.target.value)}
              sx={{ mt: 2, mb: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { borderColor: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
              <Checkbox
                checked={cameThrough}
                onChange={(e) => setCameThrough(e.target.checked)}
                sx={{ color: 'white' }}
              />
              <Typography sx={{ color: 'white' }}>Came Through</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBonusDialogOpen(false)}>Close</Button>
            <Button variant="contained" onClick={handleBonusSubmit}>
              Add Bonus
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {productDeliveryDialogOpen && (
        <Dialog open={productDeliveryDialogOpen} onClose={() => setProductDeliveryDialogOpen(false)}>
          <DialogTitle>Assign Product Delivery</DialogTitle>
          <DialogContent>
            <Typography>Select a creator and assign delivery details:</Typography>
            <Select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ mt: 2, mb: 2, color: 'white', backgroundColor: '#424242' }}
            >
              {campaignDetails.creators.map((creator) => (
                <MenuItem key={creator.id} value={creator.id}>
                  {creator.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              label="Tool Description"
              type="text"
              value={toolDescription}
              onChange={(e) => setToolDescription(e.target.value)}
              sx={{ mt: 2, mb: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { borderColor: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Delivery Address"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              sx={{ mt: 2, mb: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { borderColor: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
              <Checkbox
                checked={deliveryMade}
                onChange={(e) => setDeliveryMade(e.target.checked)}
                sx={{ color: 'white' }}
              />
              <Typography sx={{ color: 'white' }}>Delivery Made</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProductDeliveryDialogOpen(false)}>Close</Button>
            <Button variant="contained" onClick={handleProductDeliverySubmit}>
              Confirm Delivery
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {hashtagDialogOpen && (
        <Dialog open={hashtagDialogOpen} onClose={() => setHashtagDialogOpen(false)}>
          <DialogTitle>Capture Hashtag Performance</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Hashtag Name"
              type="text"
              value={hashtagName}
              onChange={(e) => setHashtagName(e.target.value)}
              sx={{ mt: 2, mb: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { borderColor: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Hashtag Description"
              type="text"
              value={hashtagDescription}
              onChange={(e) => setHashtagDescription(e.target.value)}
              sx={{ mt: 2, mb: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { borderColor: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Hashtag Performance"
              type="text"
              value={hashtagPerformance}
              onChange={(e) => setHashtagPerformance(e.target.value)}
              sx={{ mt: 2, mb: 2, input: { color: 'white' }, '& .MuiOutlinedInput-root': { borderColor: 'white' }, '& .MuiInputLabel-root': { color: 'white' } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHashtagDialogOpen(false)}>Close</Button>
            <Button variant="contained" onClick={handleHashtagSubmit}>
              Add Hashtag
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Paper {...getRootProps()} sx={{ padding: 2, mt: 2, textAlign: "center", backgroundColor: '#424242', color: 'white' }}>
        <input {...getInputProps()} />
        <Typography>Drag and drop CSV files here, or click to select files</Typography>
      </Paper>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mt: 2, color: 'white' }}>
        <Tab label="Bonuses" />
        <Tab label="Product Deliveries" />
        <Tab label="Hashtag Performances" />
      </Tabs>

      {selectedTab === 0 && (
        <Table size="small" sx={{ mt: 2 }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Creator Name</StyledTableCell>
              <StyledTableCell>Tool Description</StyledTableCell>
              <StyledTableCell>Bonus Amount</StyledTableCell>
              <StyledTableCell>Came Through</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {bonuses.map((bonus, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{campaignDetails.creators.find((c) => c.id === bonus.info?.creatorId)?.name}</StyledTableCell>
                <StyledTableCell>{bonus.info?.toolDescription}</StyledTableCell>
                <StyledTableCell>{bonus.info?.bonusAmount}</StyledTableCell>
                <StyledTableCell>{bonus.meta?.cameThrough ? "Yes" : "No"}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedTab === 1 && (
        <Table size="small" sx={{ mt: 2 }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Creator Name</StyledTableCell>
              <StyledTableCell>Tool Description</StyledTableCell>
              <StyledTableCell>Delivery Address</StyledTableCell>
              <StyledTableCell>Delivery Made</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {productDeliveries.map((delivery, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{campaignDetails.creators.find((c) => c.id === delivery.info?.creatorId)?.name}</StyledTableCell>
                <StyledTableCell>{delivery.info?.toolDescription}</StyledTableCell>
                <StyledTableCell>{delivery.info?.deliveryAddress}</StyledTableCell>
                <StyledTableCell>{delivery.meta?.deliveryMade ? "Yes" : "No"}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedTab === 2 && (
        <Table size="small" sx={{ mt: 2 }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Hashtag Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Performance</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {hashtags.map((hashtag, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{hashtag.info?.hashtagName}</StyledTableCell>
                <StyledTableCell>{hashtag.info?.hashtagDescription}</StyledTableCell>
                <StyledTableCell>{hashtag.info?.hashtagPerformance}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default Tools;
