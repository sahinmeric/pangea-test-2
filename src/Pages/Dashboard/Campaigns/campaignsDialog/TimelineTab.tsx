import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  TableFooter,
  Checkbox,
  Tooltip,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { StyledTableRow } from "../../../../Utils/styledcell";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiDateField from "../../../../Components/MuiDateField";
import { timelineEvents } from "./mockData";
import { Campaign, TimelineEvent } from "./types";
import { formatDateToYYYYMMDD } from "./utils";

interface TimelineEntryProps {
  event: TimelineEvent & {
    index: number;
    manager_notes?: string;
    will_delete: boolean;
  };
  onEditField: (index: number, field: string, value: any) => void;
  campaignStatus: string;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({
  event,
  onEditField,
  campaignStatus,
}) => (
  <StyledTableRow sx={{ paddingY: 1.5 }}>
    <TableCell sx={{ padding: "8px 16px" }}>
      <TextField
        value={event.objective}
        id="Objective-picker"
        fullWidth
        onChange={(e) => onEditField(event.index, "objective", e.target.value)}
        disabled={campaignStatus !== "Draft"}
        variant="outlined"
        size="small"
        sx={{ borderRadius: 1, padding: "4px" }}
      />
    </TableCell>
    <TableCell sx={{ padding: "8px 16px" }}>
      <TextField
        value={event.status}
        fullWidth
        disabled
        inputProps={{ style: { textTransform: "capitalize" } }}
        variant="outlined"
        size="small"
        sx={{ borderRadius: 1, padding: "4px" }}
      />
    </TableCell>
    <TableCell sx={{ padding: "8px 16px" }}>
      <TextField
        value={event.notes}
        fullWidth
        disabled={campaignStatus !== "Draft"}
        variant="outlined"
        size="small"
        sx={{ borderRadius: 1, padding: "4px" }}
      />
    </TableCell>
    <TableCell sx={{ padding: "8px 16px" }}>
      <Tooltip title="Only you can see this">
        <TextField
          value={event.manager_notes || ""}
          id="Manager-notes-picker"
          fullWidth
          onChange={(e) =>
            onEditField(event.index, "manager_notes", e.target.value)
          }
          variant="outlined"
          size="small"
          sx={{ borderRadius: 1, padding: "4px" }}
        />
      </Tooltip>
    </TableCell>
    <TableCell
      align="center"
      sx={{ padding: "8px 16px", verticalAlign: "middle" }}
    >
      {event.status === "complete" ? (
        <CheckCircleIcon color="success" />
      ) : (
        <CheckCircleOutlineIcon />
      )}
    </TableCell>
    <TableCell
      align="center"
      sx={{ padding: "8px 16px", verticalAlign: "middle" }}
    >
      <Checkbox
        checked={event.manager_completed}
        onChange={(e) =>
          onEditField(event.index, "manager_completed", e.target.checked)
        }
        color="primary"
        sx={{ padding: "0px" }}
      />
    </TableCell>
    <TableCell sx={{ padding: "8px 16px" }}>
      <MuiDateField
        id="date-picker"
        label="Due Date"
        type="date"
        fullWidth
        variant="outlined"
        size="small"
        value={formatDateToYYYYMMDD(new Date(event.projected_date))}
        disabled={campaignStatus !== "Draft"}
        onChange={() => {}}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ borderRadius: 1, padding: "4px" }}
      />
    </TableCell>
    <TableCell
      align="center"
      sx={{ padding: "8px 16px", verticalAlign: "middle" }}
    >
      <Checkbox
        checked={event.will_delete}
        checkedIcon={<DeleteIcon color="error" />}
        icon={<DeleteOutlineIcon />}
        onChange={(e) =>
          onEditField(event.index, "will_delete", e.target.checked)
        }
        disabled={campaignStatus !== "Draft"}
        sx={{ padding: "0px" }}
      />
    </TableCell>
  </StyledTableRow>
);

interface TimelineTabProps {
  campaignDetails: Campaign;
  onEditField: (index: number, field: string, value: any) => void;
  onCreateRow: (creator: string) => void;
}

const TimelineTab: React.FC<TimelineTabProps> = ({
  campaignDetails,
  onEditField,
  onCreateRow,
}) => {
  const [selectedCreator, setSelectedCreator] = useState<string>(
    campaignDetails.creators[0]?.id || ""
  );

  if (!timelineEvents) {
    return (
      <Box textAlign="center" p={2}>
        <Typography variant="h6" color="textSecondary">
          No timeline events available
        </Typography>
      </Box>
    );
  }

  const currentTimeline = timelineEvents
    .map((event, index) => ({ ...event, index }))
    .filter((event) => event.username === selectedCreator)
    .sort(
      (a, b) =>
        new Date(a.projected_date).getTime() -
        new Date(b.projected_date).getTime()
    );

  return (
    <Box>
      <FormControl
        sx={{ marginBottom: 2, width: "12rem" }}
        size="small"
        variant="outlined"
      >
        <InputLabel id="creator-select-label">Creator</InputLabel>
        <Select
          labelId="creator-select-label"
          id="creator-select"
          value={selectedCreator}
          onChange={(e) => setSelectedCreator(e.target.value)}
          label="Creator"
        >
          {campaignDetails.creators.map((creator) => (
            <MenuItem key={creator.id} value={creator.id}>
              {creator.id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table aria-label="timeline details">
          <TableHead>
            <StyledTableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Objective
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Notes
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Manager only notes
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Delivered
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Accepted
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  padding: "12px 16px",
                  textAlign: "center",
                }}
              >
                Remove
              </TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {currentTimeline.length > 0 ? (
              currentTimeline.map((event) => (
                <TimelineEntry
                  key={event.index}
                  event={event}
                  onEditField={onEditField}
                  campaignStatus={campaignDetails.campaign_status}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No events found for the selected creator
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {campaignDetails.campaign_status === "Draft" && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <IconButton
                    color="primary"
                    onClick={() => onCreateRow(selectedCreator)}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimelineTab;
