import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, TablePagination, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { StyleButton, StyleContent, StyleStickyButtonContainter } from '../../../../../Utils/ThemedStyles';
import API from '../../../../../API';


const StyleFilter = {
  minWidth: 120
}

const IGDMView = () => {
  const [creatorCRMData, setCreatorCRMData] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(75);
  const [newStatus, setNewStatus] = useState('IGDM');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchIGDMData = async (filter) => {
    try {
      let data = await API.crm.creator_creators();
      data = data.filter(creator =>
        creator.link.includes('instagram') &&
        (filter === 'all' || creator.status === filter) &&
        parseInt(String(creator.following).replace(/,/g, ''), 10) > 100000
      );
      setCreatorCRMData(data);
      console.log('Fetched IGDM data:', data);
    } catch (error) {
      console.error('Failed to fetch IGDM data:', error);
    }
  };

  useEffect(() => {
    fetchIGDMData(statusFilter);
  }, [statusFilter]);

  const handleSelect = (id) => {
    setSelectedCreators(prevState =>
      prevState.includes(id) ? prevState.filter(creatorId => creatorId !== id) : [...prevState, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const pageCreators = creatorCRMData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setSelectedCreators(pageCreators.map(creator => creator.id));
    } else {
      setSelectedCreators([]);
    }
  };

  const handleChangeStatus = async () => {
    for (const id of selectedCreators) {
      await client.crm.creator_update_status({ id, status: newStatus });
    }
    setSelectedCreators([]);
    fetchIGDMData(statusFilter);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={StyleContent}>
      <Typography variant="h4" gutterBottom>
        IGDM Dashboard
      </Typography>
      <Box className={StyleStickyButtonContainter}>
        <FormControl variant="outlined" sx={StyleFilter}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            label="Status Filter"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="IGDM">IGDM</MenuItem>
            <MenuItem value="OTHER">OTHER</MenuItem>
            <MenuItem value="REMOVE">REMOVE</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={StyleFilter}>
          <InputLabel>Set Status</InputLabel>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            label="Set Status"
          >
            <MenuItem value="IGDM">IGDM</MenuItem>
            <MenuItem value="OTHER">OTHER</MenuItem>
            <MenuItem value="REMOVE">REMOVE</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleChangeStatus} sx={StyleButton}>
          Apply Status Change
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedCreators.length === creatorCRMData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                  indeterminate={selectedCreators.length > 0 && selectedCreators.length < creatorCRMData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length}
                />
              </TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Following</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>Avg Views</TableCell>
              <TableCell>Date Sourced</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Bio Link</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {creatorCRMData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((creator) => (
              <TableRow key={creator.id} selected={selectedCreators.includes(creator.id)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCreators.includes(creator.id)}
                    onChange={() => handleSelect(creator.id)}
                  />
                </TableCell>
                <TableCell><a href={creator.link} target="_blank" rel="noopener noreferrer">{creator.link}</a></TableCell>
                <TableCell>{creator.username}</TableCell>
                <TableCell>{creator.following}</TableCell>
                <TableCell>{creator.likes}</TableCell>
                <TableCell>{creator.avg_views}</TableCell>
                <TableCell>{creator.date_sourced}</TableCell>
                <TableCell>{creator.email}</TableCell>
                <TableCell><a href={creator.bio_link} target="_blank" rel="noopener noreferrer">{creator.bio_link}</a></TableCell>
                <TableCell>{creator.last_updated}</TableCell>
                <TableCell>{creator.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[75, 150, 225]}
          component="div"
          count={creatorCRMData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default IGDMView;
