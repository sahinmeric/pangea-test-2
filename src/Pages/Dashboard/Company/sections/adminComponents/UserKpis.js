import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import client from '../../../../../API';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, TablePagination } from '@mui/material';

const UsersKPI = ({ setUserKpi }) => {
  const [userData, setUserData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { mutate: fetchUserKPIs, isLoading, isError, error } = useMutation(client.users.userKPI, {
    onSuccess: (data) => {
      console.log("Fetched user KPIs:", data);
      setUserData(data);

      const sortedData = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
      const currentWeek = sortedData[0];
      const newUsers = data[currentWeek]?.new_users || 0;
      setUserKpi({ progress: newUsers });
    },
    onError: (error) => {
      console.error('Failed to fetch user KPIs:', error);
    },
  });

  useEffect(() => {
    fetchUserKPIs();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const sortedData = Object.entries(userData || {}).sort((a, b) => new Date(b[0]) - new Date(a[0]));

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "white" }}>Week Starting</TableCell>
              <TableCell style={{ color: "white" }}>New Users</TableCell>
              <TableCell style={{ color: "white" }}>Logins This Week</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([week, data]) => (
              <TableRow key={week}>
                <TableCell>{week}</TableCell>
                <TableCell>{data.new_users}</TableCell>
                <TableCell>{data.logins}</TableCell>
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

export default UsersKPI;
