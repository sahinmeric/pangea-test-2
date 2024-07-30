import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Paper, TableContainer } from '@mui/material';
import client from '../../../../../API'; // Ensure the client has an appropriate method for GET requests

const UserInformationTable = ({ onSelectionChange }) => {
    const [userData, setUserData] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});

    // Fetch user details
    const { mutate: fetchUserDetails } = useMutation(client.users.userDetails, {
        onSuccess: (data) => {
            console.log('Fetched user details:', data); // Debugging log
            setUserData(data);
            const selection = data.reduce((acc, user) => {
                acc[user.id] = false;
                return acc;
            }, {});
            setSelectedUsers(selection);
            onSelectionChange(selection);
        },
        onError: (error) => {
            console.error('Failed to fetch user details:', error);
        },
    });

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const handleSelect = (id) => {
        const newSelectedUsers = {
            ...selectedUsers,
            [id]: !selectedUsers[id]
        };
        setSelectedUsers(newSelectedUsers);
        onSelectionChange(newSelectedUsers);
        console.log('Selected users:', newSelectedUsers); // Debugging log
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        const newSelectedUsers = Object.keys(selectedUsers).reduce((acc, key) => {
            acc[key] = isChecked;
            return acc;
        }, {});
        setSelectedUsers(newSelectedUsers);
        onSelectionChange(newSelectedUsers);
        console.log('Select all users:', newSelectedUsers); // Debugging log
    };

    const allSelected = userData.length > 0 && Object.values(selectedUsers).every(Boolean);
    const indeterminate = Object.values(selectedUsers).some(Boolean) && !allSelected;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                onChange={handleSelectAll}
                                checked={allSelected}
                                indeterminate={indeterminate}
                            />
                        </TableCell>
                        <TableCell style={{ color: "white" }}>Email</TableCell>
                        <TableCell style={{ color: "white" }}>Company Name</TableCell>
                        <TableCell style={{ color: "white" }}>Full Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userData.map((user) => (
                        <TableRow key={user.id} selected={selectedUsers[user.id]}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedUsers[user.id]}
                                    onChange={() => handleSelect(user.id)}
                                />
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.company_name}</TableCell>
                            <TableCell>{user.full_name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserInformationTable;
