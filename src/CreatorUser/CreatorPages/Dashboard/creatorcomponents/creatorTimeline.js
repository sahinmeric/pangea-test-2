import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React from "react";
import {
    Box,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Paper,
    TextField,
    IconButton,
    TableFooter,
    Checkbox,
    Select,
    MenuItem,
    Tooltip,
    Button,
    CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { StyledTableRow } from "../../../../Utils/styledcell";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { TimelineStatus } from "../../../../Utils/constants";

function formatDateToYYYYMMDD(dateTime) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(dateTime);
    return formattedDate.replace(/\//g, '-');
}


const TimelineEntry = ({ event, onEditField }) => (
    <StyledTableRow sx={(theme) => (event.status === 'complete' ? { bgcolor: `${theme.palette.success.main} !important` } : undefined)}>
        <TableCell>
            <TextField
                value={event.objective}
                id="Objective-picker"
                fullWidth
                disabled
            >
            </TextField>
        </TableCell>
        <TableCell>
            <Select value={event.status}
                fullWidth
                sx={{ textTransform: 'capitalize' }}
                onChange={(e) => (onEditField(event.index, 'status', e.target.value))}
            >
                {TimelineStatus.map((entry, index) => <MenuItem key={index} value={entry} sx={{ textTransform: 'capitalize' }}>{entry}</MenuItem>)}
            </Select>
        </TableCell>
        <TableCell>
            <TextField
                value={event.notes}
                id="Notes-picker"
                fullWidth
                minRows={2}
                multiline
                onChange={(e) => (onEditField(event.index, 'notes', e.target.value))}
            >
            </TextField>
        </TableCell>
        <TableCell>
            <Checkbox
                checked={event.manager_completed}
                disabled
            ></Checkbox>
        </TableCell>
        <TableCell>
            <TextField
                id="date-picker"
                fullWidth
                variant="outlined"
                value={formatDateToYYYYMMDD(event.projected_date)}
                disabled
                InputLabelProps={{
                    shrink: true,
                }}>
            </TextField>
        </TableCell>
        <TableCell align="right">
            <Tooltip title='Mark as Completed'>
                <IconButton onClick={(e) => (onEditField(event.index, 'status', event.status != 'complete' ? 'complete' : TimelineStatus[1]))}>
                    {event.status === 'complete' ?
                        <CheckCircleIcon></CheckCircleIcon>
                        :
                        <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
                    }
                </IconButton>
            </Tooltip>
        </TableCell>
    </StyledTableRow>
)


const CreatorTimeline = ({ timelineEvents, onEditField, onSaveChanges, isSavingChanges }) => {
    if (timelineEvents === undefined || timelineEvents === null) {
        return (<></>);
    }

    const currentTimeline = timelineEvents.map((event, index) => ({ ...event, index }));
    currentTimeline.sort((a, b) => new Date(a.projected_date) - new Date(b.projected_date));

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table aria-label="assets details">
                    <TableHead>
                        <StyledTableRow>
                            <TableCell>Objective</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Manager Accepted</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Completed</TableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {currentTimeline.map((event) => (<TimelineEntry key={event.id} event={event} onEditField={onEditField}></TimelineEntry>)
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6} align="right">
                                <Button variant="contained"
                                    startIcon={isSavingChanges ? (<CircularProgress size={'1em'}></CircularProgress>) : (<SaveIcon></SaveIcon>)}
                                    onClick={onSaveChanges}
                                    disabled={isSavingChanges}
                                    >
                                    Save changes
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CreatorTimeline;
