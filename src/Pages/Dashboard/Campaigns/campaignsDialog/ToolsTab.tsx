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
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { Campaign, Tool } from "./types";
import CustomTableCell from "./CustomTableCell";

type ToolsProps = {
  campaignDetails: Campaign;
};

const Tools: React.FC<ToolsProps> = ({ campaignDetails }) => {
  const [email, setEmail] = useState<string>("");
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [bonusDialogOpen, setBonusDialogOpen] = useState<boolean>(false);
  const [productDeliveryDialogOpen, setProductDeliveryDialogOpen] =
    useState<boolean>(false);
  const [hashtagDialogOpen, setHashtagDialogOpen] = useState<boolean>(false);
  const [bonuses, setBonuses] = useState<Tool[]>([]);
  const [productDeliveries, setProductDeliveries] = useState<Tool[]>([]);
  const [hashtags, setHashtags] = useState<Tool[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [toolDescription, setToolDescription] = useState<string>("");
  const [bonusAmount, setBonusAmount] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [cameThrough, setCameThrough] = useState<boolean>(false);
  const [deliveryMade, setDeliveryMade] = useState<boolean>(false);
  const [hashtagName, setHashtagName] = useState<string>("");
  const [hashtagDescription, setHashtagDescription] = useState<string>("");
  const [hashtagPerformance, setHashtagPerformance] = useState<string>("");

  useEffect(() => {
    setBonuses(
      campaignDetails.tools?.filter((tool) => tool.type === "bonus") || []
    );
    setProductDeliveries(
      campaignDetails.tools?.filter(
        (tool) => tool.type === "productDelivery"
      ) || []
    );
    setHashtags(
      campaignDetails.tools?.filter(
        (tool) => tool.type === "hashtagPerformance"
      ) || []
    );
  }, [campaignDetails.tools]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleShare = () => {
    console.log("Mock: Sharing campaign with email", email);
  };

  const handleToolSelection = (event: SelectChangeEvent<string>) => {
    setSelectedTool(event.target.value);
  };

  const handleBonusSubmit = () => {
    console.log("Mock: Adding bonus", {
      type: "bonus",
      info: {
        creatorId: selectedCreator,
        creatorName,
        toolDescription,
        bonusAmount,
      },
      meta: { cameThrough },
    });
    setBonusDialogOpen(false);
  };

  const handleProductDeliverySubmit = () => {
    console.log("Mock: Adding product delivery", {
      type: "productDelivery",
      info: {
        creatorId: selectedCreator,
        creatorName,
        toolDescription,
        deliveryAddress,
      },
      meta: { deliveryMade },
    });
    setProductDeliveryDialogOpen(false);
  };

  const handleHashtagSubmit = () => {
    console.log("Mock: Adding hashtag performance", {
      type: "hashtagPerformance",
      info: {
        creatorId: "all",
        hashtagName,
        hashtagDescription,
        hashtagPerformance,
      },
    });
    setHashtagDialogOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Stack>
      <Stack alignItems="flex-start" direction="column">
        <Typography>
          Share this campaign with your team by adding their email addresses
          below:
        </Typography>
        <TextField
          label="Email Address"
          type="email"
          value={email}
          onChange={handleEmailChange}
          variant="outlined"
          margin="dense"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleShare}
          sx={{ mb: 2, padding: "8px 16px" }}
        >
          Add Email
        </Button>
        {campaignDetails.shared_with && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Shared With:</Typography>
            <Typography>{campaignDetails.shared_with.join(", ")}</Typography>
          </Box>
        )}
      </Stack>
      <Stack alignItems="center" direction="column">
        <Typography>Tools</Typography>
        <Select
          value={selectedTool}
          onChange={handleToolSelection}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">
            <em>Select a Tool</em>
          </MenuItem>
          <MenuItem value="bonus">Bonus</MenuItem>
          <MenuItem value="productDelivery">Product Delivery</MenuItem>
          <MenuItem value="hashtagPerformance">
            Capture Hashtag Performance
          </MenuItem>
        </Select>
      </Stack>
      {bonusDialogOpen && (
        <Dialog
          open={bonusDialogOpen}
          onClose={() => setBonusDialogOpen(false)}
        >
          <DialogTitle>Assign Bonus</DialogTitle>
          <DialogContent>
            <Typography>Select a creator and assign a bonus:</Typography>
            <Select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ mt: 2, mb: 2 }}
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
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bonus Amount ($)"
              type="number"
              value={bonusAmount}
              onChange={(e) => setBonusAmount(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
              <Checkbox
                checked={cameThrough}
                onChange={(e) => setCameThrough(e.target.checked)}
              />
              <Typography>Came Through</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBonusDialogOpen(false)} size="small">
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleBonusSubmit}
              size="small"
            >
              Add Bonus
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {productDeliveryDialogOpen && (
        <Dialog
          open={productDeliveryDialogOpen}
          onClose={() => setProductDeliveryDialogOpen(false)}
        >
          <DialogTitle>Assign Product Delivery</DialogTitle>
          <DialogContent>
            <Typography>
              Select a creator and assign delivery details:
            </Typography>
            <Select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ mt: 2, mb: 2 }}
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
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Delivery Address"
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
              <Checkbox
                checked={deliveryMade}
                onChange={(e) => setDeliveryMade(e.target.checked)}
              />
              <Typography>Delivery Made</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setProductDeliveryDialogOpen(false)}
              size="small"
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleProductDeliverySubmit}
              size="small"
            >
              Confirm Delivery
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {hashtagDialogOpen && (
        <Dialog
          open={hashtagDialogOpen}
          onClose={() => setHashtagDialogOpen(false)}
        >
          <DialogTitle>Capture Hashtag Performance</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Hashtag Name"
              type="text"
              value={hashtagName}
              onChange={(e) => setHashtagName(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Hashtag Description"
              type="text"
              value={hashtagDescription}
              onChange={(e) => setHashtagDescription(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Hashtag Performance"
              type="text"
              value={hashtagPerformance}
              onChange={(e) => setHashtagPerformance(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHashtagDialogOpen(false)} size="small">
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleHashtagSubmit}
              size="small"
            >
              Add Hashtag
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Paper
        sx={{
          padding: 2,
          mt: 2,
          textAlign: "center",
          backgroundColor: "#424242",
          color: "white",
        }}
      >
        <Typography>
          Drag and drop CSV files here, or click to select files
        </Typography>
      </Paper>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mt: 2 }}>
        <Tab label="Bonuses" />
        <Tab label="Product Deliveries" />
        <Tab label="Hashtag Performances" />
      </Tabs>

      {selectedTab === 0 && (
        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <CustomTableCell label="Creator Name" />
              <CustomTableCell label="Tool Description" />
              <CustomTableCell label="Bonus Amount" />
              <CustomTableCell label="Came Through" />
            </TableRow>
          </TableHead>
          <TableBody>
            {bonuses.map((bonus, index) => (
              <TableRow key={index}>
                <TableCell>
                  {
                    campaignDetails.creators.find(
                      (c) => c.id === bonus.info.creatorId
                    )?.name
                  }
                </TableCell>
                <TableCell>{bonus.info?.toolDescription}</TableCell>
                <TableCell>{bonus.info?.bonusAmount}</TableCell>
                <TableCell>{bonus.meta?.cameThrough ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedTab === 1 && (
        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <CustomTableCell label="Creator Name" />
              <CustomTableCell label="Tool Description" />
              <CustomTableCell label="Delivery Address" />
              <CustomTableCell label="Delivery Made" />
            </TableRow>
          </TableHead>
          <TableBody>
            {productDeliveries.map((delivery, index) => (
              <TableRow key={index}>
                <TableCell>
                  {
                    campaignDetails.creators.find(
                      (c) => c.id === delivery.info.creatorId
                    )?.name
                  }
                </TableCell>
                <TableCell>{delivery.info?.toolDescription}</TableCell>
                <TableCell>{delivery.info?.deliveryAddress}</TableCell>
                <TableCell>
                  {delivery.meta?.deliveryMade ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedTab === 2 && (
        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <CustomTableCell label="Hashtag Name" />
              <CustomTableCell label="Hashtag Description" />
              <CustomTableCell label="Hashtag Performance" />
            </TableRow>
          </TableHead>
          <TableBody>
            {hashtags.map((hashtag, index) => (
              <TableRow key={index}>
                <TableCell>{hashtag.info?.hashtagName}</TableCell>
                <TableCell>{hashtag.info?.hashtagDescription}</TableCell>
                <TableCell>{hashtag.info?.hashtagPerformance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
};

export default Tools;
