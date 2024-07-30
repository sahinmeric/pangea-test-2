import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import {
  Box,
  Typography,
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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useMutation } from 'react-query';
import client from '../../../../API';  // Adjust the import path according to your project structure

// Styled components to match dark mode
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

const AssetsTab = ({ campaignDetails, onUpdate }) => {
  const [newCreator, setNewCreator] = useState({
    name: "",
    platform: "",
    promotionType: "",
    creatorBrief: "",
    postingInstructions: "",
    boostCode: "",
  });

  const { mutate: resendLaunchCampaign, isLoading: isResending } = useMutation(
    (creatorId) => client.campaigns.resendLaunch({ creatorId, campaignId: campaignDetails.id }),
    {
      onSuccess: () => {
        alert('Launch campaign information resent successfully');
      },
      onError: (error) => {
        console.error('Error resending launch campaign information:', error);
        alert('Error resending launch campaign information');
      },
    }
  );

  const handleInputChange = (index, field, value) => {
    const updatedCreators = campaignDetails.creators.map((creator, idx) => {
      if (index === idx) {
        return { ...creator, [field]: value };
      }
      return creator;
    });
    onUpdate({ ...campaignDetails, creators: updatedCreators });
  };

  const handleAddCreator = () => {
    const updatedCreators = [...campaignDetails.creators, newCreator];
    onUpdate({ ...campaignDetails, creators: updatedCreators });
    setNewCreator({
      name: "",
      platform: "",
      promotionType: "",
      creatorBrief: "",
      postingInstructions: "",
      boostCode: "",
    });
  };

  const handleChangeNewCreator = (field, value) => {
    setNewCreator((prev) => ({ ...prev, [field]: value }));
  };

  const promotionTypeOptions = {
    TikTok: ["Sound", "Brand", "Livestream", "UGC"],
    Instagram: ["Sound", "Brand", "Feed Post", "UGC"],
    YouTube: ["3045s Integration", "60s Integration", "Shorts", "UGC"],
    Other: ["Sponsored Post", "Ad Placement", "Product Review", "UGC"],
  };

  const getPromotionTypes = (platform) => {
    return promotionTypeOptions[platform] || promotionTypeOptions["Other"];
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ margin: 2, color: 'white' }}>
        Campaign Brief: {campaignDetails.brief}
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: '#333' }}>
        <Table aria-label="assets details">
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Name/ID</StyledTableCell>
              <StyledTableCell>Platform</StyledTableCell>
              <StyledTableCell>Promotion Type</StyledTableCell>
              <StyledTableCell>Creator Brief</StyledTableCell>
              <StyledTableCell>Posting Instructions</StyledTableCell>
              <StyledTableCell>Boost Code</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {campaignDetails.creators &&
              campaignDetails.creators.map((creator, index) => (
                <StyledTableRow key={creator.id}>
                  <StyledTableCell>
                    <Select
                      value={creator?.name || ""}
                      onChange={(e) =>
                        handleInputChange(index, "name", e.target.value)
                      }
                      displayEmpty
                      fullWidth
                      sx={{ color: 'white', backgroundColor: '#424242' }}
                    >
                      {campaignDetails.creators.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Select
                      value={creator?.promotionPlatform || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "promotionPlatform",
                          e.target.value,
                        )
                      }
                      fullWidth
                      sx={{ color: 'white', backgroundColor: '#424242' }}
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
                  </StyledTableCell>
                  <StyledTableCell>
                    <Select
                      value={creator?.promotionType || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "promotionType",
                          e.target.value,
                        )
                      }
                      fullWidth
                      sx={{ color: 'white', backgroundColor: '#424242' }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {getPromotionTypes(creator?.promotionPlatform).map(
                        (type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      fullWidth
                      multiline={true}
                      minRows={2}
                      value={creator?.creatorBrief || ""}
                      onChange={(e) =>
                        handleInputChange(index, "creatorBrief", e.target.value)
                      }
                      sx={{ color: 'white', backgroundColor: '#424242' }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      fullWidth
                      multiline
                      value={creator?.postingInstructions || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "postingInstructions",
                          e.target.value,
                        )
                      }
                      sx={{ color: 'white', backgroundColor: '#424242' }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      fullWidth
                      value={creator?.boostCode || ""}
                      onChange={(e) =>
                        handleInputChange(index, "boostCode", e.target.value)
                      }
                      sx={{ color: 'white', backgroundColor: '#424242' }}
                    />
                  </StyledTableCell>
                   {/* <StyledTableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => resendLaunchCampaign(creator.id)}
                      disabled={isResending}
                    >
                      {isResending ? "Resending..." : "Resend Offer"}
                    </Button>
                  </StyledTableCell>
                  */}
                </StyledTableRow>
              ))}
            <StyledTableRow>
              <StyledTableCell>
                <Select
                  value={newCreator.name}
                  onChange={(e) =>
                    handleChangeNewCreator("name", e.target.value)
                  }
                  displayEmpty
                  fullWidth
                  sx={{ color: 'white', backgroundColor: '#424242' }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {campaignDetails.creators.map((creator) => (
                    <MenuItem key={creator.id} value={creator.name}>
                      {creator.name}
                    </MenuItem>
                  ))}
                </Select>
              </StyledTableCell>
              <StyledTableCell>
                <Select
                  value={newCreator.promotionPlatform}
                  onChange={(e) =>
                    handleChangeNewCreator("promotionPlatform", e.target.value)
                  }
                  displayEmpty
                  fullWidth
                  sx={{ color: 'white', backgroundColor: '#424242' }}
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
              </StyledTableCell>
              <StyledTableCell>
                <Select
                  value={newCreator.promotionType}
                  onChange={(e) =>
                    handleChangeNewCreator("promotionType", e.target.value)
                  }
                  displayEmpty
                  fullWidth
                  sx={{ color: 'white', backgroundColor: '#424242' }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {getPromotionTypes(newCreator.platform).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  value={newCreator.creatorBrief}
                  onChange={(e) =>
                    handleChangeNewCreator("creatorBrief", e.target.value)
                  }
                  placeholder="Creator Brief"
                  fullWidth
                  multiline={true}
                  minRows={2}
                  sx={{ color: 'white', backgroundColor: '#424242' }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  value={newCreator.postingInstructions}
                  onChange={(e) =>
                    handleChangeNewCreator(
                      "postingInstructions",
                      e.target.value,
                    )
                  }
                  placeholder="Posting Instructions"
                  fullWidth
                  multiline
                  sx={{ color: 'white', backgroundColor: '#424242' }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <TextField
                  value={newCreator.boostCode}
                  onChange={(e) =>
                    handleChangeNewCreator("boostCode", e.target.value)
                  }
                  placeholder="Boost Code"
                  fullWidth
                  sx={{ color: 'white', backgroundColor: '#424242' }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <IconButton onClick={handleAddCreator} color="primary">
                  <AddCircleOutlineIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssetsTab;
