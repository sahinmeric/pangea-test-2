import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import client from '../../../../../API';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, TablePagination } from '@mui/material';

const CampaignsTable = ({ setCampaignKpi }) => {
  const [campaignData, setCampaignData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { mutate: fetchCampaigns } = useMutation(client.campaigns.listKPI, {
    onSuccess: (data) => {
      setCampaignData(data);

      const sortedData = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
      const currentWeek = sortedData[0];
      const totalSum = data[currentWeek]?.total_sum || 0;
      setCampaignKpi({ progress: totalSum });
    },
    onError: (error) => {
      console.error("Error fetching campaigns:", error);
    },
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = Object.entries(campaignData).sort((a, b) => new Date(b[0]) - new Date(a[0]));

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Week Starting</TableCell>
              <TableCell style={{ color: "white" }}>Draft</TableCell>
              <TableCell style={{ color: "white" }}>Launched</TableCell>
              <TableCell style={{ color: "white" }}>Completed</TableCell>
              <TableCell style={{ color: "white" }}>Total Sum</TableCell>
              <TableCell style={{ color: "white" }}>Avg Completion Time (Days)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([weekRange, details]) => (
              <TableRow key={weekRange}>
                <TableCell>{weekRange}</TableCell>
                <TableCell>{details.Draft}</TableCell>
                <TableCell>{details.Launched}</TableCell>
                <TableCell>{details.Completed}</TableCell>
                <TableCell>${details.total_sum.toFixed(2)}</TableCell>
                <TableCell>{details.avg_completion_time !== null ? details.avg_completion_time.toFixed(2) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CampaignsTable;
