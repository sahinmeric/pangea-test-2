import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, Button, Tabs, Tab } from '@mui/material';
import client from '../../../../../API'; // Ensure the client has an appropriate method for GET requests
import EditCreditsDialog from './editCreditsAdmin'; // Adjust the path as necessary
import EditUserDialog from './editUserAdmin'; // Adjust the path as necessary

const UserAdminView = ({ onSelectionChange }) => {
    const [userData, setUserData] = useState([]);
    const [creatorUserData, setCreatorUserData] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState({});
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isCreatorUser, setIsCreatorUser] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Fetch user details
    const { mutate: fetchUserDetails } = useMutation(client.users.userAdminFetch, {
        onSuccess: (data) => {
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

    // Fetch creator user details
    const { mutate: fetchCreatorUserDetails } = useMutation(client.users.creatorUserAdminFetch, {
        onSuccess: (data) => {
            setCreatorUserData(data);
        },
        onError: (error) => {
            console.error('Failed to fetch creator user details:', error);
        },
    });

    useEffect(() => {
        fetchUserDetails();
        fetchCreatorUserDetails();
    }, []);

    const handleEditClick = (user, isCreator = false) => {
        setUserToEdit(user);
        setIsCreatorUser(isCreator);
        setEditDialogOpen(true);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="User Table" />
                <Tab label="Creator User Table" />
            </Tabs>
            {tabValue === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Company ID</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Updated At</TableCell>
                                <TableCell>Last Login</TableCell>
                                <TableCell>PHPHref</TableCell>
                                <TableCell>Credits</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userData.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.first_name}</TableCell>
                                    <TableCell>{user.last_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.company_id}</TableCell>
                                    <TableCell>{user.company_name}</TableCell>
                                    <TableCell>{user.address}</TableCell>
                                    <TableCell>{user.status ? 'Active' : 'Inactive'}</TableCell>
                                    <TableCell>{user.type}</TableCell>
                                    <TableCell>{user.created_at}</TableCell>
                                    <TableCell>{user.updated_at}</TableCell>
                                    <TableCell>{user.last_login}</TableCell>
                                    <TableCell>{user.phphref}</TableCell>
                                    <TableCell>{user.credits}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditClick(user, false)}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {tabValue === 1 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Balance</TableCell>
                                <TableCell>Date Created</TableCell>
                                <TableCell>Date Updated</TableCell>
                                <TableCell>Last Sign In</TableCell>
                                <TableCell>Payout Preferred</TableCell>
                                <TableCell>Stripe ID</TableCell>
                                <TableCell>PayPal</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Credits</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {creatorUserData.map((user) => (
                                <TableRow key={user.username}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.balance}</TableCell>
                                    <TableCell>{user.date_created}</TableCell>
                                    <TableCell>{user.date_updated}</TableCell>
                                    <TableCell>{user.last_sign_in}</TableCell>
                                    <TableCell>{user.payout_preferred}</TableCell>
                                    <TableCell>{user.stripe_id}</TableCell>
                                    <TableCell>{user.paypal}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.credits}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditClick(user, true)}>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {userToEdit && isCreatorUser ? (
                <EditCreditsDialog
                    open={editDialogOpen}
                    onClose={(updated) => {
                        setEditDialogOpen(false);
                        if (updated) {
                            fetchUserDetails();
                            fetchCreatorUserDetails();
                        }
                    }}
                    userInfo={userToEdit}
                />
            ) : (
                <EditUserDialog
                    open={editDialogOpen}
                    onClose={(updated) => {
                        setEditDialogOpen(false);
                        if (updated) {
                            fetchUserDetails();
                            fetchCreatorUserDetails();
                        }
                    }}
                    userInfo={userToEdit}
                />
            )}
        </>
    );
};

export default UserAdminView;
