import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Checkbox,
  IconButton,
  Switch,
} from "@mui/material";
import { useMutation } from "react-query";
import { Delete as DeleteIcon } from "@mui/icons-material";
import client from "../../../../API";
import { StyledTableRow, StyledTableCell } from "../../../../Utils/styledcell";
import MiscProjDialog from "./miscProjDialog";

const MiscProjects = () => {
  const [miscProjects, setMiscProjects] = useState([]);
  const [filteredMiscProjects, setFilteredMiscProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPrettyView, setIsPrettyView] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const { mutate: fetchMiscProjects } = useMutation(client.miscProjects.list, {
    onSuccess: (data) => {
      const projects = Array.isArray(data.data) ? data.data : [];
      setMiscProjects(projects);
      setFilteredMiscProjects(projects);
    },
    onError: (error) => {
      console.error("Error fetching misc projects:", error);
    },
  });

  const { mutate: deleteProject } = useMutation(client.miscProjects.delete, {
    onSuccess: () => {
      fetchMiscProjects();
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
    },
  });

  useEffect(() => {
    fetchMiscProjects();
  }, []);

  useEffect(() => {
    filterMiscProjects();
  }, [searchQuery, miscProjects]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filterMiscProjects = () => {
    const filtered = miscProjects.filter((project) => {
      return project.type.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredMiscProjects(filtered);
  };

  const handleToggleChange = (event) => {
    setIsPrettyView(event.target.checked);
  };

  const handleDelete = (projectId) => {
    deleteProject({ id: projectId });
  };

  const handleSelectChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleCardClick = (project) => {
    setDialogContent(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          my: 4,
          width: "100%",
          overflowX: "auto",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by type"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: 240 }}
        />
        <Typography>Make it Pretty</Typography>
        <Switch
          checked={isPrettyView}
          onChange={handleToggleChange}
          color="secondary"
        />
      </Box>
      {isPrettyView ? (
        <Grid container spacing={2}>
          {filteredMiscProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <Card onClick={() => handleCardClick(project)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {project.type}
                  </Typography>
                  <Typography variant="body2">Status: {project.status}</Typography>
                  <Typography variant="body2">
                    Created: {new Date(project.time_created).toLocaleDateString()}
                  </Typography>
                  {project.creator_data && (
                    <Typography variant="body2">
                      Creator Data: {JSON.stringify(project.creator_data)}
                    </Typography>
                  )}
                  {project.event_details && (
                    <Typography variant="body2">
                      Event Details: {JSON.stringify(project.event_details)}
                    </Typography>
                  )}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: "80vw", marginInline: "auto" }}>
          <Table aria-label="misc projects table" width={"100%"}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Select</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Created</StyledTableCell>
                <StyledTableCell>Creator Data</StyledTableCell>
                <StyledTableCell>Event Details</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMiscProjects.length > 0 ? (
                filteredMiscProjects.map((project) => (
                  <StyledTableRow key={project.id} onClick={() => handleCardClick(project)}>
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(project.id)}
                        onChange={() => handleSelectChange(project.id)}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{project.type}</StyledTableCell>
                    <StyledTableCell>{project.status}</StyledTableCell>
                    <StyledTableCell>
                      {new Date(project.time_created).toLocaleDateString()}
                    </StyledTableCell>
                    <StyledTableCell>
                      {project.creator_data ? JSON.stringify(project.creator_data) : "N/A"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {project.event_details ? JSON.stringify(project.event_details) : "N/A"}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell colSpan="7" align="center">
                    No misc projects available
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <MiscProjDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        dialogContent={dialogContent}
        setDialogContent={setDialogContent}
      />
    </Box>
  );
};

export default MiscProjects;
