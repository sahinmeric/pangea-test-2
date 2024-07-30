import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import { useMutation } from 'react-query';
import client from '../../../../../API'; // Adjust the path to your API client

const EditCreditsDialog = ({ open, onClose, userInfo }) => {
    const [credits, setCredits] = useState(userInfo.credits || '');

    useEffect(() => {
        setCredits(userInfo.credits || '');
    }, [userInfo]);

    const handleChange = (e) => {
        setCredits(e.target.value);
    };

    const mutation = useMutation(
        (updatedUser) => {
            return client.users.editCreatorWithCredits({ username: userInfo.username, credits });
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
        mutation.mutate();
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Edit Credits</DialogTitle>
            <DialogContent>
                <TextField
                    label="Credits"
                    name="credits"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={credits}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCreditsDialog;
