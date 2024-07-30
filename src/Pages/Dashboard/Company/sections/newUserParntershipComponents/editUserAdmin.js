import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useMutation } from 'react-query';
import client from '../../../../../API'; // Adjust the path to your API client

const EditUserDialog = ({ open, onClose, userInfo }) => {
    const [userDetails, setUserDetails] = useState(userInfo || {});

    useEffect(() => {
        setUserDetails(userInfo || {});
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: checked,
        }));
    };

    const mutation = useMutation(
        (updatedUser) => {
            return client.users.editUserWithCredits(updatedUser);
        },
        {
            onSuccess: () => {
                console.log('Edit successful');
                onClose(true);
            },
            onError: (error) => {
                console.error('Error editing user', error);
            },
        }
    );

    const handleSubmit = () => {
        mutation.mutate(userDetails);
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Edit {userDetails.id ? 'User' : 'Creator User'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    margin="dense"
                    value={userDetails.username || ''}
                    onChange={handleChange}
                    required
                />
                {userDetails.id ? (
                    <>
                        <TextField
                            label="First Name"
                            name="first_name"
                            fullWidth
                            margin="dense"
                            value={userDetails.first_name || ''}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            fullWidth
                            margin="dense"
                            value={userDetails.last_name || ''}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            margin="dense"
                            value={userDetails.email || ''}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Company ID"
                            name="company_id"
                            fullWidth
                            margin="dense"
                            value={userDetails.company_id || ''}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Company Name"
                            name="company_name"
                            fullWidth
                            margin="dense"
                            value={userDetails.company_name || ''}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Address"
                            name="address"
                            fullWidth
                            margin="dense"
                            value={userDetails.address || ''}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={userDetails.status ? 'Active' : 'Inactive'}
                                onChange={handleChange}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Type"
                            name="type"
                            fullWidth
                            margin="dense"
                            value={userDetails.type || ''}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Last Login"
                            name="last_login"
                            type="date"
                            fullWidth
                            margin="dense"
                            value={userDetails.last_login || ''}
                            onChange={handleChange}
                        />
                        <TextField
                            label="PHPHref"
                            name="phphref"
                            fullWidth
                            margin="dense"
                            value={userDetails.phphref || ''}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Credits"
                            name="credits"
                            type="number"
                            fullWidth
                            margin="dense"
                            value={userDetails.credits || ''}
                            onChange={handleChange}
                        />
                    </>
                ) : (
                    <>
                        <TextField
                            label="Balance"
                            name="balance"
                            fullWidth
                            margin="dense"
                            value={userDetails.balance || ''}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Payout Preferred"
                            name="payout_preferred"
                            fullWidth
                            margin="dense"
                            value={userDetails.payout_preferred || ''}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Stripe ID"
                            name="stripe_id"
                            fullWidth
                            margin="dense"
                            value={userDetails.stripe_id || ''}
                            onChange={handleChange}
                        />
                        <TextField
                            label="PayPal"
                            name="paypal"
                            fullWidth
                            margin="dense"
                            value={userDetails.paypal || ''}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            margin="dense"
                            value={userDetails.email || ''}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Credits"
                            name="credits"
                            type="number"
                            fullWidth
                            margin="dense"
                            value={userDetails.credits || ''}
                            onChange={handleChange}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserDialog;
