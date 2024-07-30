import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { StyledTableRow } from "../../../../Utils/styledcell";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiDateField from "../../../../Components/MuiDateField";

function formatDateToYYYYMMDD(dateTime) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(dateTime);
  return formattedDate.replace(/\//g, '-');
}

function PickerToLocal(dateObject) {
  //console.log("Receiving date:", dateObject);
  const localDate = new Date(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate());
  return localDate
}

const TimelineEntry = ({ event, onEditField, campaignStatus }) => (
  <StyledTableRow
    sx={
      (theme) => ({
        ...(event.will_delete ? { bgcolor: `${theme.palette.error.main} !important` } : {}),
        ...(event.status === 'complete' ? {
          border: `2px solid ${theme.palette.success.main}`
        } : {})
      })
    }
  >
    <TableCell>
      <TextField
        value={event.objective}
        id="Objective-picker"
        fullWidth
        onChange={(e) => (onEditField(event.index, 'objective', e.target.value))}
        disabled={campaignStatus != 'Draft'}
      >
      </TextField>
    </TableCell>
    <TableCell>
      <TextField
        value={event.status}
        fullWidth
        disabled
        inputProps={{ style: { textTransform: 'capitalize' } }}
      >
      </TextField>
    </TableCell>
    <TableCell>
      <TextField
        value={event.notes}
        fullWidth
        minRows={2}
        multiline
        disabled={campaignStatus != 'Draft'}
      >
      </TextField>
    </TableCell>
    <TableCell>
      <Tooltip title='Only you can see this'>
        <TextField
          value={event.manager_notes}
          id="Objective-picker"
          fullWidth
          onChange={(e) => (onEditField(event.index, 'manager_notes', e.target.value))}
        >
        </TextField>
      </Tooltip>
    </TableCell>
    <TableCell align="right">
      {event.status === 'complete' ?
        <CheckCircleIcon color="success"></CheckCircleIcon>
        :
        <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
      }
    </TableCell>
    <TableCell align="right">
      <Checkbox
        checked={event.manager_completed}
        onChange={(e) => (onEditField(event.index, 'manager_completed', e.target.checked))}
      ></Checkbox>
    </TableCell>
    <TableCell>
      <MuiDateField
        id="date-picker"
        label="Due Date"
        type="date"
        fullWidth
        variant="outlined"
        value={formatDateToYYYYMMDD(event.projected_date)}
        disabled={campaignStatus != 'Draft'}
        onChange={(e) => (onEditField(event.index, 'projected_date', PickerToLocal(e.target.valueAsDate)))}
        InputLabelProps={{
          shrink: true,
        }}>
      </MuiDateField>
    </TableCell>
    <TableCell align="right">
      <Checkbox
        checked={event.will_delete}
        checkedIcon={<DeleteIcon></DeleteIcon>}
        icon={<DeleteOutlineIcon></DeleteOutlineIcon>}
        onChange={(e) => (onEditField(event.index, 'will_delete', e.target.checked))}
        disabled={campaignStatus != 'Draft'}
      ></Checkbox>
    </TableCell>
  </StyledTableRow>
)


const TimelineTab = ({ campaignDetails, timelineEvents, onEditField, onCreateRow }) => {

  const [selectedCreator, setSelectedCreator] = useState(campaignDetails.creators[0].id)

  if (timelineEvents === undefined || timelineEvents === null) {
    return (<></>);
  }

  const currentTimeline = timelineEvents.map((event, index) => ({ ...event, index })).filter((event) => (event.username == selectedCreator));
  currentTimeline.sort((a, b) => new Date(a.projected_date) - new Date(b.projected_date));

  return (
    <Box>
      <FormControl sx={{ marginBlockEnd: 2, width: '12rem' }}>
        <InputLabel id="creator-select-label">Creator</InputLabel>
        <Select labelId="creator-select-label"
          id='creator-select'
          lable='Select'
          value={selectedCreator}
          onChange={(e) => setSelectedCreator(e.target.value)}
        >
          {campaignDetails.creators.map((creator) => (<MenuItem key={creator.id} value={creator.id}>{creator.id}</MenuItem>))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table aria-label="assets details">
          <TableHead>
            <StyledTableRow>
              <TableCell>Objective</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell><Tooltip title='Only you can see this'>Manager only notes</Tooltip></TableCell>
              <TableCell width={'5rem'}>Creator Delivered</TableCell>
              <TableCell width={'5rem'}>Accepted</TableCell>
              <TableCell>Date</TableCell>
              <TableCell width={'5rem'}>Actions</TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {currentTimeline.map((event) => (
              <TimelineEntry key={event.index} event={event} onEditField={onEditField} campaignStatus={campaignDetails.campaign_status}></TimelineEntry>
            ))}
          </TableBody>
          {campaignDetails.campaign_status == 'Draft' && <TableFooter>
            <TableRow>
              <TableCell colSpan={8} align="right">
                <IconButton color="primary" onClick={() => onCreateRow(selectedCreator)} >
                  <AddCircleOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableFooter>}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimelineTab;
