import React from "react";
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
  Link,
  IconButton,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { StyledTableRow } from "../../../../Utils/styledcell";
import { campaign } from "./mockData";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Campaign } from "./types";
import { CampaignManager } from "./types";
import CustomTableCell from "./CustomTableCell";

type OverviewTabProps = {
  campaignData: Campaign;
  creatorsToRemove: any;
  toggleCreatorRemoval: any;
  handleCreatorFieldChange: any;
  newPrices: any;
  newAgencyRate: any;
  isAgency: boolean;
  blitzAutoCampaign: any;
  isDraft: boolean;
  isLaunched: boolean;
  totalCampaignSum: number;
  totalCreators: number;
  creatorExpenseSum: number;
  currentManager: CampaignManager | undefined;
  setCurrentManager: (manager: CampaignManager) => void;
  toggleManager: any;
  setToggleManager: any;
  managers: CampaignManager[];
  isTcc: boolean;
};

const OverviewTab: React.FC<OverviewTabProps> = ({
  campaignData,
  creatorsToRemove,
  toggleCreatorRemoval,
  handleCreatorFieldChange,
  newPrices,
  newAgencyRate,
  isAgency,
  blitzAutoCampaign,
  isDraft,
  isLaunched,
  creatorExpenseSum,
}) => {
  const { creators } = campaignData;

  return (
    <Box>
      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead>
            <TableRow>
              <CustomTableCell label="Name/ID" />
              <CustomTableCell label="Price" />
              {isAgency && <CustomTableCell label="Agency Rate" />}
              <CustomTableCell label="Status" />
              <CustomTableCell label="Offer Sent" noWrap />
              <CustomTableCell label="Assets Sent" noWrap />
              <CustomTableCell label="Live Link" />
              <CustomTableCell label="Post Date" />
              <CustomTableCell label="Total Views" />
              <CustomTableCell label="Total Likes" />
              <CustomTableCell label="Total Comments" />
              {isLaunched && <CustomTableCell label="Approve Assets" />}
              <CustomTableCell label="Mark as Paid" noWrap />
              {isDraft && <CustomTableCell label="Remove" />}
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
                <TableCell>
                  <Link
                    href={`https://blitzpay.pro/creators/${encodeURIComponent(
                      creator.name
                    )}`}
                    target="_blank"
                  >
                    {creator.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={newPrices[creator.id] || creator.price}
                    onChange={(e) =>
                      handleCreatorFieldChange(
                        creator.id,
                        "price",
                        e.target.value
                      )
                    }
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: ".875rem" }}
                  />
                </TableCell>
                {isAgency && (
                  <TableCell>
                    <TextField
                      type="text"
                      value={newAgencyRate[creator.id] || ""}
                      onChange={(e) =>
                        handleCreatorFieldChange(
                          creator.id,
                          "agencyRate",
                          e.target.value
                        )
                      }
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: ".875rem" }}
                    />
                  </TableCell>
                )}
                <TableCell>
                  {blitzAutoCampaign ? (
                    creator.status
                  ) : (
                    <Select
                      value={creator.status || "Pitched"}
                      onChange={() => {}}
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Accepted">Accepted</MenuItem>
                      <MenuItem value="Declined">Declined</MenuItem>
                      <MenuItem value="Pitched">Pitched</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Drop">Drop</MenuItem>
                      <MenuItem value="Counter">Counter</MenuItem>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  {blitzAutoCampaign ? (
                    creator.offerSent ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : (
                    <Checkbox
                      checked={creator.offerSent || false}
                      onChange={(e) =>
                        handleCreatorFieldChange(
                          creator.id,
                          "offerSent",
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {blitzAutoCampaign ? (
                    creator.assetsSent ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : (
                    <Checkbox
                      checked={creator.assetsSent || false}
                      onChange={(e) =>
                        handleCreatorFieldChange(
                          creator.id,
                          "assetsSent",
                          e.target.checked
                        )
                      }
                      color="primary"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Live Link"
                    value={creator.liveLink || ""}
                    onChange={(e) =>
                      handleCreatorFieldChange(
                        creator.id,
                        "liveLink",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  {blitzAutoCampaign ? (
                    creator.postDate || "N/A"
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="YYYY-MM-DD"
                      value={creator.postDate || ""}
                      onChange={(e) =>
                        handleCreatorFieldChange(
                          creator.id,
                          "postDate",
                          e.target.value
                        )
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  {blitzAutoCampaign ? (
                    creator.totalViews || "N/A"
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Total Views"
                      value={creator.totalViews || ""}
                      onChange={(e) =>
                        handleCreatorFieldChange(
                          creator.id,
                          "totalViews",
                          e.target.value
                        )
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  {blitzAutoCampaign ? (
                    creator.likes || "N/A"
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Likes"
                      value={creator.likes || ""}
                      onChange={(e) =>
                        handleCreatorFieldChange(
                          creator.id,
                          "likes",
                          e.target.value
                        )
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  {blitzAutoCampaign ? (
                    creator.comments || "N/A"
                  ) : (
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Comments"
                      value={creator.comments || ""}
                      onChange={(e) =>
                        handleCreatorFieldChange(
                          creator.id,
                          "comments",
                          e.target.value
                        )
                      }
                    />
                  )}
                </TableCell>
                {isLaunched && (
                  <TableCell>
                    <IconButton
                      onClick={() => {}}
                      color={creator.assetsApproved ? "success" : "default"}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </TableCell>
                )}
                <TableCell>
                  <Checkbox
                    checked={
                      creator.skipPayout !== undefined
                        ? creator.skipPayout
                        : false
                    }
                    onChange={(e) =>
                      handleCreatorFieldChange(
                        creator.id,
                        "skipPayout",
                        e.target.checked
                      )
                    }
                    color="primary"
                  />
                </TableCell>
                {isDraft && (
                  <TableCell>
                    <IconButton
                      onClick={() => toggleCreatorRemoval(creator.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </StyledTableRow>
            ))}
            {isAgency && (
              <StyledTableRow>
                <TableCell colSpan={13} align="right">
                  <Typography variant="h6">
                    Creator Expense Sum: ${creatorExpenseSum.toFixed(2)}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack justifyContent="space-between" direction="row" my={2}>
        <Stack direction="row" alignItems="center">
          <Typography>Blitz This Campaign</Typography>
          <Switch
            checked={campaign.blitz_autocampaign}
            onChange={() => {}}
            name="blitzautocampaign"
            disabled={!campaign.blitz_autocampaign}
          />
          <Tooltip title="Automate your campaigns with Blitz so that the collaboration process is seamless for the creator over SMS, Whatsapp, and email. From our experience, this makes campaigns run 10x as fast!">
            <IconButton>
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          <Link color="primary" onClick={() => {}}>
            Download as CSV
          </Link>
        </Stack>
        <Button variant="contained" color="secondary" onClick={() => {}}>
          Add creators
        </Button>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        my={2}
      >
        <Stack direction="row" spacing={2} alignContent="center"></Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            href={campaign.drive_link}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!campaign.drive_link}
          >
            View Campaign Assets
          </Button>
          <Button variant="contained" color="primary" onClick={() => {}}>
            Apply changes
          </Button>
          <Button variant="contained" color="success" onClick={() => {}}>
            Launch Campaign
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default OverviewTab;
