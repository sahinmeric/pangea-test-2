import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Paper, TableContainer } from '@mui/material';
import client from '../../../../../API'; // Ensure the client has an appropriate method for GET requests

const SharedWithTable = ({ onSelectionChange }) => {
    const [userData, setUserData] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});

    const { mutate: fetchUserDetailsMutate } = useMutation(client.users.fetchSharedWith, {
        onSuccess: (data) => {
            console.log('Fetched user details:', data); // Debugging log
            setUserData(data);
            const selection = data.reduce((acc, user) => {
                acc[user.email] = false;
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
        fetchUserDetailsMutate();
    }, []);

    const handleSelect = (email) => {
        const newSelectedUsers = {
            ...selectedUsers,
            [email]: !selectedUsers[email]
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
                        <TableCell>Email</TableCell>
                        <TableCell>Last Campaign Name</TableCell>
                        <TableCell>Last Campaign Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userData.map((user) => (
                        <TableRow key={user.email} selected={selectedUsers[user.email]}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedUsers[user.email]}
                                    onChange={() => handleSelect(user.email)}
                                />
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.last_campaign_name}</TableCell>
                            <TableCell>{user.last_campaign_date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SharedWithTable;
