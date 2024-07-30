import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Paper,
  TableContainer,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import API from '../../../../../API';

const CRMInformationTable = ({ onSelectionChange }) => {
  const [crmData, setCrmData] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [editContact, setEditContact] = useState({
    email: '',
    firstName: '',
    phone: '',
  });

  useEffect(() => {
    const fetchCrmDetails = async () => {
      setIsLoading(true);
      try {
        const data = await API.crm.contacts();
        const filteredData = data.filter((contact) => contact.status !== 'unsubscribe');
        setCrmData(filteredData);
        const selection = filteredData.reduce((acc, contact) => {
          acc[contact.id] = false;
          return acc;
        }, {});
        setSelectedContacts(selection);
        onSelectionChange([]);
        console.log('Fetched CRM data:', filteredData);
      } catch (error) {
        console.error('Failed to fetch CRM contact details:', error);
        setError(error);
      }
      setIsLoading(false);
    };

    fetchCrmDetails();
  }, [onSelectionChange]);

  const handleSelect = (id) => {
    const newSelectedContacts = { ...selectedContacts, [id]: !selectedContacts[id] };
    setSelectedContacts(newSelectedContacts);
    const selectedContactsList = crmData.filter((contact) => newSelectedContacts[contact.id]);
    onSelectionChange(selectedContactsList);
    console.log('Selected contacts:', newSelectedContacts);
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    const newSelectedContacts = crmData.reduce((acc, contact) => {
      acc[contact.id] = isChecked;
      return acc;
    }, {});
    setSelectedContacts(newSelectedContacts);
    const selectedContactsList = isChecked ? crmData : [];
    onSelectionChange(selectedContactsList);
    console.log('Select all contacts:', newSelectedContacts);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  };

  const handleRemoveEmails = async () => {
    const selectedIds = Object.keys(selectedContacts).filter((id) => selectedContacts[id]);
    try {
      const updatedContacts = await API.crm.update_contact_status({ ids: selectedIds, status: 'unsubscribe' });
      const filteredData = crmData
        .map((contact) =>
          selectedIds.includes(contact.id) ? null : contact
        )
        .filter((contact) => contact !== null);

      setCrmData(filteredData);
      setSelectedContacts({});
      onSelectionChange([]);
    } catch (error) {
      console.error('Failed to remove contacts:', error);
    }
  };

  const handleOpenEditDialog = (contact) => {
    setCurrentContact(contact);
    setEditContact({
      email: contact.email,
      firstName: contact.first_name,
      phone: contact.phone,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleEditContactChange = (e) => {
    const { name, value } = e.target;
    setEditContact({
      ...editContact,
      [name]: value,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await API.crm.update_contact({
        email: editContact.email,
        firstName: editContact.firstName,
        phone: editContact.phone,
      });
      const updatedData = crmData.map((contact) =>
        contact.email === editContact.email
          ? { ...contact, first_name: editContact.firstName, phone: editContact.phone }
          : contact
      );
      setCrmData(updatedData);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const allSelected = crmData.length > 0 && Object.values(selectedContacts).every(Boolean);
  const indeterminate = Object.values(selectedContacts).some(Boolean) && !allSelected;

  return (
    <>
      <Button onClick={handleRemoveEmails} variant="contained" color="primary" fullWidth>
        Remove Email
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAll}
                  style={{ color: 'white' }}
                  checked={allSelected}
                  indeterminate={indeterminate}
                />
              </TableCell>
              <TableCell style={{ color: 'white' }}>Email</TableCell>
              <TableCell style={{ color: 'white' }}>First Name</TableCell>
              <TableCell style={{ color: 'white' }}>Status</TableCell>
              <TableCell style={{ color: 'white' }}>Phone</TableCell>
              <TableCell style={{ color: 'white' }}>Last Proposal</TableCell>
              <TableCell style={{ color: 'white' }}>Contact Source</TableCell>
              <TableCell style={{ color: 'white' }}>Last Contacted</TableCell>
              <TableCell style={{ color: 'white' }}>Next Reminder</TableCell>
              <TableCell style={{ color: 'white' }}>Notes</TableCell>
              <TableCell style={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crmData.map((contact) => (
              <TableRow key={contact.id} selected={selectedContacts[contact.id]}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedContacts[contact.id]}
                    onChange={() => handleSelect(contact.id)}
                  />
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.first_name}</TableCell>
                <TableCell>{contact.status}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.last_proposal}</TableCell>
                <TableCell>{contact.contact_source}</TableCell>
                <TableCell>{formatDate(contact.last_contacted)}</TableCell>
                <TableCell>{formatDate(contact.next_reminder)}</TableCell>
                <TableCell>{contact.notes}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEditDialog(contact)} variant="contained" color="secondary">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit the details of the contact below.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            value={editContact.firstName}
            onChange={handleEditContactChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            value={editContact.phone}
            onChange={handleEditContactChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CRMInformationTable;
