import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  IconButton,
  TableCell,
  TableRow,
  TableFooter,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Campaign, Creator } from "./types";
import CustomTableCell from "./CustomTableCell";

type AssetsTabProps = {
  campaignDetails: Campaign;
  onUpdate: (updatedCampaign: Campaign) => void;
};

const promotionTypeOptions: { [key: string]: string[] } = {
  TikTok: ["Sound", "Brand", "Livestream", "UGC"],
  Instagram: ["Sound", "Brand", "Feed Post", "UGC"],
  YouTube: ["3045s Integration", "60s Integration", "Shorts", "UGC"],
  Other: ["Sponsored Post", "Ad Placement", "Product Review", "UGC"],
};

const AssetsTab: React.FC<AssetsTabProps> = ({ campaignDetails, onUpdate }) => {
  const [newCreator, setNewCreator] = useState<Partial<Creator>>({
    name: "",
    promotionPlatform: "",
    promotionType: "",
    creatorBrief: "",
    postingInstructions: "",
    boostCode: "",
  });

  const getPromotionTypes = (platform: string): string[] => {
    return promotionTypeOptions[platform] || promotionTypeOptions.Other;
  };

  const mockHandleInputChange = (
    index: number,
    field: string,
    value: string
  ) => {
    console.log(
      `Input changed at index ${index} for field ${field} with value ${value}`
    );
  };

  const mockHandleAddCreator = () => {
    console.log("Adding new creator:", newCreator);
    setNewCreator({
      name: "",
      promotionPlatform: "",
      promotionType: "",
      creatorBrief: "",
      postingInstructions: "",
      boostCode: "",
    });
  };

  return (
    <Box>
      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell label="Name/ID" />
              <CustomTableCell label="Platform" />
              <CustomTableCell label="Promotion Type" noWrap />
              <CustomTableCell label="Creator Brief" />
              <CustomTableCell label="Posting Instructions" />
              <CustomTableCell label="Boost Code" />
              <CustomTableCell label="Actions" />
            </TableRow>
          </TableHead>
          <TableBody>
            {campaignDetails.creators &&
              campaignDetails.creators.map((creator, index) => (
                <TableRow key={creator.id}>
                  <TableCell>
                    <Select
                      value={creator?.name || ""}
                      onChange={(e) =>
                        mockHandleInputChange(index, "name", e.target.value)
                      }
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {campaignDetails.creators.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={creator.promotionPlatform}
                      onChange={(e) =>
                        mockHandleInputChange(
                          index,
                          "promotionPlatform",
                          e.target.value
                        )
                      }
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {Object.keys(promotionTypeOptions).map((platform) => (
                        <MenuItem key={platform} value={platform}>
                          {platform}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={creator.promotionType || ""}
                      onChange={(e) =>
                        mockHandleInputChange(
                          index,
                          "promotionType",
                          e.target.value
                        )
                      }
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {getPromotionTypes(creator.promotionPlatform || "").map(
                        (type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={creator.creatorBrief}
                      onChange={(e) =>
                        mockHandleInputChange(
                          index,
                          "creatorBrief",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={creator.postingInstructions}
                      onChange={(e) =>
                        mockHandleInputChange(
                          index,
                          "postingInstructions",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={creator.boostCode}
                      onChange={(e) =>
                        mockHandleInputChange(
                          index,
                          "boostCode",
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        console.log(`Resend offer to ${creator.name}`)
                      }
                    >
                      Resend Offer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8} align="center">
                <IconButton color="primary" onClick={mockHandleAddCreator}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssetsTab;
