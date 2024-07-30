import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { useQuery } from 'react-query';
import { ConfigValue } from '../../../../Config';
import CreatorMiscPopup from './creatorMiscPopup';

const CreatorMore = ({ username }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentCreatorData, setCurrentCreatorData] = useState([]);

  const handleOpenDialog = (project) => {
    setCurrentProject(project);
    setCurrentCreatorData(project.creator_data || []);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchMiscProjects = async () => {
    const response = await fetch(`${ConfigValue.PUBLIC_REST_API_ENDPOINT}/creatorUsers/misc_projects_by_creator?username=${username}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched data:', data); // Log the fetched data
    return data;
  };

  const { isLoading, error, data: projects } = useQuery(['miscProjects', username], fetchMiscProjects, {
    keepPreviousData: true
  });

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Project ID", "Project Name", "Status"],
      ...projects.map(project => [project.id, project.name, project.status])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${username}_misc_projects.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveCreator = (creatorId) => {
    setCurrentCreatorData(currentCreatorData.filter(creator => creator.creator_id !== creatorId));
  };

  if (isLoading) return <CircularProgress sx={{ color: 'white' }} />;
  if (error) return <Typography sx={{ color: 'error' }}>Error fetching projects: {error.message}</Typography>;

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          All Misc Projects
        </Typography>
        <Button onClick={handleDownloadCSV} sx={{ mb: 2 }}>
          Download as CSV
        </Button>
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{ minWidth: 300 }}>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects && projects.length > 0 ? projects.map(project => (
                <TableRow key={project.id}>
                  <TableCell onClick={() => handleOpenDialog(project)}>{project.name}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => { /* handle share */ }}>
                      <ShareIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No projects available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {currentProject && (
        <CreatorMiscPopup
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          project={currentProject}
          creatorData={currentCreatorData}
          handleRemoveCreator={handleRemoveCreator}
        />
      )}
    </div>
  );
};

export default CreatorMore;
